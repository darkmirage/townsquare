import React from 'react';
import { gql, useMutation } from '@apollo/client';

import firebase from 'firebaseApp';

const GET_OR_CREATE_USER = gql`
  mutation GetOrCreateUser($firebaseIdToken: String!) {
    getOrCreateUser(firebaseIdToken: $firebaseIdToken) {
      hasuraToken
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

    const { hasuraToken } = data.getOrCreateUser;
    localStorage.setItem('HASURA_TOKEN', hasuraToken);

    setContext({
      loading: false,
      user: firebase.auth().currentUser,
    });
  }, [data]);

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
