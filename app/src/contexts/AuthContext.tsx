import React from 'react';

import firebase from 'firebaseApp';

const AuthContext = React.createContext(firebase.auth().currentUser);

export default AuthContext;
