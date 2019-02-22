import { Injectable } from '@angular/core';
// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
// import { Observable } from 'rxjs/Observable';
import { Spot } from "../../models/Spot";
import { SpotReview } from "../../models/SpotReview";
import { SpotRating } from './../../models/SpotRating';


/*
  Generated class for the SpotProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SpotProvider {

  spots: AngularFirestoreCollection<Spot>;
  spot: Spot[];

  constructor(private afs: AngularFirestore) { }

  getSpots() {
    return this.afs.collection("spots").snapshotChanges().map(actions => {
      return actions.map(spot => {
        const data = spot.payload.doc.data() as Spot;
        data.id = spot.payload.doc.id;
        data.name = data.name;
        data.averageRating = data.averageRating / 5 * 100;
        return data;
      });
    });
  }

  getSpot(spotId) {
    var docPath = `spots/${spotId}`;
    return this.afs.doc(docPath).snapshotChanges().map((actions) => {
      const data = actions.payload.data() as Spot;
      data.name = data.name;
      data.averageRating = data.averageRating / 5 * 100;
      data.id = actions.payload.id;
      return data;
    });
  }

  getSpotReviews(spotId) {
    return this.afs.collection("reviews", ref => ref.where('spotId', '==', spotId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Spot;
        console.log('console data-spotReviews => ', data);
        return data;
      });
    });
  }

  spotReview(comment: SpotReview) {
    this.afs.collection("reviews").add({
      username: comment.username,
      summary: comment.summary,
      review: comment.review,
      spotId: comment.spotId
    });
  }

  postRating(rating: SpotRating) {
    this.afs.collection("ratings").add({
      spotId: rating.spotId,
      ratingValue: rating.ratingValue
    });
  }

  getSpotRating(spotId) {
    return this.afs.collection("ratings", ref => ref.where('spotId', '==', spotId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as SpotRating;
        return data;
      });
    })
  }

  setSpotRating(spotId, rating) {
    var docPath = `spots/${spotId}`;
    let spotDoc = this.afs.doc(docPath);
    spotDoc.update({ avRating: rating });
  }

}
