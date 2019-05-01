import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { UtilsProvider } from '../../providers/utils/utils';

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  user: any = {
    fullName: '',
    email: '',
    password: ''
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public toastCtrl: ToastController,
    public utilsProvider: UtilsProvider,
    public userProvider: UserProvider
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

  async saveUser(user) {
    if (this.utilsProvider.validateDataUser(user)) {
      this.utilsProvider.showToast("Por favor complete todos los campos.");
      return this.utilsProvider.showAlert("Error campos vacíos", "Por favor complete todos los campos.");
    }

    if (!user.id) {
      await this.userProvider.getUserFromFieldValue('email', user.email)
      .then((response) => {
        console.log('console @response -> ', response);
        if (response.length) {
          return this.utilsProvider.showAlert("Alerta de error", "El correo " + user.email + " ya se encuentra registrado!");
        }
      });

      try {
        console.log('try');
        const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, this.utilsProvider.getHashMd5(user.password));
        if (result) {
          this.afAuth.auth.onAuthStateChanged((currentUser) => {
            console.log('@currentUser ====>>>> ', currentUser);
            currentUser.updateProfile({
              displayName: user.fullName,
              photoURL: 'assets/imgs/user.svg'
            });
          });
          this.afAuth.auth.currentUser.sendEmailVerification();
          user.id = result.user.uid;
          user.activo = true;
          user.notification = false;
          user.avatarUrl = 'assets/imgs/user.svg';
          this.userProvider.createOrUpdateUser(user);
          this.utilsProvider.showToast('Usuario creado correctamente!');
          this.navCtrl.setRoot(LoginPage);
        }
      } catch (error) {
        console.log('@error => ', error.message);
      }
    } else {
      user.perfil = 'user';
      user.saldo = 0;
      user.activo = true;
      user.notification = false;
      user.avatarUrl = 'assets/imgs/user.svg';
      this.userProvider.createOrUpdateUser(user);
      this.utilsProvider.showToast('Usuario actualizado exitosamente!');
      this.navCtrl.pop();
    }
  }

  redirectLogin() {
    this.navCtrl.setRoot(LoginPage)
  }

}
