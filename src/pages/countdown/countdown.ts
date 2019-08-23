import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, MenuController, ModalController, ViewController, ToastController } from 'ionic-angular';
import { HydratePage } from '../hydrate/hydrate';
import { ExerciseDetailPage } from '../exercise-detail/exercise-detail';
import { AlertService } from '../../providers/utils/alert.service';
import { HomePage } from '../home/home';
import { UtilsProvider } from '../../providers/utils/utils';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserProvider } from '../../providers/user/user';
import moment from 'moment';
import firebase from 'firebase';

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
  dateTimeStart: any = 0;
  dateTimeEnd: any = 0;
  currentUserId: any = '';
  hiddenNextBtn: any = false;
  hiddenEndBtn: any = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public alertService: AlertService,
    public utilsProvider: UtilsProvider,
    public userProvider: UserProvider,
    public afAuth: AngularFireAuth,
    public toastCtrl: ToastController,
  ) {
    this.exercises = this.navParams.get("exercises");
    this.currentExercise = this.exercises[0];
    this.dateTimeStart = moment();
    this.afAuth.auth.onAuthStateChanged((currentUser) => {
      this.currentUserId = currentUser.uid;
    });
  }

  ngOnInit() {
    this.menuCtrl.enable(true);
  }

  onSlideChanged() {
    this.slideIndex = this.slider.getActiveIndex();
  }

  nextExercise(index) {
    if (this.currentPosition < this.exercises.length) {
      let hydrateModal = this.modalCtrl.create(HydratePage)
      hydrateModal.present();
      setTimeout(function() {
        this.utilsProvider.preload('tabSwitch', 'assets/sounds/countdown.mp3');
        this.utilsProvider.play('tabSwitch');
      }.bind(this), 5000);

      setTimeout(function() {
        hydrateModal.dismiss();
      }, 10000);
      this.currentExercise = this.exercises[this.currentPosition];
      this.currentPosition = ++index;
      if (this.currentPosition == 5) {
        this.hiddenNextBtn = true;
        this.hiddenEndBtn = false;
        this.disabledFinishButton = false;
      }
    } else {
      this.disabledNextButton = true;
      this.disabledFinishButton = false;
    }
  }

  openModal(pageName) {
    this.modalCtrl.create(pageName, {'spotId': ''}, { cssClass: 'inset-modal'}).present();
  }

  close() {
    this.viewCtrl.dismiss();
  }

  viewExerciseDetail() {
    this.modalCtrl.create(ExerciseDetailPage, {
      "exercise": this.currentExercise
    }).present();
  }

  routineTimeFinished() {
    this.dateTimeEnd = moment();
    let userTraining = {
      timeStart: this.dateTimeStart.format(),
      timeEnd: this.dateTimeEnd.format(),
      timeDiff: moment(this.dateTimeEnd).diff(this.dateTimeStart, 'seconds'),
      userId: this.currentUserId,
      routineId: this.currentExercise.routineId,
      routineName: this.currentExercise.routineName,
      routineCategory: this.currentExercise.routineCategory
    }
    firebase.firestore().collection('userTrainings').add(userTraining).then((doc) => {
      this.toastCtrl.create({
        message: 'Comentario guardado correctamene!',
        duration: 3000
      })
    }).catch((error) => {
      this.toastCtrl.create({
        message: error.message,
        duration: 3000
      }).present();
    })
    this.utilsProvider.showAlert('Felicitaciones', 'Rutina terminada con exito.');
    this.navCtrl.setRoot(HomePage)
  }

  cancelRoutine() {
    this.alertService.presentAlertWithCallback('¿Estas seguro de cancelar?', 'El entrenamiento de la rutina se cancelara.')
    .then((yes) => {
      if (yes) {
        this.navCtrl.setRoot(HomePage);
      }
    })
  }

}
