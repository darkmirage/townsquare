import React from 'react';
import { createUseStyles } from 'react-jss';
import { gql } from '@apollo/client';

import { TownerContext } from './TownerProvider';
import TownerBox from './TownerBox';

type Props = {
  square: any;
};

const TownerList = (props: Props) => {
  const { townerId } = React.useContext(TownerContext);
  const { towners } = props.square;
  const classes = useStyles();
  const elems = towners.map((towner: any) => (
    <TownerBox
      key={towner.id}
      towner={towner}
      clickable
      isUser={townerId === towner.id}
    />
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
      towners(
        order_by: { is_online: desc, name: asc }
        where: { participant: { gathering_id: { _is_null: true } } }
      ) {
        id
        user_id
        ...TownerBoxTowner
      }
    }

    ${TownerBox.fragments.towner}
  `,
};

export default TownerList;
