import { AppState } from './app.global';
import { SettingsPage } from './../pages/settings/settings';
import { UserProvider } from './../providers/user/user';
import { UtilsProvider } from './../providers/utils/utils';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, ActionSheetController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from './../pages/login/login';
import { HomePage } from './../pages/home/home';
import { SpotsPage } from './../pages/spots/spots';
import { AboutPage } from './../pages/about/about';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { StatisticsPage } from '../pages/statistics/statistics';
import { AngularFireAuth } from 'angularfire2/auth';

export interface MenuItem {
  title: string;
  component: any;
  icon: string;
  perfil: string;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  pages: Array<MenuItem>;
  photos: Array<string>;
  profilePicture: string = 'assets/imgs/user.svg';

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    public userProvider: UserProvider,
    public utilsProvider: UtilsProvider,
    public actionSheetCtrl: ActionSheetController,
    public imagePicker: ImagePicker,
    public camera: Camera,
    public cropService: Crop,
    public loadingCtrl: LoadingController,
    public global: AppState,
    public afAuth: AngularFireAuth,
  ) {
    this.initializeApp();

    this.pages = [
      { title: 'Rutinas', component: HomePage, icon: 'md-body', perfil: 'user' },
      { title: 'Estadisticas', component: StatisticsPage, icon: 'md-stats', perfil: 'admin' },
      { title: 'Spots', component: SpotsPage, icon: 'md-pin', perfil: 'admin' },
      { title: 'Configuración', component: SettingsPage, icon: 'md-settings', perfil: 'admin' },
      { title: 'Acerca de', component: AboutPage, icon: 'md-information-circle', perfil: 'admin' },
      { title: 'Cerrar Sesión', component: AboutPage, icon: 'md-power', perfil: 'admin' }
    ];
    // ADVERTENCIA
    // console.log('User log settings.. ', this.userProvider.getCurrentUser())
    // this.afAuth.auth.onAuthStateChanged((currentUser) => {
    //   console.log('On Constructor - currentUser >>>> ', currentUser)
    //   this.profilePicture = currentUser.photoURL;
    // });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
    });
  }

  openPage(page) {
    if (page.title != 'Cerrar Sesión') {
      this.nav.setRoot(page.component);
    } else {
      this.logout();
    }
  }

  logout() {
    let confirmAlert = this.alertCtrl.create({
      title: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas salir?',
      buttons: [{
        text: 'No',
        role: 'Cancel',
        handler: () => {
        }
      }, {
        text: 'Si',
        handler: () => {
          this.nav.setRoot(LoginPage);
        }
      }]
    })
    confirmAlert.present();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Seleccione tu foto de perfil',
      buttons: [
        {
          text: 'Tomar foto',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Seleccionar imagen',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            // this.openImagePicker();
            this.getPicture();
          }
        },
        {
          text: 'Cancelar',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'destructive',
          handler: () => {
            console.log('Evento cancelado por el usuario.');
          }
        }
      ]
    });
    actionSheet.present();
  }

  takePictures() {
    let options = {
      quality: 100,
      correctOrientation: true
    };
    this.camera.getPicture(options)
      .then((data) => {
        this.photos = new Array<string>();
        this.cropService
          .crop(data, { quality: 75 })
          .then((newImage) => {
            console.log('newImage >>> ', newImage);
            if (newImage) {
              this.photos.push(newImage);
              this.profilePicture = newImage;
            }
          }, error => console.error("Error cropping image", error));
      }, (error) => {
        console.log(error);
      });
  }

  openImagePicker() {
    let options = {
      maximumImagesCount: 5,
    }
    this.photos = new Array<string>();
    this.imagePicker.getPictures(options)
      .then((results) => {
        console.log('results  >>>  ', results);
        this.reduceImages(results).then(() => {
          console.log('all images cropped!!');
        });
      }, (err) => { console.log(err) });
  }

  reduceImages(selected_pictures: any): any {
    return selected_pictures.reduce((promise: any, item: any) => {
      return promise.then((result) => {
        return this.cropService.crop(item, { quality: 75 })
          .then(cropped_image => this.photos.push(cropped_image));
      });
    }, Promise.resolve());
  }

  changeTheme(theme) {
    this.global.set('theme', theme);
  }

  takePicture() {
    const loading = this.loadingCtrl.create();
    loading.present();
    return this.getPictureFromCamera().then(picture => {
      if (picture) {
        this.profilePicture = picture;
      }
      loading.dismiss();
    }, error => {
      alert(error);
    });
  }

  getPicture() {
    const loading = this.loadingCtrl.create();
    loading.present();
    return this.getPictureFromPhotoLibrary().then(picture => {
      if (picture) {
        this.profilePicture = picture;
      }
      loading.dismiss();
    }, error => {
      alert(error);
    });
  }

  getPictureFromCamera() {
    return this.getImage(this.camera.PictureSourceType.CAMERA, true);
  }

  getPictureFromPhotoLibrary() {
    return this.getImage(this.camera.PictureSourceType.PHOTOLIBRARY, true);
  }

  // This method takes optional parameters to make it more customizable
  getImage(pictureSourceType, crop = false, quality = 75, allowEdit = true, saveToAlbum = true) {
    console.log('@crop  >>>> ', crop)
    const options = {
      quality,
      allowEdit,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: pictureSourceType,
      encodingType: this.camera.EncodingType.PNG,
      saveToPhotoAlbum: saveToAlbum,
      targetWidth: 600,
      targetHeight: 600
    };

    // If set to crop, restricts the image to a square of 600 by 600
    // if (crop) {
    //   options['targetWidth'] = 600;
    //   options['targetHeight'] = 600;
    // }

    return this.camera.getPicture(options).then(imageData => {
      const base64Image = 'data:image/png;base64,' + imageData;
      return base64Image;
    }, error => {
      console.log('CAMERA ERROR -> ' + JSON.stringify(error));
    });
  }

}
