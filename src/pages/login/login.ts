import { UtilsProvider } from './../../providers/utils/utils';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserProvider } from '../../providers/user/user';
import { HomePage } from "./../home/home";
import { UserPage } from "./../user/user";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: any = {};
  resetPassword = false;
  error: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public userProvider: UserProvider,
    public forgotCtrl: AlertController,
    public toastCtrl: ToastController,
    public utilsProvider: UtilsProvider,
    public events: Events
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  registerUser() {
    this.navCtrl.setRoot(UserPage);
  }

  async loginUser(user) {
    if (this.utilsProvider.validateDataUser(user)) {
      return this.utilsProvider.showAlert("Error campos vacíos", "Por favor complete todos los campos.");
    }

   try {
      await this.userProvider.getUserFromFieldValue('email', user.email)
        .then((response) => {
          this.userProvider.setCurrentUser(response[0]);
          if (response.length) {
            user.exist = true;
            user.activo = response[0].activo;
            user.perfil = response[0].perfil;
            // this.afAuth.auth.onAuthStateChanged((currentUser) => {
            //   user.emailVerified = currentUser.emailVerified;
            //   // currentUser.updateProfile({
            //   //   displayName: user.fullName,
            //   //   photoURL: 'some/url'
            //   // });
            // });
          }
        }, (err) => {
          console.log('trying to get getUsuarioFromFieldValue', err)
        });
    } catch (error) {
      console.log('error @loginUser => ', error.message);
    }

    if (!user.exist) {
      this.utilsProvider.showToast("Correo y/o contraseña incorrectos!");
    } else {
      this.utilsProvider.showLoading('Por favor espere...');
      try {
        const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, this.utilsProvider.getHashMd5(user.password))
        if (result) {
          this.navCtrl.setRoot(HomePage, user);
        }
      } catch (error) {
        if (error) {
          this.utilsProvider.showToast(error.message);
        }
      }
    }
  }

  forgotPassword() {
    let forgot = this.forgotCtrl.create({
      title: 'Recuperar contraseña',
      message: "Ingrese su correo para restablecer su contraseña.",
      inputs: [{ name: 'email', placeholder: 'Correo', type: 'email' }],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Recuperar',
          handler: data => {
            let response = this.sendResetEmail(data.email)
            .catch(error => {
              console.log('@error => ', error);
            });
            console.log('@response => ', response);
            this.toastCtrl.create({
              message: 'Correo enviado exitosamente!',
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            }).present();
          }
        }
      ]
    });
    forgot.present();
  }

  sendResetEmail(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => this.resetPassword = true)
      .catch(_error => {
        this.error = _error.message
        return { error: 'error' };
      })
  }

}
