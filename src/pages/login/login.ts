import { UtilsProvider } from './../../providers/utils/utils';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserProvider } from '../../providers/user/user';
import { HomePage } from "./../home/home";
import { UserPage } from "./../user/user";
import { Subscription} from 'rxjs/Subscription';
import { MESSAGE_ERROR } from "./../../app/app.errors";
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: any = {};
  resetPassword = false;
  connected: Subscription;
  disconnected: Subscription;
  // flag: boolean = false;
  flag: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public userProvider: UserProvider,
    public forgotCtrl: AlertController,
    public toastCtrl: ToastController,
    public utilsProvider: UtilsProvider,
    private network: Network
  ) {
    this.connected = this.network.onConnect().subscribe(data => {
      this.flag = true;
      // this.displayNetworkUpdate(data.type);
    }, error => console.error(error));

    this.disconnected = this.network.onDisconnect().subscribe(data => {
      this.flag = false;
      // this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
  }

  displayNetworkUpdate(connectionState: string) {
    let networkType = this.network.type;
    this.utilsProvider.showToast(`You are now ${connectionState} via ${networkType}`);
  }

  ionViewWillLeave() {
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }

  registerUser() {
    this.navCtrl.setRoot(UserPage);
  }

  async loginUser(user) {
    if (this.utilsProvider.validateDataUser(user)) {
      return this.utilsProvider.showAlert("Error campos vacíos", "Por favor complete todos los campos.");
    }
    const internetConnection = this.utilsProvider.checkConnection();
    if (!internetConnection) {
      this.utilsProvider.showAlert('Ooops, Lo sentimos...', 'Revisa tu conexion a internet!');
    } else {
      this.utilsProvider.showLoading('Por favor espere...');
      try {
        await this.userProvider.getUserFromFieldValue('email', user.email)
          .then((response) => {
            this.userProvider.setCurrentUser(response[0]);
            if (response.length) {
              user.exist = true;
              user.activo = response[0].activo;
              user.perfil = response[0].perfil;
              this.afAuth.auth.onAuthStateChanged((currentUser) => {
                user.emailVerified = currentUser.emailVerified;
                currentUser.updateProfile({
                  displayName: user.fullName,
                  photoURL: 'assets/imgs/user.svg'
                });
              });
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
        try {
          const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, this.utilsProvider.getHashMd5(user.password))
          if (result) {
            this.navCtrl.setRoot(HomePage, user);
          }
        } catch (error) {
          if (error) {
            console.log('@error >> ', error)
            this.utilsProvider.showToast(MESSAGE_ERROR[error.code]);
          }
        }
      }
    }
  }

  forgotPassword() {
    let forgot = this.forgotCtrl.create({
      title: 'Recuperar contraseña',
      message: "Ingrese su correo para restablecer la contraseña.",
      inputs: [{ name: 'email', placeholder: 'Correo electrónico', type: 'email' }],
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
            // this.utilsProvider.checkConnection();
            this.sendResetEmail(data.email).then((response) => {
              let toastMsg = this.toastCtrl.create({
                message: 'Correo enviado exitosamente!',
                duration: 3000,
                position: 'top',
                cssClass: 'dark-trans',
                closeButtonText: 'OK',
                showCloseButton: true
              })
              if (response['error']) {
                toastMsg.setMessage(MESSAGE_ERROR[response['error'].code]);
              }
              toastMsg.present();
            })
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
      return { error: _error };
    })
  }

}
