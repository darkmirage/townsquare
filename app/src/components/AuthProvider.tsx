import React from 'react';

import AuthContext from 'contexts/AuthContext';
import firebase from 'firebaseApp';

type Props = {
  children: React.ReactNode;
};

const AuthProvider = (props: Props) => {
  const [currentUser, setCurrentUser] = React.useState(
    () => firebase.auth().currentUser
  );
  const [loading, setLoading] = React.useState(true);

  firebase.auth().onAuthStateChanged(() => {
    setCurrentUser(firebase.auth().currentUser);
    setLoading(false);
  });

  return (
    <AuthContext.Provider value={currentUser}>
      {loading ? null : props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
