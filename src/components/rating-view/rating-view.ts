import { UtilsProvider } from './../../providers/utils/utils';
import { Events, ViewController, PopoverController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import firebase from 'firebase';

@Component({
  selector: 'rating-view',
  templateUrl: 'rating-view.html'
})
export class RatingViewComponent {

  rating: number = 0;
  average: number = 0;
  count: number = 0;
  readOnly: boolean = false;
  currentUser: string;
  spotData: any;

  constructor(
    public events: Events,
    public viewCtrl: ViewController,
    public popoverCtrl: PopoverController,
    public navParams: NavParams,
    public utilsProvider: UtilsProvider
  ) {

    events.subscribe('star-rating:changed', (starRating) => {
      this.rating = starRating;
    });

    this.currentUser = firebase.auth().currentUser.uid;
    this.spotData = this.navParams.get('event');
    this.count = (this.spotData.raters) ? this.spotData.raters.length : 0;
    this.spotData.raters = (this.spotData.raters) ? this.spotData.raters : [];
    this.spotData.rating = (this.spotData.rating) ? this.spotData.rating : { acumulator: 0, average: 0, count: 0 };
    // this.spotData.raters = (this.spotData.raters) ? this.spotData.raters.push(this.currentUser) : [this.currentUser];
    this.spotData.raters.forEach(rater => {
      if (rater == this.currentUser) {
        this.readOnly = true;
        this.average = this.spotData.rating.average.toFixed(1);
        this.rating = this.spotData.rating.average;
        this.count = this.spotData.rating.count;
      }
    });
    
  }

  onModelChange(event) {
    this.rating = event;
  }

  updateSpotRating() {
    ++this.spotData.rating.count
    this.spotData.rating.acumulator += this.rating;
    this.spotData.rating.average = this.spotData.rating.acumulator / this.spotData.rating.count;
    this.spotData.raters.push(this.currentUser);
    firebase.firestore().collection("spot").doc(this.navParams.get('event').spotId).update(
      {
        "rating.count": this.spotData.rating.count,
        "rating.acumulator": this.spotData.rating.acumulator,
        "rating.average": this.spotData.rating.average,
        "raters": this.spotData.raters
      }
    ).then(() => {
      console.log('Updated!')
      this.utilsProvider.showToast(`Su calificacion ${this.rating}, fue asignada correctamente!`);
      this.viewCtrl.dismiss();
    }).catch((error) => {
      console.log('Error!', error)
    })
  }

  cancelRating() {
    this.viewCtrl.dismiss();
  }

}
