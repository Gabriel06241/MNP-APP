import { UtilsProvider } from './../../providers/utils/utils';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import firebase from 'firebase';
import { storage } from "firebase";

@IonicPage()
@Component({
  selector: 'page-spot',
  templateUrl: 'spot.html',
})
export class SpotPage {

  defaultImage = 'assets/imgs/spots/spot_default_location.svg';
  base64Image: string = this.defaultImage;
  pathImage: string = '';
  markers = [];
  ref = firebase.database().ref('geolocations/');
  latitude = 0;
  longitude = 0;
  spotName: '';
  spotDescription: '';
  photoSpot: '';

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public geolocation: Geolocation,
    public utilsProvider: UtilsProvider,
  ) {
    if (this.base64Image) {
      this.base64Image = this.base64Image;
    }
  }

  // ionViewWillEnter() {
  ionViewDidEnter() {
    this.getPosition();
  }

  getPosition() {
    this.geolocation.getCurrentPosition()
      .then((geoposition) => {
        console.log('getCurrentPosition () >>>> ', geoposition);
        this.latitude = geoposition.coords.latitude;
        this.longitude = geoposition.coords.longitude;
      }).catch(error => { console.log('Error in getPosition() >> ', error); });
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
        correctOrientation: true,
        allowEdit: true
      }
      const result = await this.camera.getPicture(options);
      const image = `data:image/jpeg;base64,${result}`;
      this.base64Image = image;
      const pictures = storage().ref(`${Date.now()}`);
      pictures.putString(image, 'data_url');
    } catch (error) {
      console.log('Error in takePhoto() >> ', error);
    }
  }

  saveSpot() {
    if (this.base64Image == this.defaultImage || !this.base64Image) {
      this.utilsProvider.showAlert('Advertencia', 'Debes ' + ((!this.spotName || !this.spotDescription) ? 'completar todos los campos y ' : '') + 'tomar una foto para guardar el spot');
    } else {
      let load = this.loadingCtrl.create({
        content: 'Espera por favor...',
      });
      load.present();

      firebase.firestore().collection("spots").add({
        name: this.spotName,
        description: this.spotDescription,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        owner: firebase.auth().currentUser.uid,
        owner_name: firebase.auth().currentUser.displayName,
        photoUrl: this.base64Image,
        latitude: this.latitude,
        longitude: this.longitude,
        raters: [],
        rating: { count: 0, acumulator: 0, average: 0 }
      }).then(async (document) => {
        if (document.id && this.base64Image) {
          load.dismiss();
          await this.createUploadTask(this.base64Image, document.id, document.id);
        }
        this.toastCtrl.create({
          message: "Tu post se ha creado correctamente.",
          duration: 3000
        }).present();
        this.navCtrl.pop();
      }).catch((error) => {
        console.log('Error on saveSpot() >> ', error);
      })
    }
  }

  createUploadTask(file: string, name: string, documentId) {
    return new Promise((resolve, reject) => {
      let loading = this.loadingCtrl.create({
        content: 'Espera por favor...',
      });
      loading.present()

      const pictures = firebase.storage().ref(`images/` + name);
      const uploadTask = pictures.putString(file, 'data_url');

      loading.setContent('Uploading Image...')

      uploadTask.on('state_changed', function (snapshot: firebase.storage.UploadTaskSnapshot) {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        loading.setContent(`Uploaded ${Math.round(progress)}% ...`)
      }, (error) => {
        loading.dismiss()
        console.log('Error in uploadTask.on >> ', error);
      }, () => {
        // Handle successful uploads on complete
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          firebase.firestore().collection("spots").doc(documentId).update({ photoUrl: downloadURL }).then(() => {
            loading.dismiss()
            resolve()
          }).catch(() => {
            loading.dismiss()
            reject()
          })
        }).catch((error) => {
          console.log('Error in uploadTask.snapshot.ref >> ', error);
          loading.dismiss()
          reject();
        });
      });
    })
  }
}
