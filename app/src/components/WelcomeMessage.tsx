import React from 'react';
import { createUseStyles } from 'react-jss';

import { AuthContext } from './AuthProvider';
import Button from './Button';

type Props = {
  name: string;
  onClick: () => void;
};

const WelcomeMessage = (props: Props) => {
  const classes = useStyles();
  const { user } = React.useContext(AuthContext);

  return (
    <div className={classes.WelcomeMessage}>
      <div className={classes.WelcomeMessage_header}>
        This is the online townsquare of <strong>{props.name}</strong>
      </div>
      <div className={classes.WelcomeMessage_text}>
        <p>
          You can start a conversation with anyone who is online, but please be
          respectful!
        </p>
        <p>
          Signed in as <strong>{user?.displayName}</strong> ({user?.email})
        </p>
      </div>

      <Button className={classes.WelcomeMessage_button} onClick={props.onClick}>
        Enter Townsquare
      </Button>
    </div>
  );
};

const useStyles = createUseStyles({
  WelcomeMessage: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    width: 400,
    lineHeight: 1.5,
    fontSize: 20,
  },
  WelcomeMessage_text: {
    marginTop: 20,
    marginBottom: 32,
  },
  WelcomeMessage_header: {
    fontSize: 30,
  },
  WelcomeMessage_button: {
    background: 'rgb(0, 176, 255)',
    padding: '8px 16px',
  },
});

export default WelcomeMessage;
