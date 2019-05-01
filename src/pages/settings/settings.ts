import { UserProvider } from './../../providers/user/user';
import { AppState } from './../../app/app.global';
import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController, IonicPage, LoadingController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { AlertService } from '../../providers/utils/alert.service';
import { ToastService } from './../../providers/utils/toast.service';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  enableNotifications = true;
  enableTheming = true;

  user = {
    name: 'Default User',
    imageUrl: 'assets/imgs/user.svg'
  };

  constructor(
    public navCtrl: NavController,
    public alertService: AlertService,
    public toastCtrl: ToastService,
    public camera: Camera,
    public global: AppState,
    public userProvider: UserProvider,
    public afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController
  ) {
    console.log('User log settings.. ', this.userProvider.getCurrentUser())
    this.afAuth.auth.onAuthStateChanged((currentUser) => {
      console.log('On Constructor - currentUser >>>> ', currentUser)
      this.user.name = currentUser.displayName;
      // this.user.name = (this.userProvider.getCurrentUser().fullName) ? this.userProvider.getCurrentUser().fullName : 'Default User';
      this.user.imageUrl = currentUser.photoURL;
    });
  }

  toggleNotifications() {
    if (this.enableNotifications) {
      this.toastCtrl.create('Notificaciones habilitadas.');
    } else {
      this.toastCtrl.create('Notificaciones deshabilitadas.');
    }
  }

  updateImage(value) {
    this.user.imageUrl = 'data:image/jpeg;base64,' + value.val();
  }

  updateProfileImage() {
    this.camera.getPicture({
      quality: 50,
      allowEdit: true,
      cameraDirection: this.camera.Direction.FRONT,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 600,
      targetHeight: 600
    }).then((imageData) => {
      this.user.imageUrl = 'data:image/jpeg;base64,' + imageData;
      this.afAuth.auth.onAuthStateChanged((currentUser) => {
        this.createUploadTask(this.user.imageUrl, currentUser.uid);
      });
    }, (err) => {
      console.log('Error: ' + err);
      this.toastCtrl.create('Imagen no seleccionada!');
    });
  }

  logOut() {
    this.alertService.presentAlertWithCallback('Cerrar Sesión', '¿Estás seguro que deseas salir?')
    .then((yes) => {
      if (yes) {
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  changeTheme(theme) {
    this.global.set('theme', theme);
  }

  createUploadTask(file: string, name: string) {
    return new Promise((resolve, reject) => {
      let loading = this.loadingCtrl.create({
        content: 'Espera por favor...',
      });
      loading.present()

      const pictures = firebase.storage().ref(`images/` + name);
      const uploadTask = pictures.putString(file, 'data_url');

      loading.setContent('Uploading Image...')

      uploadTask.on('state_changed', function (snapshot: firebase.storage.UploadTaskSnapshot) {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        loading.setContent(`Uploaded ${Math.round(progress)}% ...`)
      }, (error) => {
        loading.dismiss()
        console.log('Error in uploadTask.on >> ', error);
      }, () => {
        // Handle successful uploads on complete
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          this.afAuth.auth.onAuthStateChanged((currentUser) => {
            currentUser.updateProfile({
              displayName: currentUser.displayName,
              photoURL: downloadURL
            }).then(() => {
              console.log('update success onAuthStateChanged')
              loading.dismiss()
              resolve()
            }).catch(() => {
              console.log('update NOT success onAuthStateChanged')
              loading.dismiss()
              reject()
            })
          });
        }).catch((error) => {
          console.log('Error in uploadTask.snapshot.ref >> ', error);
          loading.dismiss()
          reject();
        });
      });
    })
  }

}
