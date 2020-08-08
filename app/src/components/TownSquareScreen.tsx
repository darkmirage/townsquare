import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

const TownSquareScreen = (
  props: RouteComponentProps<{ squareId?: string }, {}, undefined>
) => {
  const squareId = props.match.params['squareId'];
  return <div>{squareId}</div>;
};

export default TownSquareScreen;
