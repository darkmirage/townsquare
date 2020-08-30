import React from 'react';
import { gql, useMutation } from '@apollo/client';

import firebase from 'firebaseApp';
import { refreshToken } from 'jwt';
import Spinner from './Spinner';

const GET_OR_CREATE_USER = gql`
  mutation GetOrCreateUser($firebaseIdToken: String!) {
    getOrCreateUser(firebaseIdToken: $firebaseIdToken) {
      success
      userId
    }
  }
`;

type AuthContextType = {
  loading: boolean;
  user: firebase.User | null;
  userId: number;
};

const defaultContext: AuthContextType = {
  loading: true,
  user: firebase.auth().currentUser,
  userId: 0,
};

export const AuthContext = React.createContext<AuthContextType>(defaultContext);

const AuthProvider = (props: React.ComponentPropsWithoutRef<'div'>) => {
  const [context, setContext] = React.useState(defaultContext);
  const [getOrCreateUser, { data, loading }] = useMutation(GET_OR_CREATE_USER);

  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged(async () => {
      const user = firebase.auth().currentUser;
      if (!user) {
        setContext((c) => ({ ...c, loading: false, user: null }));
        return;
      }

      const token = await user.getIdToken();
      setContext((c) => ({ ...c, loading: true }));
      getOrCreateUser({ variables: { firebaseIdToken: token } });
    });
  }, [getOrCreateUser]);

  React.useEffect(() => {
    if (!data) {
      return;
    }
    const { success, userId } = data.getOrCreateUser;
    const user = firebase.auth().currentUser;
    if (!user || !success) {
      throw new Error('Login failed');
    }

    refreshToken(true).then(() => {
      setContext({ loading: false, user, userId });
    });
  }, [data]);

  return (
    <AuthContext.Provider value={context}>
      {loading ? <Spinner /> : props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
