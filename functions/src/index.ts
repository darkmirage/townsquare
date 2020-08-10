import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const joinSquare = functions.https.onCall(async (data, context) => {
  const squareId: string = data;
  const uid = context.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated'
    );
  }

  const user = await admin.auth().getUser(uid);

  if (!squareId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid SquareID'
    );
  }

  // TODO: validate permission per Square
  if (!user.email) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'User is not in the beta'
    );
  }

  const snapshot = await admin
    .firestore()
    .collection('townersPrivate')
    .where('userId', '==', uid)
    .where('squareId', '==', squareId)
    .get();

  let towner = {
    displayName: user.displayName,
  };
  let townerId = '';

  if (snapshot.size === 0) {
    const ref = await admin.firestore().collection('townersPrivate').add({
      userId: uid,
      squareId,
    });
    await admin.firestore().collection('towners').doc(ref.id).set(towner);
    townerId = ref.id;
  } else {
    const doc = snapshot.docs[0];
    towner = doc.data() as any;
    townerId = doc.id;
  }

  const squareRef = admin.firestore().collection('squares').doc(squareId);
  await squareRef.update({
    towners: admin.firestore.FieldValue.arrayUnion(townerId),
  });

  return towner;
});
