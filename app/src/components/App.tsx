import React from 'react';
import { createUseStyles } from 'react-jss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { AnimateSharedLayout } from 'framer-motion';

import AgoraProvider from './AgoraProvider';
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
    <div className={classes.App}>
      <div className={classes.App_container}>
        <AnimateSharedLayout>
          <AgoraProvider>
            <ApolloProvider client={apolloClient}>
              <AuthProvider>{routes}</AuthProvider>
            </ApolloProvider>
          </AgoraProvider>
        </AnimateSharedLayout>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  App: {
    alignItems: 'flex-start',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
  },
  App_container: {
    minHeight: '90%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
