import { Store } from 'pullstate';

import { TownerID, Towner } from './types';
import firebase from 'firebaseApp';

const townerMap: Record<TownerID, Towner> = {};

const initialState = {
  loading: true,
  townerMap,
};

const TownerStore = new Store(initialState);

firebase
  .firestore()
  .collection('towners')
  .onSnapshot((snapshot) => {
    snapshot.forEach((doc) => {
      townerMap[doc.id] = doc.data() as any;
    });
    TownerStore.update((s) => {
      s.loading = false;
      s.townerMap = { ...townerMap };
    });
  });

export default TownerStore;
