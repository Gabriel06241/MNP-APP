import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SpotsMapPage } from '../spots-map/spots-map';
import { SpotPage } from '../spot/spot';
import { Events } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
// import * as firebase from 'firebase';
// import 'firebase/firestore';
// import { Ionic2RatingModule } from "ionic2-rating";
import { Spot } from '../../models/Spot';
import { SpotProvider } from '../../providers/spot/spot';


/**
 * Generated class for the SpotsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-spots',
  templateUrl: 'spots.html',
})
export class SpotsPage {

  cards = [
    {
      avatarImageUrl: 'assets/imgs/user.svg',
      postImageUrl: 'assets/imgs/spots/spot01.jpg',
      name: 'Gabriel Pérez',
      postText: 'Lugar ideal para un dia de entrenamiento funcional ubicado en la loma de la cruz de la ciudad de Cali',
      date: 'Febrero 09, 2019',
      rating: 1.1,
      readOnly: false,
      color: "red",
      timestamp: '11h ago'
    },
    {
      avatarImageUrl: 'assets/imgs/user.svg',
      postImageUrl: 'assets/imgs/spots/spot02.jpg',
      name: 'Test user',
      postText: 'Barrio san antonio en cali, perfecto para realizar un entrenamiento para fortalecer la cuadrupedia.',
      date: 'Enero 13, 2018',
      rating: 4.5,
      readOnly: true,
      color: "red",
      timestamp: '30yr ago'
    },
    {
      avatarImageUrl: 'assets/imgs/user.svg',
      postImageUrl: 'assets/imgs/spots/spot03.jpg',
      name: 'Mao',
      postText: 'Parque las tortugas ubicado en la ciudad de cali donde podremos realizar entrenamientos de distintas rutinas.',
      date: 'Diciembre 16, 2018',
      rating: 3.2,
      readOnly: false,
      color: "red",
      timestamp: '2d ago'
    },
    {
      avatarImageUrl: 'assets/imgs/user.svg',
      postImageUrl: 'assets/imgs/spots/spot04.jpg',
      name: 'Test User',
      postText: 'Rio pance, perfecto para realizar ejercicios en el agua y fortalecimiento muscular bajo el agua.',
      date: 'Enero 20, 2018',
      rating: 3.2,
      readOnly: false,
      color: "red",
      timestamp: '2d ago'
    },
  ];

  rating: number = 1.2;

  // spots: AngularFirestoreCollection<Spot>;
  // spot: Spot[];

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public spots: SpotProvider,
  ) {
    events.subscribe('star-rating:changed', (starRating) => {
      console.log(starRating);
      this.rating = starRating;
    });
  }

  ionViewDidEnter() {
    // this.spots.getSpots()
  }

  imageTapped(card) { }

  avatarTapped(card) { }

  allUbicationsMap() {
    this.navCtrl.push(SpotsMapPage)
  }

  createSpot() {
    this.navCtrl.push(SpotPage);
  }

  onModelChange(event) { }

}
