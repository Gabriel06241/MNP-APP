import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the HydratePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hydrate',
  templateUrl: 'hydrate.html',
})
export class HydratePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HydratePage');
    // setTimeout(function() {
    //   console.log('setTimeOut...')
    //   this.close();
    // }, 5000)
  }



  close() {
    this.viewCtrl.dismiss();
  }

}
