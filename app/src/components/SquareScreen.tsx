import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { gql, useSubscription } from '@apollo/client';

import ActiveGathering from './ActiveGathering';
import GatheringList from './GatheringList';
import Spinner from './Spinner';
import TownerList from './TownerList';
import TownerProvider from './TownerProvider';
import UnauthorizedMessage from './UnauthorizedMessage';
import UserToolbar from './UserToolbar';
import WelcomeMessage from './WelcomeMessage';

const GET_SQUARE = gql`
  subscription GetSquare($domain: String!) {
    square(where: { domain: { _eq: $domain } }) {
      id
      name
      domain
      ...TownerListSquare
      ...GatheringListSquare
    }
  }

  ${TownerList.fragments.square}
  ${GatheringList.fragments.square}
`;

const SquareScreen = (
  props: RouteComponentProps<{ domain: string }, {}, undefined>
) => {
  const domain = props.match.params['domain'];
  const classes = useStyles();
  const { loading, error, data } = useSubscription(GET_SQUARE, {
    variables: { domain },
  });
  const [interacted, setInteracted] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setInteracted(true);
  }, [setInteracted]);

  if (loading) return <Spinner />;
  if (error) return <div>Error</div>;

  const square = data.square[0];

  const content = interacted ? (
    <TownerProvider
      domain={domain}
      unauthorized={<UnauthorizedMessage name={square.name} />}
    >
      <UserToolbar />
      <ActiveGathering />
      <GatheringList square={square} />
      <TownerList square={square} />
    </TownerProvider>
  ) : (
    <WelcomeMessage name={square.name} onClick={handleClick} />
  );

  return (
    <div className={classes.SquareScreen}>
      <div className={classes.SquareScreen_name}>{square.name}</div>
      {content}
    </div>
  );
};

const useStyles = createUseStyles({
  SquareScreen: {
    maxWidth: 960,
    padding: 16,
  },
  SquareScreen_name: {
    display: 'none',
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 16,
  },
});

export default SquareScreen;
