import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-history-table',
  templateUrl: 'history-table.html',
})
export class HistoryTablePage {

  trainings: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.trainings = this.sortByKey(this.navParams.get("trainings"), 'timeStart');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryTablePage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x > y) ? -1 : ((x < y) ? 0 : 1));
    });
  }

}
