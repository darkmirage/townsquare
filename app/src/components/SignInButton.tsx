import React from 'react';
import { Button } from '@blueprintjs/core';

import firebase from 'firebaseApp';

const SignInButton = () => {
  const handleClick = React.useCallback(async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
  }, []);

  return <Button onClick={handleClick}>Sign in with Google</Button>;
};

export default SignInButton;
