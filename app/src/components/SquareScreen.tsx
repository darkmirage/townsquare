import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { gql, useSubscription } from '@apollo/client';

import TownerList from './TownerList';

const GET_SQUARE = gql`
  subscription GetSquare($domain: String!) {
    square(where: { domain: { _eq: $domain } }) {
      id
      name
      domain
      ...TownerListSquare
    }
  }

  ${TownerList.fragments.square}
`;

const SquareScreen = (
  props: RouteComponentProps<{ domain: string }, {}, undefined>
) => {
  const domain = props.match.params['domain'];
  const classes = useStyles();
  const { loading, error, data } = useSubscription(GET_SQUARE, {
    variables: { domain },
  });

  if (loading) return null;
  if (error) return <div>Error</div>;

  const square = data.square[0];

  return (
    <div className={classes.SquareScreen}>
      {square.name}
      <TownerList square={square} />
    </div>
  );
};

const useStyles = createUseStyles({
  SquareScreen: {},
});

export default SquareScreen;
