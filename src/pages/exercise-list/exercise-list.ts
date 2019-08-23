import { SlidePreheatingPage } from './../slide-preheating/slide-preheating';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { CountdownPage } from '../countdown/countdown';

/**
 * Generated class for the ExerciseListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-exercise-list',
  templateUrl: 'exercise-list.html',
})
export class ExerciseListPage {

  @ViewChild(Nav) nav: Nav;

  // data: Observable<any>;
  url: string;
  routineId: number;
  routineName: string;
  routineCategory: string;
  descriptionRoutine: string;

  collection: any[] = [
    {
      routineId: 123,
      exerciseId: 1,
      exerciseImage: "assets/exercises/abdominales.gif",
      title: "Abdominales",
      description: "Recostados sobre el suelo boca arriba (En posición horizontal), flexionamos las rodillas formando un arco de aproximadamente 45 grados, ponemos las manos a la altura de las orejas sin hacer presión. levantamos un poco el tronco en dirección a las rodillas. Luego dejamos descansar el tronco en la posición inicial."
    },
    {
      routineId: 123,
      exerciseId: 2,
      exerciseImage: "assets/exercises/abdominales_levantar_piernas.gif",
      title: "Abdominales piernas flexionadas",
      description: "Recostados sobre el suelo boca arriba (En posición horizontal), levantamos las piernas y flexionamos las rodillas formando un Angulo recto, ponemos las manos a la altura de las orejas sin hacer presión. levantamos el tronco en dirección a las rodillas. Luego dejamos descansar el tronco en la posición inicial."
    },
    {
      routineId: 123,
      exerciseId: 3,
      exerciseImage: "assets/exercises/abdominales_piernas_flexionadas.gif",
      title: "Abdominales piernas estiradas",
      description: "Recostados sobre el suelo boca arriba (En posición horizontal), levantamos las piernas (totalmente rectas) y el tronco a la misma vez buscando que se encuentren formando una V, luego regresamos a la posición inicial y dejamos descansar."
    },
    {
      routineId: 456,
      exerciseId: 1,
      exerciseImage: "assets/exercises/lanzar_objeto.gif",
      title: "Lanzar objeto",
      description: "Esta serie de movimientos trata sobre la fuerza implícita en la acción de lanzar objetos diversos proyectándolos hacia el frente, este movimiento debe ir acompañado de una cuclilla completa para evitar lesiones en la espalda, tener en cuenta la proporcionalidad del peso que se puede cargar para no sobre exigirse."
    },
    {
      routineId: 456,
      exerciseId: 2,
      exerciseImage: "assets/exercises/alzar_objeto.gif",
      title: "Alzar objeto",
      description: "Recostados sobre el suelo boca arriba (En posición horizontal), levantamos las piernas y flexionamos las rodillas formando un Angulo recto, ponemos las manos a la altura de las orejas sin hacer presión. levantamos el tronco en dirección a las rodillas. Luego dejamos descansar el tronco en la posición inicial."
    },
    {
      routineId: 456,
      exerciseId: 3,
      exerciseImage: "assets/exercises/levantar_objeto.gif",
      title: "Levantar objeto",
      description: "Este movimiento crea experiencia motriz sobre los pasos necesarios para cargar objetos de un peso mediano. Se debe tener en cuenta que siempre es necesario realizar una flexión completa, procurando en todo momento que la espalda se mantenga lo más recta posible."
    },
    {
      routineId: 456,
      exerciseId: 3,
      exerciseImage: "assets/exercises/escalar_muro.gif",
      title: "Fuerza brazos",
      description: "Se trata de ejercicios donde se busca que el peso del cuerpo sea mantenido por los brazos. Se debe tener precaución con la altura de la superficie. Los pies brindan un punto de anclaje."
    },
    {
      routineId: 789,
      exerciseId: 1,
      exerciseImage: "assets/exercises/cuadrupedia_lateral.gif",
      title: "Cuadrupedia lateral",
      description: "De cuclillas sobre el suelo teniendo buen espacio para moverse se mira hacia un lado y  se  proyectan los brazos hacia ese lado luego se elevan las piernas buscando encontrar los brazos."
    },
    {
      routineId: 789,
      exerciseId: 2,
      exerciseImage: "assets/exercises/cuadrupedia_lateral_izquierda.gif",
      title: "Cuadrupedia lateral izquierda",
      description: "Recostados sobre el suelo boca arriba (En posición horizontal), se busca formar una “mesa” de tal forma que  el tronco quede totalmente recto. De allí se avanza hacia adelante moviendo pierna izquierda mano derecha y luego pierna derecha mano izquierda o viceversa."
    },
    {
      routineId: 789,
      exerciseId: 3,
      exerciseImage: "assets/exercises/cuadrupedia_mesa.gif",
      title: "Cuadrupedia mesa",
      description: "Recostados sobre el suelo boca abajo se realiza una “mesa” con las cuatro extremidades dejando el tronco recto y firme se avanza hacia el frente. Cruzando brazo derecho pierna izquierda, brazo izquierdo pierna derecha o viceversa."
    },
    {
      routineId: 789,
      exerciseId: 3,
      exerciseImage: "assets/exercises/cuadrupedos.gif",
      title: "Cuadrupedos",
      description: "Recostados sobre el suelo boca arriba (En posición horizontal), levantamos las piernas (totalmente rectas) y el tronco a la misma vez buscando que se encuentren formando una V, luego regresamos a la posición inicial y dejamos descansar."
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient
  ) {
    this.routineName = this.navParams.data.routine.title;
    this.routineCategory = this.navParams.data.routine.category;
    this.descriptionRoutine = this.navParams.data.routine.body;
    this.routineId = this.navParams.data.routine.id;
    this.collection = this.collection.filter((item) => item.routineId == this.routineId);
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended', event);
      console.log('@params -->> ', this.navParams.data.routine.userId)
      // this.getData();
      event.complete();
    }, 200);
  }

  startSlide() {
    this.navCtrl.push(SlidePreheatingPage);
  }

}
