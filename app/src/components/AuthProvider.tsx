import React from 'react';
import { gql, useMutation } from '@apollo/client';

import firebase from 'firebaseApp';
import { refreshToken } from 'jwt';

const GET_OR_CREATE_USER = gql`
  mutation GetOrCreateUser($firebaseIdToken: String!) {
    getOrCreateUser(firebaseIdToken: $firebaseIdToken) {
      success
    }
  }
`;

const defaultContext = {
  loading: true,
  user: firebase.auth().currentUser,
};

export const AuthContext = React.createContext(defaultContext);

const AuthProvider = (props: React.ComponentPropsWithoutRef<'div'>) => {
  const [context, setContext] = React.useState(defaultContext);
  const [getOrCreateUser, { data }] = useMutation(GET_OR_CREATE_USER);

  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged(async () => {
      const user = firebase.auth().currentUser;
      if (!user) {
        return;
      }

      const token = await user.getIdToken();
      getOrCreateUser({ variables: { firebaseIdToken: token } });
    });
  }, [getOrCreateUser]);

  React.useEffect(() => {
    if (!data) {
      return;
    }
    const success = data.getOrCreateUser;
    const user = firebase.auth().currentUser;
    if (!user || !success) {
      throw new Error('Login failed');
    }

    refreshToken(true).then(() => {
      setContext({ loading: false, user });
    });
  }, [data]);

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
