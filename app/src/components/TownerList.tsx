import React from 'react';
import { gql } from '@apollo/client';

import TownerBox from './TownerBox';

type Props = {
  square: any;
};

const TownerList = (props: Props) => {
  const { towners } = props.square;
  const elems = towners.map((towner: any) => (
    <TownerBox key={towner.id} towner={towner} />
  ));

  return (
    <div>
      List:
      {elems}
    </div>
  );
};

TownerList.fragments = {
  square: gql`
    fragment TownerListSquare on square {
      towners {
        id
        ...TownerBoxTowner
      }
    }

    ${TownerBox.fragments.towner}
  `,
};

export default TownerList;
