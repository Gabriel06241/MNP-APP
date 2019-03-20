import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const sendNotification = (owner_uid: string, type: string) => {
  return new Promise((resolve, reject) => {
    admin.firestore().collection('users').doc(owner_uid).get()
      .then((doc) => {
        if (doc.exists && doc.data()!.token) {
          if (type === 'new_comment') {
            admin.messaging().sendToDevice(doc.data()!.token, {
              data: {
                title: 'A new comment has been made on your spot.',
                sound: 'default',
                body: 'Tap to Check!'
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
  const doc = await admin.firestore().collection('spot').doc(spotId).get();
  if (doc.exists) {
    let commentsCount = doc.data()!.commentsCount || 0;
    commentsCount++;
    await admin.firestore().collection('spot').doc(spotId).update({
      "commentsCount": commentsCount
    })
    return sendNotification(doc.data()!.owner, 'new_comment');
  } else {
    return false;
  }
})
