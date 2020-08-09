import { Store } from 'pullstate';

import { Square, Towner } from './types';
import firebase from 'firebaseApp';

const initialSquare: Square = {
  name: '',
  towners: [],
  gatherings: [],
};

type State = {
  loading: boolean;
  id: string;
  self: Towner | null;
  square: Square;
};

const initialState: State = {
  loading: true,
  id: '',
  square: initialSquare,
  self: null,
};

const SquareStore = new Store(initialState);

let unsubscribe = firebase
  .firestore()
  .doc('/squares/default')
  .onSnapshot(() => {});

SquareStore.subscribe(
  (s) => s.id,
  (newId) => {
    unsubscribe();
    SquareStore.update((s) => {
      s.loading = true;
    });

    firebase
      .functions()
      .httpsCallable('joinSquare')()
      .then((townerId) => {
        return firebase.firestore().doc(`/towners/${townerId}`).get();
      })
      .then((doc) => {
        const towner = doc.data() as Towner;
        SquareStore.update((s) => {
          s.self = towner;
        });
      });

    unsubscribe = firebase
      .firestore()
      .doc('/squares/' + newId)
      .onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (!data) {
          throw new Error(`Invalid squareId: ${newId}`);
        }
        const square = data as Square;
        SquareStore.update((s) => {
          s.square = square;
          s.loading = false;
        });
      });
  }
);

export default SquareStore;
