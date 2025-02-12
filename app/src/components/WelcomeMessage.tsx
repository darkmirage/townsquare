import React from 'react';
import { createUseStyles } from 'react-jss';

import { AuthContext } from './AuthProvider';
import Button from './Button';
import FullScreenMessage from './FullScreenMessage';

type Props = {
  name: string;
  onClick: () => void;
};

const WelcomeMessage = (props: Props) => {
  const classes = useStyles();
  const { user } = React.useContext(AuthContext);

  const header = (
    <>
      This is the online townsquare of <strong>{props.name}</strong>
    </>
  );
  const body = (
    <>
      <p>
        You can start a conversation with anyone who is online, but please be
        respectful!
      </p>
      <p>
        Signed in as <strong>{user?.displayName}</strong> ({user?.email})
      </p>
    </>
  );
  const footer = (
    <Button className={classes.WelcomeMessage_button} onClick={props.onClick}>
      Enter Townsquare
    </Button>
  );

  return <FullScreenMessage header={header} body={body} footer={footer} />;
};

const useStyles = createUseStyles({
  WelcomeMessage_button: {
    background: 'rgb(0, 176, 255)',
    padding: '8px 16px',
  },
});

export default WelcomeMessage;
