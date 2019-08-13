import { CountdownPage } from './../countdown/countdown';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-slide-preheating',
  templateUrl: 'slide-preheating.html',
})
export class SlidePreheatingPage {

  @ViewChild('slider') slider: Slides;
  slideIndex = 0;
  slides = [
    {
      title: 'Recomendaciones',
      imageUrl: 'assets/imgs/slides/slide2.jpg',
      description: 'Antes de iniciar cualquier actividad, el prácticante debe tener una sesión de movilidad articular y calentamiento general de 15 a 20 minutos. \n \n Además de un gran trabajo previo en aspectos técnicos como trote, carrera, salto y recepción, con el fin de que active sus funciones motoras, fuerza y resistencia en las articulaciones y músculos. Esto contribuira a reducir cualquier tipo de lesión. \n\n\n Los menores de edad deben estar acompañados de un adulto responsable.',
      imageStageDetail: ''
    },
    {
      title: 'Etapa 1 - Movilidad articular',
      imageUrl: 'assets/imgs/slides/slide3.jpg',
      description: 'Antes de iniciar la práctica, se debe hacer un proceso de movilidad articular en cada una de las articulaciones. Esto se hace siguiendo un orden ascedente (desde los tobillos hasta el cuello), o descendente (desde el cuello hasta los tobillos). El movimiento por cada articulación es de 15 a 20 segundos, hasta completar.',
      imageStageDetail: ''
    },
    {
      title: 'Etapa 2 - Calentamiento',
      imageUrl: 'assets/imgs/slides/slide4.jpg',
      description: 'El calentamiento general inicia con 10 minutos como mínimo de trote; con desplazamiento por un área especifica. Luego se intercalan ejercicios que se relacionen con los movimientos que se van a trabajar en la practica de la rutina.',
      imageStageDetail: ''
    },
    {
      title: 'Etapa 3 - Estiramiento',
      imageUrl: 'assets/imgs/slides/slide5.jpg',
      description: 'El estiramiento hace referencia a la práctica de ejercicios suaves y mantenidos para aumentar el rango de mantenimiento en las articulaciones. \n El estiramiento debe ser progresivo, sin forzar el músculo hasta sentir una tensión moderada y se sostendrá esta posición entre 10 y 15 segundos si no se siente dolor.',
      imageStageDetail: ''
    }
  ];
  exercises: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.exercises = this.navParams.get("exercises");
  }

  onSlideChanged() {
    this.slideIndex = this.slider.getActiveIndex();
  }

  goToApp() {
    this.navCtrl.setRoot(CountdownPage, {
      "exercises": this.exercises
    });
  }

  skip() {
    this.navCtrl.pop();
  }

}
