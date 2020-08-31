import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import FullScreenMessage from './FullScreenMessage';
import SignInButton from './SignInButton';
import { AuthContext } from './AuthProvider';
import Spinner from './Spinner';

const SignInScreen = (
  props: RouteComponentProps<{}, {}, { referrer: string } | undefined>
) => {
  const { user, loading } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (user) {
      const referrer = props.location.state?.referrer;

      if (referrer) {
        props.history.push(referrer);
      } else {
        props.history.push('/t/stanford');
      }
    }
  }, [user, props.history, props.location.state]);

  if (user) {
    return <Spinner key="sign-in" />;
  }

  return loading ? (
    <Spinner key="sign-in" />
  ) : (
    <FullScreenMessage
      header={<strong>TownSquare</strong>}
      body={
        <>
          Please sign in to access your organization&apos;s virtual town square.
          Make sure to use the email associated with your organization.
        </>
      }
      footer={<SignInButton />}
    />
  );
};

export default SignInScreen;
