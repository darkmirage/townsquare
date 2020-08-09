import { Store } from 'pullstate';

import firebase from 'firebaseApp';

const initialState = {
  loading: true,
  user: firebase.auth().currentUser,
};
const AuthStore = new Store(initialState);

firebase.auth().onAuthStateChanged(() => {
  AuthStore.update((s) => {
    s.user = firebase.auth().currentUser;
    s.loading = false;
  });
});

export default AuthStore;
