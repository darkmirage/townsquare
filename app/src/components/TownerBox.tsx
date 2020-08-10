import React from 'react';
import { createUseStyles } from 'react-jss';

import { TownerStore, TownerID } from 'stores';

type Props = {
  id: TownerID;
};

const TownerBox = (props: Props) => {
  const { townerMap } = TownerStore.useState();
  const classes = useStyles();

  const towner = townerMap[props.id];
  if (!towner) {
    return null;
  }

  return <div className={classes.TownerBox}>{towner.displayName}</div>;
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

export default TownerBox;
