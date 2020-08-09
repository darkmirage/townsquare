import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import { AuthStore } from 'stores';

type Props = RouteProps;

const PrivateRoute = ({ component: Component, render, ...rest }: Props) => {
  const { user, loading } = useStoreState(AuthStore);

  if (!Component) {
    throw new Error('Missing component');
  }

  if (loading) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={(innerProps) => {
        return user ? (
          <Component {...innerProps} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { referrer: innerProps.location.pathname },
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;
