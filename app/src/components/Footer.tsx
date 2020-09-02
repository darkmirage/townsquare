import React from 'react';
import { createUseStyles } from 'react-jss';

const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.Footer}>
      <a href="https://www.notion.so/talkontownsquare/Privacy-Policy-af62457f66074bcba6a8bca35b4efea1">
        Privacy policy
      </a>
      <a href="https://www.notion.so/talkontownsquare/Terms-of-Service-4fb3cffde21c4fbabacc8f2adb38fabd">
        Terms
      </a>
      <a href="mailto:raven@cs.stanford.edu?Subject=TownSquare">Contact</a>
      <div>Copyright © 2020 TownSquare</div>
    </div>
  );
};

const useStyles = createUseStyles({
  Footer: {
    alignItems: 'flex-end',
    display: 'flex',
    fontSize: 12,
    height: '9vh',
    justifyContent: 'center',
    width: '100%',
    '& *': {
      margin: 8,
    },
    '@media (max-width: 600px)': {
      flexDirection: 'column',
    },
  },
});

export default Footer;
