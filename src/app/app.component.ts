import { AppState } from './app.global';
import { SettingsPage } from './../pages/settings/settings';
import { UserProvider } from './../providers/user/user';
import { UtilsProvider } from './../providers/utils/utils';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, ActionSheetController } from 'ionic-angular';
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
    public global: AppState
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
    // console.log('console @userProvider -> ', userProvider.getCurrentUser());
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.checkConnection();
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
      title: 'Choose or take a picture',
      buttons: [
        {
          text: 'Take a picture',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Choose pictures',
          handler: () => {
            this.openImagePicker();
          }
        }
      ]
    });
    actionSheet.present();
  }

  takePicture() {
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
            this.photos.push(newImage);
            this.profilePicture = newImage;
          }, error => console.error("Error cropping image", error));
      }, function (error) {
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
    console.log('Setting theming #1 ...');
    this.global.set('theme', theme);
  }

//   checkConnection() {
//     var networkState = navigator.connection.type;

//     var states = {};
//     states[Connection.UNKNOWN]  = 'Unknown connection';
//     states[Connection.ETHERNET] = 'Ethernet connection';
//     states[Connection.WIFI]     = 'WiFi connection';
//     states[Connection.CELL_2G]  = 'Cell 2G connection';
//     states[Connection.CELL_3G]  = 'Cell 3G connection';
//     states[Connection.CELL_4G]  = 'Cell 4G connection';
//     states[Connection.CELL]     = 'Cell generic connection';
//     states[Connection.NONE]     = 'No network connection';

//     alert('Connection type: ' + states[networkState]);
// }

}
