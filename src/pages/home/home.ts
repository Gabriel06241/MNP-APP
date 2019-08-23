import { CategoryComponent } from './../../components/category/category';
import { Component } from '@angular/core';
import { PopoverController, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ExerciseListPage } from '../exercise-list/exercise-list';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  data: Observable<any>;
  url: string;
  imageUrl: string;
  popover: any;

  public isSearchbarOpening = false;
  private _COLL: string = "routines";
  public routines: any;
  public collection: any[] = [
    {
      id: 123,
      userId: 1,
      category: 'Básico',
      title: 'Abdominales',
      body: 'Consiste en una serie de ejercicios para fortalecer los musculos de la parte abdominal del cuerpo.',
      imageUrl: 'assets/exercises/abdominales.gif'
    },
    {
      id: 456,
      userId: 2,
      category: 'Intermedio',
      title: 'Brazos',
      body: 'Consiste en una serie de ejercicios para el fortalecimiento de los bíceps.',
      imageUrl: 'assets/exercises/fuerza_brazos.jpg'
    },
    {
      id: 789,
      userId: 3,
      category: 'Avanzado',
      title: 'Cuadrupedia',
      body: 'Consiste en una serie de ejercicios para fortalecer los músculos cuadrúpedos.',
      imageUrl: 'assets/exercises/cuadrupedos.gif'
    }
  ];

  constructor(
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public http: HttpClient,
    public navParams: NavParams,
    private _DB: DatabaseProvider,
  ) { }

  ionViewDidEnter() {
    this.retrieveCollection();
  }

  retrieveCollection(): void {
    this._DB.getDocuments(this._COLL)
      .then((data) => {
        console.log('@data ===>>>> ', JSON.stringify(data, null, 2));
      }).catch();
  }

  onSearch(event) {
    console.log(event);
  }

  presentPopover(event: Event) {
    this.popover = this.popoverCtrl.create(CategoryComponent);
    this.popover.present({ ev: event });
  }

  doRefresh(event) {
    setTimeout(() => {
      // this.getData();
      event.complete();
    }, 1000);
  }

  getExerciseFromRoutine(routine) {
    this.navCtrl.push(ExerciseListPage, { routine: routine })
  }

  filterCategory(category) {
    this.popover.dimiss()
  }
}
