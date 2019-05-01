import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const sendNotificationNewSpot = () => {
  return new Promise((resolve, reject) => {
    admin.firestore().collection('users').get()
      .then((doc) => {
        console.log('sendNotificationNewSpot >> ', doc);

        doc.forEach((item) => {
          console.log('@item >>> ', item);
        })

        // if (doc.exists && doc.data()!.token) {
        //   if (type === 'new_comment') {
        //     admin.messaging().sendToDevice(doc.data()!.token, {
        //       data: {
        //         title: 'Un nuevo comentario ha sido agregado.',
        //         sound: 'default',
        //         body: 'Click para verificar!'
        //       }
        //     }).then((sent) => {
        //       resolve(sent);
        //     }).catch((error) => {
        //       reject(error);
        //     })
        //   }
        // }
      })
      .catch((error) => {
        reject(error);
      })
  })
}

export const newSpotCreated = functions.firestore.document('spots/{spotId}').onCreate(async (event) => {
  const data = event.data();
  const spotId = data!.spotId;
  const doc = await admin.firestore().collection('spots').doc(spotId).get();
  if (doc.exists) {
    return sendNotificationNewSpot();
  } else {
    return false;
  }
})

const sendNotificationNewComment = (owner_uid: string, type: string) => {
  return new Promise((resolve, reject) => {
    admin.firestore().collection('users').doc(owner_uid).get()
      .then((doc) => {
        if (doc.exists && doc.data()!.token) {
          if (type === 'new_comment') {
            admin.messaging().sendToDevice(doc.data()!.token, {
              data: {
                title: 'Un nuevo comentario ha sido agregado.',
                sound: 'default',
                body: 'Click para verificar!'
              }
            }).then((sent) => {
              resolve(sent);
            }).catch((error) => {
              reject(error);
            })
          }
        }
      })
      .catch((error) => {
        reject(error);
      })
  })
}

export const updateCommentsCount = functions.firestore.document('comments/{commentId}').onCreate(async (event) => {
  const data = event.data();
  const spotId = data!.spotId;
  const doc = await admin.firestore().collection('spots').doc(spotId).get();
  if (doc.exists) {
    let commentsCount = doc.data()!.commentsCount || 0;
    commentsCount++;
    await admin.firestore().collection('spots').doc(spotId).update({
      "commentsCount": commentsCount
    })
    return sendNotificationNewComment(doc.data()!.owner, 'new_comment');
  } else {
    return false;
  }
})
