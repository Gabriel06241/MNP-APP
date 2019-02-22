import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  photos : Array<string>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public imagePicker: ImagePicker,
    public camera: Camera,
    public cropService: Crop
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose or take a picture',
      buttons: [
        {
          text: 'Take a picture',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Choose pictures',
          handler: () => {
            this.openImagePicker();
          }
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(){
    let options =
    {
      quality: 100,
      correctOrientation: true
    };
    this.camera.getPicture(options)
    .then((data) => {
      this.photos = new Array<string>();
      this.cropService
      .crop(data, {quality: 75})
      .then((newImage) => {
        this.photos.push(newImage);
      }, error => console.error("Error cropping image", error));
    }, function(error) {
      console.log(error);
    });
  }

  openImagePicker() {
    let options = {
      maximumImagesCount: 5,
    }
    this.photos = new Array<string>();
    this.imagePicker.getPictures(options)
      .then((results) => {
        this.reduceImages(results).then(() => {
          console.log('all images cropped!!');
        });
      }, (err) => { console.log(err) });
  }

  reduceImages(selected_pictures: any): any {
    return selected_pictures.reduce((promise: any, item: any) => {
      return promise.then((result) => {
        return this.cropService.crop(item, { quality: 75 })
          .then(cropped_image => this.photos.push(cropped_image));
      });
    }, Promise.resolve());
  }

  filterCategory(category) {
    console.log('Console ==>> ', category);
  }

}
