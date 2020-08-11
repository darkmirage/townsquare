import React from 'react';

import firebase from 'firebaseApp';

const defaultContext = {
  loading: true,
  user: firebase.auth().currentUser,
};

export const AuthContext = React.createContext(defaultContext);

const AuthProvider = (props: React.ComponentPropsWithoutRef<'div'>) => {
  const [context, setContext] = React.useState(defaultContext);

  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged(() => {
      setContext({
        loading: false,
        user: firebase.auth().currentUser,
      });
    });
  }, [setContext]);

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
