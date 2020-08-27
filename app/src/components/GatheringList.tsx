import React from 'react';
import { createUseStyles } from 'react-jss';
import { gql } from '@apollo/client';

import GatheringBox from './GatheringBox';

type Props = {
  square: any;
};

const GatheringList = (props: Props) => {
  const { gatherings } = props.square;
  const classes = useStyles();
  const elems = gatherings.map((gathering: any) => (
    <GatheringBox key={gathering.id} gathering={gathering} />
  ));

  return <div className={classes.GatheringList}>{elems}</div>;
};

const useStyles = createUseStyles({
  GatheringList: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: 12,
    width: '100%',
  },
});

GatheringList.fragments = {
  square: gql`
    fragment GatheringListSquare on square {
      gatherings {
        id
        ...GatheringBoxGathering
      }
    }

    ${GatheringBox.fragments.gathering}
  `,
};

export default GatheringList;
