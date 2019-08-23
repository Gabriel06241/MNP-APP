import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';
import { Network } from '@ionic-native/network';
import { NativeAudio } from '@ionic-native/native-audio';

interface Sound {
  key: string;
  asset: string;
  isNative: boolean
}

@Injectable()
export class UtilsProvider {

  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  private forceWebAudio: boolean = true;

  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private network: Network,
    private platform: Platform,
    private nativeAudio: NativeAudio
  ) { }

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

  public removeAccents(str) {
    let result = str.toLowerCase();
    result = result.replace(new RegExp(/\s/g), "_");
    result = result.replace(new RegExp(/[àáâãäå]/g), "a");
    result = result.replace(new RegExp(/[èéêë]/g), "e");
    result = result.replace(new RegExp(/[ìíîï]/g), "i");
    // result = result.replace(new RegExp(/ñ/g), "n");
    result = result.replace(new RegExp(/[òóôõö]/g), "o");
    result = result.replace(new RegExp(/[ùúûü]/g), "u");
    return result;
  }

  public capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  public checkConnection() {
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

    if (states[networkState] == 'No network connection') {
      return false;
    }
    return true;
  }


  preload(key: string, asset: string): void {
    if(this.platform.is('cordova') && !this.forceWebAudio){
      this.nativeAudio.preloadSimple(key, asset);
      this.sounds.push({
        key: key,
        asset: asset,
        isNative: true
      });
    } else {
      let audio = new Audio();
      audio.src = asset;
      this.sounds.push({
        key: key,
        asset: asset,
        isNative: false
      });
    }
  }

  play(key: string): void {
    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });
    if(soundToPlay.isNative){
      this.nativeAudio.play(soundToPlay.asset).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
    } else {
      this.audioPlayer.src = soundToPlay.asset;
      this.audioPlayer.play();
    }
  }

}
