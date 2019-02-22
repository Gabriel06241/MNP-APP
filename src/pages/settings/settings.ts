import { UserProvider } from './../../providers/user/user';
import { AppState } from './../../app/app.global';
import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { AlertService } from '../../providers/utils/alert.service';
import { ToastService } from './../../providers/utils/toast.service';
import { AngularFireAuth } from 'angularfire2/auth';


/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  profilePicture: string = 'assets/imgs/user.svg';
  profileRef: any;
  errorMessage: any;

  enableNotifications = true;
  enableTheming = true;
  language: any;
  currency: any;
  paymentMethod: any;

  languages = ['Spanish', 'English', 'Portuguese', 'French'];
  paymentMethods = ['Paypal', 'Credit Card'];
  currencies = ['COP', 'USD', 'EUR'];

  user = {
    name: 'Gabriel...',
    imageUrl: 'assets/imgs/user.svg'
  };

  constructor(
    public navCtrl: NavController,
    public alertService: AlertService,
    public toastCtrl: ToastService,
    public camera: Camera,
    public global: AppState,
    public userProvider: UserProvider,
    public afAuth: AngularFireAuth
  ) {
    console.log('User log settings.. ', this.userProvider.getCurrentUser())

    this.afAuth.auth.onAuthStateChanged((currentUser) => {
      // user.emailVerified = currentUser.emailVerified;
      // emailVerified
      // currentUser.updateProfile({
      //   displayName: user.fullName,
      //   photoURL: 'some/url'
      // });
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
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.user.imageUrl = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      this.toastCtrl.create('Error: ' + err);
    });
  }

  logOut() {
    this.alertService.presentAlertWithCallback('Cerrar Sesión',
      '¿Estás seguro que deseas salir?').then((yes) => {
        if (yes) {
          this.navCtrl.setRoot(LoginPage);
        }
      });
  }

  changeTheme(theme) {
    this.global.set('theme', theme);
  }
}
