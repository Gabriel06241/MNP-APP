import { SlidePreheatingPage } from "./../slide-preheating/slide-preheating";
import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Nav, Content, ModalController } from "ionic-angular";
import { UtilsProvider } from "../../providers/utils/utils";
import firebase from "firebase";
import { DatabaseProvider } from "../../providers/database/database";
import { ExerciseDetailPage } from "./../exercise-detail/exercise-detail";

@IonicPage()
@Component({
  selector: "page-exercise-list",
  templateUrl: "exercise-list.html",
})
export class ExerciseListPage {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Content) content: Content;

  url: string;
  routineId: number;
  routineName: string;
  routineCategory: string;
  descriptionRoutine: string;
  mainMuscles: [''];
  secondMuscles: [''];

  exercises: any[] = [];
  exercisesIds: any[]= [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private utils: UtilsProvider,
    private database: DatabaseProvider,
    public modalCtrl: ModalController,
  ) {
    this.routineName = this.navParams.data.routine.title;
    this.routineCategory = this.navParams.data.routine.category;
    this.descriptionRoutine = this.utils.capitalizeFirstLetter(this.navParams.data.routine.body);
    this.mainMuscles = this.navParams.data.routine.muscles.primarios.split(',');
    this.secondMuscles = this.navParams.data.routine.muscles.secundarios.split(',');
    this.routineId = this.navParams.data.routine.id;
    this.exercisesIds = this.navParams.data.routine.exercises;
    this.getExercises();
  }

  doRefresh(event) {
    setTimeout(() => {
      event.complete();
    }, 200);
  }

  getExercises() {
    firebase.firestore()
    .collection("exercises")
    .get()
    .then(data => {
      data.forEach((document) => {
        if (this.exercisesIds.indexOf(document.id) != -1) {
          this.exercises.push({
            routineId: this.routineId,
            routineName: this.routineName,
            routineCategory: this.routineCategory,
            title: document.data().name,
            description: document.data().descripcion,
            repetitions: (document.data()[this.routineCategory]) ? document.data()[this.routineCategory].repeticiones : '',
            series: (document.data()[this.routineCategory]) ? document.data()[this.routineCategory].series : '',
            exerciseImage: "assets/exercises/" + this.utils.removeAccents(document.data().name) + ".gif"
          })
        }
      })
    })
    .catch(error => {
      console.log(error);
    });
  }

  startSlide() {
    this.navCtrl.push(SlidePreheatingPage, {
      "exercises": this.exercises
    });
  }

  scrollToBottom() {
    this.content.scrollToBottom();
  }

  viewExerciseDetail(exercise) {
    this.modalCtrl.create(ExerciseDetailPage, {
      "exercise": exercise
    }).present();
  }
}
