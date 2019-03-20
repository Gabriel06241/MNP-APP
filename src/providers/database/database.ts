import { Injectable } from '@angular/core';
// Import firebase and firestore
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class DatabaseProvider {

  private db: any;

  constructor() {
    this.db = firebase.firestore();
    firebase.firestore().settings({ timestampsInSnapshots: true });
  }

  getDocuments(collectionObj: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(collectionObj)
        .get()
        .then((querySnapshot) => {
          let obj: any = [];
          querySnapshot
            .forEach((doc: any) => {
              obj.push(doc.data());
            });
          resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  getAllDocuments(collection: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(collection)
        .get()
        .then((querySnapshot) => {
          let arr = [];
          querySnapshot.forEach(doc => {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.$key = doc.id;
            console.log(obj);
            arr.push(obj);
          });
          if (arr.length > 0) {
            console.log('Document data: ', arr);
            resolve(arr);
          } else {
            console.log('Doesn´t exist data!');
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error)
        })
    })
  }

  addDocument(collection: string, objData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(collection).add(objData)
        .then((docSaved: any) => {
          console.log(docSaved);
        }).catch((error: any) => {
          console.log(error);
        })
    })
  }

  updateDocument(collection: string, docId: string, objData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(collection)
        .doc(docId)
        .update(objData)
        .then((docUpdated: any) => {
          resolve(docUpdated);
        })
        .catch((error: any) => {
          reject(error);
        })
    })
  }

  deleteDocument(collection: string, docId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(collection)
        .doc(docId)
        .delete()
        .then((docDeleted: any) => {
          resolve(docDeleted);
        })
        .catch((error: any) => {
          reject(error);
        })
    })
  }

}
