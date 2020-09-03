import React from 'react';
import { createUseStyles } from 'react-jss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { AnimateSharedLayout } from 'framer-motion';

import AgoraProvider from './AgoraProvider';
import AuthProvider from './AuthProvider';
import Footer from './Footer';
import PrivateRoute from './PrivateRoute';
import SignInScreen from './SignInScreen';
import SquareScreen from './SquareScreen';
import VideoProvider from './VideoProvider';
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
              <VideoProvider>
                <AuthProvider>{routes}</AuthProvider>
              </VideoProvider>
            </ApolloProvider>
          </AgoraProvider>
        </AnimateSharedLayout>
      </div>
      <Footer />
    </div>
  );
};

const useStyles = createUseStyles({
  App: {
    alignItems: 'center',
    display: 'flex',
    minHeight: '100%',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  App_container: {
    minHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
