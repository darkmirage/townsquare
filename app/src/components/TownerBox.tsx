import React from 'react';
import { createUseStyles } from 'react-jss';
import { gql } from '@apollo/client';

import { getInitials } from 'utils';

type Props = {
  towner: { name: string };
};

const TownerBox = (props: Props) => {
  const classes = useStyles();
  const { name } = props.towner;
  const initials = getInitials(name);

  return (
    <div className={classes.TownerBox}>
      <div className={classes.TownerBox_avatar}>{initials}</div>
      <div className={classes.TownerBox_label}>{name}</div>
    </div>
  );
};

const useStyles = createUseStyles({
  TownerBox: {
    margin: 8,
    width: 64,
  },
  TownerBox_avatar: {
    alignItems: 'center',
    backgroundColor: '#777',
    borderRadius: 32,
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
    boxSizing: 'border-box',
    color: '#fff',
    display: 'flex',
    fontSize: 24,
    height: 64,
    justifyContent: 'center',
    userSelect: 'none',
    width: 64,
  },
  TownerBox_label: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
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
