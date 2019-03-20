import { Component } from '@angular/core';
import { PopoverController, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ExerciseListPage } from '../exercise-list/exercise-list';
import { DatabaseProvider } from '../../providers/database/database';
import { CategoryComponent } from './../../components/category/category';
import firebase from 'firebase';
import { Firebase } from '@ionic-native/firebase'
// import * as firebase from 'firebase';
// import 'firebase/firestore';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  imageUrl: string;
  popover: any;
  public isSearchbarOpening = false;
  searchQuery: string = '';
  routines: any = [];
  routinesNotFiltered: any = [];
  routinesWasFiltered = false;
  exercises: any = [];
  pageSize: number = 10;

  constructor(
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public http: HttpClient,
    public navParams: NavParams,
    private _DB: DatabaseProvider,
    private firebaseCordova: Firebase
  ) {
    this.getRoutines();
    this.routinesNotFiltered = this.routines;

    this.firebaseCordova.getToken().then((token) => {
      console.log('@token >>> ', token);

      this.updateToken(token, firebase.auth().currentUser.uid)

    }).catch((error) => {
      console.log('@error <<<<<< ', error)
    })
  }

  updateToken(token: string, uid: string) {
    firebase.firestore().collection('users').doc(uid).set({
      token: token,
      tokenUpdate: firebase.firestore.FieldValue.serverTimestamp()
    }, {
      merge: true
    }).then(() => {
      console.log('token Saved...');
    }).catch((error) => {
      console.log('trying to saving token...');
    })
  }

  // ionViewDidEnter() {
  //   this.getRoutines();
  // }

  onSearch(event) {
    console.log('@event >>> ', event);
  }

  presentPopover(event: Event) {
    this.popover = this.popoverCtrl.create(CategoryComponent);
    this.popover.present({ ev: event });

    console.log('Load the present()....');

    this.popover.onWillDismiss((data) => {
      let routinesFilter = []
      let arrayToFilter = (!this.routinesNotFiltered.length) ? 'routines' : 'routinesNotFiltered';
      if (data.filter) {
        this[arrayToFilter].filter((item) => {
          console.log(item);
          if (item.category == data.filter) {
            routinesFilter.push(item);
          }
        });
        this.routinesNotFiltered = this.routines;
        this.routines = routinesFilter;
      }
    });

  }

  doRefresh(event) {
    setTimeout(() => {
      this.getRoutines();
      event.complete();
    }, 1000);
  }

  getRoutines() {
    this.routines = [];
    this.exercises = [];

    let queryExercises = firebase.firestore().collection("excercises");
    queryExercises.get()
      .then((documents) => {
        documents.forEach((document) => {
          this.exercises.push({
            id: document.id,
            name: document.data().name,
            description: document.data().descripcion,
            imageName: this.removeAccents(document.data().name) + '.gif'
          })
        })
      }).catch((error) => {
        console.log(error);
      })

    // let queryRoutines = firebase.firestore().collection("routines").orderBy("created", "desc")
    let queryRoutines = firebase.firestore().collection("routines")
      .limit(this.pageSize);

    queryRoutines.get()
      .then((documents) => {
        documents.forEach((document) => {
          this.routines.push({
            id: document.id,
            category: document.data().categoria,
            title: document.data().nombre,
            body: document.data().descripcion,
            imageUrl: 'assets/exercises/' + this.filterExercisesByDocId(document.data().ejercicios[this.getRandomInt(document.data().ejercicios.length)]),
            exercises: document.data().ejercicios
          })
        })
        console.log('@routines  >>>>  ', this.routines)
      }).catch((error) => {
        console.log(error);
      })

  }

  getExerciseFromRoutine(routine) {
    this.navCtrl.push(ExerciseListPage, { routine: routine })
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  filterExercisesByDocId(document) {
    let imageName = '';
    this.exercises.filter((exercise) => {
      if (exercise.id == document) {
        imageName = exercise.imageName;
      }
    });
    return imageName;
  }

  removeAccents(str) {
    let result = str.toLowerCase();
    result = result.replace(new RegExp(/\s/g), "_");
    result = result.replace(new RegExp(/[àáâãäå]/g), "a");
    result = result.replace(new RegExp(/[èéêë]/g), "e");
    result = result.replace(new RegExp(/[ìíîï]/g), "i");
    // result = result.replace(new RegExp(/ñ/g), "n");
    result = result.replace(new RegExp(/[òóôõö]/g), "o");
    result = result.replace(new RegExp(/[ùúûü]/g), "u");
    return result;
  }

}
