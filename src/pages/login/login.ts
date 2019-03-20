import { Network } from '@ionic-native/network';
import { UtilsProvider } from './../../providers/utils/utils';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserProvider } from '../../providers/user/user';
import { HomePage } from "./../home/home";
import { UserPage } from "./../user/user";

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
    private network: Network
  ) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.utilsProvider.showToast('network was disconnected :-(');
    });

    // stop disconnect watch
    disconnectSubscription.unsubscribe();

    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.utilsProvider.showToast('network connected!');

      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
          this.utilsProvider.showToast('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });

    // stop connect watch
    connectSubscription.unsubscribe();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  registerUser() {
    const internetConnection = this.checkConnection();
    console.log('checking internet connection before go on register page...', internetConnection)
    this.navCtrl.setRoot(UserPage);
  }

  async loginUser(user) {
    if (this.utilsProvider.validateDataUser(user)) {
      return this.utilsProvider.showAlert("Error campos vacíos", "Por favor complete todos los campos.");
    }
    const internetConnection = this.checkConnection();
    if (!internetConnection) {
      this.utilsProvider.showAlert('Lo sentimos', 'Revisa tu conexion a internet.');
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
                  photoURL: 'some/url'
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
        // this.utilsProvider.showLoading('Por favor espere...');
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
            this.checkConnection();
            this.sendResetEmail(data.email).then((response) => {
              console.log('@response => ', JSON.stringify(response));
              let toastMsg = this.toastCtrl.create({
                message: 'Correo enviado exitosamente!',
                duration: 3000,
                position: 'top',
                cssClass: 'dark-trans',
                closeButtonText: 'OK',
                showCloseButton: true
              })
              if (response && !response['error']) {
                toastMsg.present();
              } else {
                toastMsg.setMessage('Por favor ingrese valido!');
                toastMsg.present();
              }
            }).catch(error => {
              console.log('@error => ', error);
            });
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


  checkConnection() {
    let networkState = null;

    setTimeout(() => {
      networkState = this.network.type;
    }, 3000)

    let states = {};
    states[this.network.Connection.UNKNOWN] = 'Unknown connection';
    states[this.network.Connection.ETHERNET] = 'Ethernet connection';
    states[this.network.Connection.WIFI] = 'WiFi connection';
    states[this.network.Connection.CELL_2G] = 'Cell 2G connection';
    states[this.network.Connection.CELL_3G] = 'Cell 3G connection';
    states[this.network.Connection.CELL_4G] = 'Cell 4G connection';
    states[this.network.Connection.CELL] = 'Cell generic connection';
    states[this.network.Connection.NONE] = 'No network connection';

    console.log('checking internet connection... ', networkState)

    if (states[networkState] == 'No network connection') {
      return false;
      // this.utilsProvider.showAlert('Lo sentimos', 'Revisa tu conexion a internet, ' + states[networkState] + '.');
    }
    return true;
  }

}
