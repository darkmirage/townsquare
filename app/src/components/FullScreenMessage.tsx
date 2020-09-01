import React from 'react';
import { createUseStyles } from 'react-jss';

type Props = {
  header: React.ReactNode;
  body: React.ReactNode;
  footer: React.ReactNode;
};

const FullScreenMessage = (props: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.FullScreenMessage}>
      <div className={classes.FullScreenMessage_header}>{props.header}</div>
      <div className={classes.FullScreenMessage_body}>{props.body}</div>
      {props.footer}
    </div>
  );
};

const useStyles = createUseStyles({
  FullScreenMessage: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    width: 352,
    lineHeight: 1.5,
    fontSize: 20,
  },
  FullScreenMessage_body: {
    marginTop: 20,
    marginBottom: 32,
  },
  FullScreenMessage_header: {
    fontSize: 30,
  },
});

export default FullScreenMessage;
