import { SlidePreheatingPage } from "./../slide-preheating/slide-preheating";
import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Nav, Content, ModalController } from "ionic-angular";
import { UtilsProvider } from "../../providers/utils/utils";
import firebase from "firebase";
import { DatabaseProvider } from "../../providers/database/database";
import { ExerciseDetailPage } from "./../exercise-detail/exercise-detail";
// import { Observable } from 'rxjs';
// import { CountdownPage } from '../countdown/countdown';

@IonicPage()
@Component({
  selector: "page-exercise-list",
  templateUrl: "exercise-list.html",
})
export class ExerciseListPage {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Content) content: Content;

  // data: Observable<any>;
  url: string;
  routineId: number;
  routineName: string;
  routineCategory: string;
  descriptionRoutine: string;
  mainMuscles: [''];
  secondMuscles: [''];

  exercises: any[] = [
    // {
    //   routineId: 123,
    //   exerciseId: 1,
    //   exerciseImage: "assets/exercises/abdominales.gif",
    //   title: "Abdominales",
    //   description:
    //     "Recostados sobre el suelo boca arriba (En posición horizontal), flexionamos las rodillas formando un arco de aproximadamente 45 grados, ponemos las manos a la altura de las orejas sin hacer presión. levantamos un poco el tronco en dirección a las rodillas. Luego dejamos descansar el tronco en la posición inicial.",
    // }
  ];
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
    // this.routineId = this.navParams.data.routine.id;
    this.routineId = 789;
    // this.exercisesIds = [];

    console.log("navParams ==>>> ", this.navParams.data);
    this.exercisesIds = this.navParams.data.routine.exercises;
    this.getExercises();
    // this.exercises = this.exercises.filter(
    //   item => item.routineId == this.routineId
    // );
  }

  doRefresh(event) {
    console.log("Begin async operation");

    setTimeout(() => {
      console.log("Async operation has ended", event);
      console.log("@params -->> ", this.navParams.data.routine.userId);
      // this.getData();
      event.complete();
    }, 200);
  }

  getExercises() {
    firebase
      .firestore()
      .collection("exercises")
      // .where("spotId", "==", this.routineId)
      // .orderBy("created", "asc")
      .get()
      .then(data => {
        data.forEach((document) => {

          // firebase
          // .firestore()
          // .collection("exercises").doc(document.id).set(document.data())
          // .then((create) => {
          //   console.log('@create new >>>  ', create)
          // }).catch((error) => {
          //   console.log('@error new >>>  ', error)
          // })

          // console.log("ID >>> ", document.id);
          // console.log("dataValue ", JSON.stringify(document.data()))
          // this.database.updateDocument('excercises',document.id, { basico: {repeticiones: 10, series: 3}, medio: {repeticiones: 12, series: 4}, avanzado: {repeticiones: 15, series: 5}})
          // .then((response) => {
          //   console.log('updateDocument - @response >>> ', response);
          // }).catch((error) => {
          //   console.log('updateDocument - @error >>> ', error);
          // })
          if (this.exercisesIds.indexOf(document.id) != -1) {
            this.exercises.push({
              title: document.data().name,
              description: document.data().descripcion,
              repetitions: (document.data()[this.routineCategory]) ? document.data()[this.routineCategory].repeticiones : '',
              series: (document.data()[this.routineCategory]) ? document.data()[this.routineCategory].series : '',
              exerciseImage: "assets/exercises/" + this.utils.removeAccents(document.data().name) + ".gif"
            })
            // this.exercises = data.docs;
          }
        })
      })
      .catch(error => {
        console.log(error);
      });
  }

  startSlide() {
    console.log(' >>>> exercise Z>>> ', this.exercises)
    this.navCtrl.push(SlidePreheatingPage, {
      "exercises": this.exercises
    });
  }

  // capitalizeFirstLetter(string) {
  //   return string.charAt(0).toUpperCase() + string.slice(1);
  // }

  scrollToBottom() {
    // Scrolls to the Bottom of the content area.
    this.content.scrollToBottom();
  }

  viewExerciseDetail(exercise) {
    console.log(' viewExerciseDetail >>>> ', exercise)
    this.modalCtrl.create(ExerciseDetailPage, {
      "exercise": exercise
    }).present();
  }
}
