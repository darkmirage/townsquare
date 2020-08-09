import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import firebase from 'firebaseApp';
import AuthContext from 'contexts/AuthContext';
import SignInButton from './SignInButton';

(window as any).firebase = firebase;

const SignInScreen = (
  props: RouteComponentProps<{}, {}, { referrer: string } | undefined>
) => {
  const currentUser = React.useContext(AuthContext);

  React.useEffect(() => {
    if (currentUser) {
      const referrer = props.location.state?.referrer;

      if (referrer) {
        props.history.push(referrer);
      } else {
        props.history.push('/t/stanford');
      }
    }
  }, [currentUser, props.history, props.location.state]);

  return <SignInButton />;
};

export default SignInScreen;
