import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';

import AuthContext from 'AuthContext';

type Props = RouteProps;

const PrivateRoute = ({ component: Component, render, ...rest }: Props) => {
  const currentUser = React.useContext(AuthContext);
  console.log(currentUser);

  if (!Component) {
    throw new Error('Missing component');
  }

  return (
    <Route
      {...rest}
      render={(innerProps) => {
        return currentUser ? (
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
