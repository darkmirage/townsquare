import React from 'react';
import { Button, IButtonProps } from '@blueprintjs/core';
import { createUseStyles } from 'react-jss';

import firebase from 'firebaseApp';

const SignInButton = (props: IButtonProps) => {
  const classes = useStyles();

  const handleClick = React.useCallback(async () => {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
  }, []);

  return (
    <button {...props} onClick={handleClick} className={classes.SignInButton}>
      <span className={classes.SignInButton_label}>Sign in with Google</span>
    </button>
  );
};

const useStyles = createUseStyles({
  SignInButton: {
    backgroundImage: 'url("/images/btn_google_signin_dark_normal_web@2x.png")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    border: 0,
    cursor: 'pointer',
    height: 46,
    outline: 'none',
    width: 191,
    '&:focus': {
      backgroundImage: 'url("/images/btn_google_signin_dark_focus_web@2x.png")',
    },
    '&:active': {
      backgroundImage:
        'url("/images/btn_google_signin_dark_pressed_web@2x.png")',
    },
    '&[disabled]': {
      backgroundImage:
        'url("/images/btn_google_signin_dark_disabled_web@2x.png")',
      cursor: 'default',
    },
  },
  SignInButton_label: {
    visibility: 'hidden',
  },
});

export default SignInButton;
