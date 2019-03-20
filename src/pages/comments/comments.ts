import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import moment from 'moment';
import firebase from 'firebase';

@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

  spot: any = {};
  comments: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.spot = this.navParams.get("spot");
    firebase.firestore().collection("comments").where("spotId", "==", this.spot.spotId)
    .orderBy("created", "asc")
    .get()
      .then((data) => {
        console.log('data >>> ', data);
        this.comments = data.docs;
      }).catch((error) => {
        console.log(error)
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentsPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  getTimeAgo(time) {
    let difference = moment(time).diff(moment())
    return moment.duration(difference).locale('es').humanize()
  }

}
