import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';

import { AuthContext } from './AuthProvider';

type Props = RouteProps;

const PrivateRoute = ({ component: Component, render, ...rest }: Props) => {
  const { user, loading } = React.useContext(AuthContext);

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
