import React from 'react';
import { createUseStyles } from 'react-jss';
import { gql } from '@apollo/client';

import TownerBox from './TownerBox';

type Props = {
  square: any;
};

const TownerList = (props: Props) => {
  const { towners } = props.square;
  const classes = useStyles();
  const elems = towners.map((towner: any) => (
    <TownerBox key={towner.id} towner={towner} />
  ));

  return <div className={classes.TownerList}>{elems}</div>;
};

const useStyles = createUseStyles({
  TownerList: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
});

TownerList.fragments = {
  square: gql`
    fragment TownerListSquare on square {
      towners(where: { participant: { gathering_id: { _is_null: true } } }) {
        id
        ...TownerBoxTowner
      }
    }

    ${TownerBox.fragments.towner}
  `,
};

export default TownerList;
