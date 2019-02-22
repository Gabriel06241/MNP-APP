import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'Firebase';
import { storage } from "firebase";
// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

/**
 * Generated class for the SpotPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-spot',
  templateUrl: 'spot.html',
})
export class SpotPage {

  base64Image: string = '';
  markers = [];
  ref = firebase.database().ref('geolocations/');

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    // private afs: AngularFirestore
  ) {
    if (this.base64Image) {
      this.base64Image = this.base64Image;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpotPage');
  }

  updateGeolocation(uuid, lat, lng) {
    if (localStorage.getItem('mykey')) {
      firebase.database().ref('geolocations/' + localStorage.getItem('mykey')).set({
        uuid: uuid,
        latitude: lat,
        longitude: lng
      });
    } else {
      let newData = this.ref.push();
      newData.set({
        uuid: uuid,
        latitude: lat,
        longitude: lng
      });
      localStorage.setItem('mykey', newData.key);
    }
  }

  async takePhoto() {
    try {
      const options: CameraOptions = {
        quality: 100,
        targetHeight: 600,
        targetWidth: 600,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
      }

      const result = await this.camera.getPicture(options);
      const image = `data:image/jpeg;base64,${result}`;
      this.base64Image = image;
      const pictures = storage().ref(`${Date.now()}`);
      pictures.putString(image, 'data_url');
    } catch (error) {
      console.log(error);
    }
  }

}
