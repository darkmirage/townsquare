import { Store } from 'pullstate';

import { Square } from './types';
import firebase from 'firebaseApp';

const initialSquare: Square = {
  name: '',
  towners: [],
  gatherings: [],
};

const initialState = {
  loading: true,
  id: '',
  square: initialSquare,
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
