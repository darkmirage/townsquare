import React from 'react';
import { gql, useMutation } from '@apollo/client';

import { AuthContext } from './AuthProvider';

const SET_PHOTO = gql`
  mutation SetPhoto($firebaseId: String!, $url: String!) {
    update_user(
      where: { firebase_id: { _eq: $firebaseId } }
      _set: { photo_url: $url }
    ) {
      affected_rows
    }
  }
`;

const PhotoUpdater = () => {
  const { user } = React.useContext(AuthContext);
  const [setPhoto] = useMutation(SET_PHOTO);

  React.useEffect(() => {
    if (user && user.photoURL) {
      setPhoto({ variables: { firebaseId: user.uid, url: user.photoURL } });
    }
  }, [user, setPhoto]);

  return null;
};

export default PhotoUpdater;
