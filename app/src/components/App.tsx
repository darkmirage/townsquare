import React from 'react';
import { createUseStyles } from 'react-jss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import SignInScreen from './SignInScreen';
import SquareScreen from './SquareScreen';

const App = () => {
  const classes = useStyles();

  const routes = (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={SignInScreen} />
        <PrivateRoute exact path="/t/:squareId" component={SquareScreen} />
      </Switch>
    </BrowserRouter>
  );

  return <div className={classes.root}>{routes}</div>;
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
