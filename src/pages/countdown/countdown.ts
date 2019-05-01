import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, MenuController, ModalController, ViewController } from 'ionic-angular';
import { HydratePage } from '../hydrate/hydrate';

@IonicPage()
@Component({
  selector: 'page-countdown',
  templateUrl: 'countdown.html',
})
export class CountdownPage {

  @ViewChild('slider') slider: Slides;
  slideIndex = 0;
  exercises: any[] = [];
  currentExercise: any = {};
  currentPosition: number = 1;
  disabledNextButton: boolean = false;
  disabledFinishButton: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController
  ) {
    this.exercises = this.navParams.get("exercises");
    console.log('>>>>> CountdownPage exercises ', this.exercises)
    this.currentExercise = this.exercises[0];
    // this.qtyExercise = this.currentExercise.length;
    console.log('>>>>>  currentExercise >>> ', this.currentExercise)
  }

  ngOnInit() {
    this.menuCtrl.enable(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CountdownPage');
  }

  onSlideChanged() {
    console.log('console @slider => ', this.slider);
    this.slideIndex = this.slider.getActiveIndex();
  }

  nextExercise(index) {
    console.log(' length >>> ', this.exercises.length)
    if (this.currentPosition < this.exercises.length) {
      console.log('this.currentPosition #1 >>> ', this.currentPosition)
      let hydrateModal = this.modalCtrl.create(HydratePage)
      hydrateModal.present();
      console.log('HOLA>>>')
      setTimeout(function() {
        console.log('viewCtrl...')
        // this.navCtrl.pop();
        hydrateModal.dismiss();
        // this.viewCtrl.dismiss();
        // this.close();
      }, 3000);
      // this.modalCtrl.create(CommentsPage, {'spot': {'spotId':'214'}}).present();
      // this.openModal(CommentsPage);
      this.currentExercise = this.exercises[this.currentPosition];
      this.currentPosition = ++index;
      console.log('this.currentPosition #2 >>> ', this.currentPosition)
    } else {
      console.log(' ELSE >>>>> ')
      this.disabledNextButton = true;
      this.disabledFinishButton = false;
    }
  }

  openModal(pageName) {
    this.modalCtrl.create(pageName, {'spotId': ''}, { cssClass: 'inset-modal'}).present();
    // this.modalCtrl.create(pageName, null, { cssClass: 'inset-modal'}).present();
  }

  close() {
  // close(): void {
    this.viewCtrl.dismiss();
  }

}
