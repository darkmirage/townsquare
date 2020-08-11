import React from 'react';
import { createUseStyles } from 'react-jss';
import { gql } from '@apollo/client';

type Props = {
  towner: any;
};

const TownerBox = (props: Props) => {
  const classes = useStyles();

  return <div className={classes.TownerBox}>{props.towner.name}</div>;
};

const useStyles = createUseStyles({
  TownerBox: {
    boxSizing: 'border-box',
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 16,
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
  },
});

TownerBox.fragments = {
  towner: gql`
    fragment TownerBoxTowner on towner {
      id
      name
      is_online
      is_visitor
    }
  `,
};

export default TownerBox;
