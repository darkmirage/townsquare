import React from 'react';
import { createUseStyles } from 'react-jss';

import { AuthContext } from './AuthProvider';
import SignOutButton from './SignOutButton';
import FullScreenMessage from './FullScreenMessage';

type Props = {
  name: string;
};

const UnauthorizedMessage = (props: Props) => {
  const classes = useStyles();
  const { user } = React.useContext(AuthContext);

  const header = <>Oops!</>;
  const body = (
    <>
      <p>
        You do not have permission to access the townsquare of{' '}
        <strong>{props.name}</strong>. Please check with the administrator or
        sign in with a different account that does have access.
      </p>
      <p>
        Signed in as <strong>{user?.email}</strong>.
      </p>
    </>
  );
  const footer = (
    <SignOutButton className={classes.UnauthorizedMessage_button}>
      Enter Townsquare
    </SignOutButton>
  );

  return <FullScreenMessage header={header} body={body} footer={footer} />;
};

const useStyles = createUseStyles({
  UnauthorizedMessage_button: {
    background: 'rgb(255, 81, 0)',
    padding: '8px 16px',
  },
});

export default UnauthorizedMessage;
