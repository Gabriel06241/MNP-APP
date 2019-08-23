import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-statistics-description',
  templateUrl: 'statistics-description.html',
})
export class StatisticsDescriptionPage {

  trainings: any = [];
  base64Image = 'assets/imgs/statistics_understanding.png';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.trainings = this.sortByKey(this.navParams.get("trainings"), 'timeStart');
    console.log('this.trainings >>>> ', this.trainings)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatisticsDescriptionPage');
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
