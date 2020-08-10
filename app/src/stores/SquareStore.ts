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

let unsubscribe: Function | null = null;

SquareStore.subscribe(
  (s) => s.id,
  (newId) => {
    if (unsubscribe) {
      unsubscribe();
    }

    SquareStore.update((s) => {
      s.loading = true;
    });

    firebase
      .functions()
      .httpsCallable('joinSquare')(newId)
      .then((towner) => {
        SquareStore.update((s) => {
          s.self = (towner as any) as Towner;
        });
      });

    unsubscribe = firebase
      .firestore()
      .collection('squares')
      .doc(newId)
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
