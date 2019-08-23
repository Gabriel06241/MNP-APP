import { RatingViewComponent } from './../../components/rating-view/rating-view';
import { Component } from '@angular/core';
import { PopoverController, IonicPage, AlertController, NavController, ActionSheetController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { SpotsMapPage } from '../spots-map/spots-map';
import { SpotPage } from '../spot/spot';
import { Events } from 'ionic-angular';
import firebase from 'firebase';
import moment from 'moment';
import { UtilsProvider } from '../../providers/utils/utils';
import { CommentsPage } from '../comments/comments';

@IonicPage()
@Component({
  selector: 'page-spots',
  templateUrl: 'spots.html',
})
export class SpotsPage {

  spots: any = [];
  spotId: string = '';
  pageSize: number = 10;
  cursor: any;
  infiniteEvent: any;
  rating: number = 1.2;
  popover: any;

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public actionCtrl: ActionSheetController,
    public utilsProvider: UtilsProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
  ) {

    this.getSpots();

    events.subscribe('star-rating:changed', (starRating) => {
      this.rating = starRating;
    });

  }

  updateToken(token: string, uid: string) {
    firebase.firestore().collection('users').doc(uid).set({
      token: token,
      tokenUpdate: firebase.firestore.FieldValue.serverTimestamp()
    }, {
      merge: true
    }).then(() => {
      console.log('Token saved to cloud firestore!')
    }).catch((error) => {
      console.log('error <<<< ', error)
    })
  }

  doRefresh(event) {
    this.spots = [];
    this.getSpots();
    if (this.infiniteEvent) {
      this.infiniteEvent.enable(true);
    }
    event.complete();
  }

  imageTapped(card) {
    console.log('console @avatarTapped() >>>> ', card)
  }

  avatarTapped(card) {
    console.log('console @avatarTapped() >>>> ', card)
  }

  allUbicationsMap() {
    this.navCtrl.push(SpotsMapPage)
  }

  createSpot() {
    this.navCtrl.push(SpotPage);
  }

  onModelChange(event) {
    console.log('console onModelChange() >>>>>> ', event);
  }

  getSpots() {
    this.spots = [];
    let loading = this.loadingCtrl.create({
      content: 'Cargando spots...'
    })
    loading.present();
    let query = firebase.firestore().collection("spots").orderBy("created", "desc").limit(this.pageSize);
    query.onSnapshot((snapshot) => {
      console.log('spot have changed...')
      let changesDocs = snapshot.docChanges();
      changesDocs.forEach((change) => {
        if (change.type == 'added') {
          console.log('document added');
        }
        if (change.type == 'modified') {
          console.log(`El spot ${change.doc.data().name} has been modified`);
        }
        if (change.type == 'removed') {
          console.log('document removed');
        }
      })
    });
    query.get()
    .then((documents) => {
      documents.forEach((document) => {
        console.log(document.data())
        this.spots.push({
          spotId: document.id,
          avatarImageUrl: 'assets/imgs/user.svg',
          postImageUrl: document.data().photoUrl,
          name: document.data().name,
          postText: document.data().description,
          date: moment.unix(document.data().created.seconds).locale('es').format("DD MMMM YYYY hh:mm A"),
          rating: document.data().rating,
          raters: document.data().raters,
          readOnly: false,
          commentsCount: document.data().commentsCount || 0,
          color: "red",
          timestamp: this.getTimeAgo(moment.unix(document.data().created.seconds))
        })
        this.cursor = this.spots[this.spots.length - 1];
      })
      loading.dismiss();
    })
    .catch((error) => {
      console.log('error @getSpots', error);
    })
  }

  loadMoreData(event) {
    firebase.firestore().collection("spots").orderBy("created", "desc")
      .startAfter(this.cursor).limit(this.pageSize).get()
      .then((documents) => {
        documents.forEach((document) => {
          this.spots.push({
            spotId: document.id,
            avatarImageUrl: 'assets/imgs/user.svg',
            postImageUrl: document.data().photoUrl,
            name: document.data().name,
            postText: document.data().description,
            date: moment.unix(document.data().created.seconds).locale('es').format("DD MMMM YYYY hh:mm A"),
            rating: 2,
            readOnly: false,
            color: "red",
            timestamp: this.getTimeAgo(moment.unix(document.data().created.seconds))
          })

          if (documents.size < this.pageSize) {
            event.enable(false);
            this.infiniteEvent = event;
          } else {
            event.complete();
            this.cursor = this.spots[this.spots.length - 1];
          }
        })
      })
      .catch((error) => {
        console.log('error @getSpots', error);
      })
  }

  getTimeAgo(time) {
    let difference = moment(time).diff(moment())
    return moment.duration(difference).locale('es').humanize()
  }

  presentPopover(event: Event) {
    this.popover = this.popoverCtrl.create(RatingViewComponent, { event });
    this.popover.present({ ev: event });
  }

  comment(spot) {
    this.actionCtrl.create({
      buttons: [
        {
          text: "Ver todos los comentarios",
          handler: () => {
            this.modalCtrl.create(CommentsPage, {
              "spot": spot
            }).present();
          }
        },
        {
          text: "Ingresar un comentario",
          handler: () => {
            this.alertCtrl.create({
              title: 'Nuevo comentario',
              message: 'Escribe tu comentario',
              inputs: [
                {
                  name: 'comment',
                  type: 'text'
                }
              ],
              buttons: [
                {
                  text: 'Cancelar'
                },
                {
                  text: 'Comentar',
                  handler: (data) => {
                    if (data.comment) {
                      firebase.firestore().collection('comments').add({
                        text: data.comment,
                        spotId: spot.spotId,
                        owner: firebase.auth().currentUser.uid,
                        owner_name:firebase.auth().currentUser.displayName,
                        created: firebase.firestore.FieldValue.serverTimestamp()
                      }).then((doc) => {
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
                    }
                  }
                }
              ]
            }).present();
          }
        }
      ]
    }).present();
  }

}
