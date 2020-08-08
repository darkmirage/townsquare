import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { createUseStyles } from 'react-jss';

const TownSquareScreen = (
  props: RouteComponentProps<{ squareId?: string }, {}, undefined>
) => {
  const classes = useStyles();
  const squareId = props.match.params['squareId'];
  return <div className={classes.TownSquareScreen}>{squareId}</div>;
};

const useStyles = createUseStyles({
  TownSquareScreen: {
    minWidth: 400,
    minHeight: 400,
  },
});

export default TownSquareScreen;
