import React from 'react';
import { createUseStyles } from 'react-jss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import SignInScreen from './SignInScreen';
import TownSquareScreen from './TownSquareScreen';
import AuthProvider from './AuthProvider';

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AuthProvider>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={SignInScreen} />
            <PrivateRoute
              exact
              path="/t/:squareId"
              component={TownSquareScreen}
            />
          </Switch>
        </BrowserRouter>
      </AuthProvider>
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
