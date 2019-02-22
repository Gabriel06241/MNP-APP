import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController } from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';

/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilsProvider {

  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
    console.log('Hello UtilsProvider Provider');
  }

  public showLoading(msg) {
    this.loadingCtrl.create({
      content: msg,
      duration: 3000,
      dismissOnPageChange: true
    }).present();
  }

  public showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 3000
    }).present();
  }

  public showAlert(title, msg) {
    this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    }).present();
  }

  public getHashMd5(str) {
    return Md5.hashStr(str).toString();
  }

  public validateDataUser(user) {
    if (JSON.stringify(user) == '{}') {
      return true;
    }
    let keys = Object.keys(user);
    keys.forEach(function (key) {
      if (user[key] == '' || !user[key]) {
        return true;
      }
    })
    return false;
  }

  public validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
