import React from 'react';

import firebase from 'firebaseApp';
import Button from './Button';

const SignOutButton = (props: React.ComponentPropsWithoutRef<'button'>) => {
  const handleClick = React.useCallback(async () => {
    await firebase.auth().signOut();
  }, []);

  return (
    <Button className={props.className} onClick={handleClick}>
      Sign out
    </Button>
  );
};

export default SignOutButton;
