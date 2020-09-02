import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { gql, useSubscription } from '@apollo/client';
import { ImQuestion } from 'react-icons/im';

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

const HelpGathering = () => {
  const classes = useStyles();
  return (
    <div className={classes.SquareScreen_question}>
      <ImQuestion />
      <div className={classes.SquareScreen_answer}>
        Gatherings are real-time audio chats! The host is marked with a{' '}
        <span role="img" aria-label="host">
          👑
        </span>{' '}
        and can modify or close a gathering.
      </div>
    </div>
  );
};

const HelpTowner = () => {
  const classes = useStyles();
  return (
    <div className={classes.SquareScreen_question}>
      <ImQuestion />
      <div className={classes.SquareScreen_answer}>
        If you click on a towner who is online, you will start a new gathering
        with them!
      </div>
    </div>
  );
};

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
      <h1>
        Gatherings <HelpGathering />
      </h1>
      <ActiveGathering />
      <GatheringList square={square} />
      <h1>
        Towners <HelpTowner />
      </h1>

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
    '& h1': {
      color: 'rgba(0, 0, 0, 0.7)',
      fontSize: 24,
      marginBottom: 24,
      marginTop: 24,
      useSelect: 'none',
    },
  },
  SquareScreen_name: {
    display: 'none',
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 16,
  },
  SquareScreen_question: {
    color: '#aaa',
    cursor: 'pointer',
    display: 'inline-block',
    fontSize: 20,
    margin: 4,
    position: 'relative',
    transition: 'color 200ms',
    '&:hover': {
      color: 'rgba(0, 0, 0, 0.7)',
      '& $SquareScreen_answer': {
        visibility: 'visible',
        opacity: 1,
      },
    },
  },
  SquareScreen_answer: {
    background: '#333',
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: 300,
    lineHeight: 1.25,
    opacity: 0,
    padding: '8px 12px',
    position: 'absolute',
    transition: 'opacity 200ms',
    visibility: 'hidden',
    width: 180,
    zIndex: 10,
  },
});

export default SquareScreen;
