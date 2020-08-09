import React from 'react';
import { useStoreState } from 'pullstate';
import { RouteComponentProps } from 'react-router-dom';

import SignInButton from './SignInButton';
import { AuthStore } from 'stores';

const SignInScreen = (
  props: RouteComponentProps<{}, {}, { referrer: string } | undefined>
) => {
  const { user, loading } = useStoreState(AuthStore);

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

  return loading ? null : <SignInButton />;
};

export default SignInScreen;
