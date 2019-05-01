import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ExerciseDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-exercise-detail',
  templateUrl: 'exercise-detail.html',
})
export class ExerciseDetailPage {

  exercise: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.exercise = this.navParams.get("exercise");
    console.log('this.exercise >>>> ', this.exercise.exerciseImage);
  }

  // description: "recostados sobre el suelo boca abajo (en posición horizontal), se levanta el tronco usando los brazos hasta que los brazos queden totalmente estirados (deben estar al ancho de los hombros) y el tronco recto, regresar a la posición inicial sin dejar que el tronco toque totalmente el suelo (repetir las veces indicadas)"
  // exerciseImage: "assets/exercises/plancha_abajo.gif"
  // repetitions: 10
  // series: 3
  // title: "plancha abajo"

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExerciseDetailPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
