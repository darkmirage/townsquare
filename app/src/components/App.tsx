import React from 'react';
import { createUseStyles } from 'react-jss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import AuthProvider from './AuthProvider';
import PrivateRoute from './PrivateRoute';
import SignInScreen from './SignInScreen';
import SquareScreen from './SquareScreen';
import apolloClient from 'apolloClient';

const App = () => {
  const classes = useStyles();

  const routes = (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={SignInScreen} />
        <PrivateRoute exact path="/t/:domain" component={SquareScreen} />
      </Switch>
    </BrowserRouter>
  );

  return (
    <div className={classes.root}>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>{routes}</AuthProvider>
      </ApolloProvider>
    </div>
  );
};

const useStyles = createUseStyles({
  root: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
  },
});

export default App;
