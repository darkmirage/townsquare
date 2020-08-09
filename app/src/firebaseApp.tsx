import * as firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyB-oW1GRFe3nX7JjUFLMltojsXHxbBvCY8',
  authDomain: 'townsquare-chat.firebaseapp.com',
  databaseURL: 'https://townsquare-chat.firebaseio.com',
  projectId: 'townsquare-chat',
  storageBucket: 'townsquare-chat.appspot.com',
  messagingSenderId: '673417420127',
  appId: '1:673417420127:web:810b5100affda1adf42aea',
  measurementId: 'G-34QR4HEEZV',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

(window as any).firebase = firebase;

export default firebase;
