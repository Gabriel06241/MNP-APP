import { AngularFireDatabase } from "angularfire2/database";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserProvider {

  public currentUser: Observable<any>;

  constructor(public afBD: AngularFireDatabase) { }

  public getUsers() {
    return this.afBD.list('/users');
  }

  public getUser(id) {
    return this.afBD.object('/users/' + id);
  }
  public setCurrentUser(user) {
    this.currentUser = user;
  }

  public getCurrentUser() {
    return this.currentUser || { };
  }

  public getUserFromFieldValue(field, value) {
    return this.afBD.list('users', (records) =>
    records.orderByChild(field).equalTo(value))
    .query.once('value')
    .then(snapshot => snapshot.val())
    .then((response) => {
      let records = [];
      if (response) {
        let keys = Object.keys(response);
        keys.forEach(element => {
          response[element].key = element;
          records.push(response[element])
        });
      }
      return records;
    })
  }

  public createOrUpdateUser(user) {
    return this.afBD.database.ref('/users/' + user.id).set(user);
  }

  public eliminarUser(user) {
    return this.afBD.database.ref('/users/' + user.id).remove();
  }

}
