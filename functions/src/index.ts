import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const joinSquare = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated'
    );
  }

  const user = await admin.auth().getUser(uid);

  // TODO: validate permission per Square
  if (!user.email || !user.email.includes('stanford.edu')) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'User is not in the beta'
    );
  }

  const snapshot = await admin
    .firestore()
    .collection('/townersPrivate')
    .where('userId', '==', uid)
    .where('squareId', '==', 'stanford')
    .get();
  if (snapshot.size === 0) {
    const doc = await admin.firestore().collection('/townersPrivate').add({
      userId: uid,
      squareId: 'stanford',
    });
    await admin.firestore().collection('/towners').doc(doc.id).set({
      displayName: user.displayName,
    });

    return doc.id;
  } else {
    const doc = snapshot.docs[0];
    return doc.id;
  }
});
