import React from 'react';
import { createUseStyles } from 'react-jss';
import { gql } from '@apollo/client';

import { TownerContext } from './TownerProvider';
import DummyGatheringBox from './DummyGatheringBox';
import GatheringBox from './GatheringBox';

type Props = {
  square: {
    gatherings: any[];
  };
};

const GatheringList = (props: Props) => {
  const { townerId } = React.useContext(TownerContext);
  const { gatherings } = props.square;
  const classes = useStyles();

  let activeGathering: React.ReactNode | null = null;

  const elems = gatherings.map((gathering: any) => {
    const moderator = gathering.moderator[0];
    const isModerator = moderator && moderator.towner_id === townerId;

    const townerIds = gathering.participants.map((p: any) => p.towner.id);
    const isActive = townerIds.includes(townerId);

    const elem = (
      <GatheringBox
        key={gathering.id}
        gathering={gathering}
        isActive={isActive}
        isModerator={isModerator}
      />
    );

    if (isActive) {
      activeGathering = elem;
      return null;
    } else {
      return elem;
    }
  });

  return (
    <>
      <div className={classes.GatheringList}>
        {activeGathering}
        <DummyGatheringBox />
      </div>
      <div className={classes.GatheringList}>{elems}</div>
    </>
  );
};

const useStyles = createUseStyles({
  GatheringList: {
    alignItems: 'flex-start',
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: 12,
    width: '100%',
  },
});

GatheringList.fragments = {
  square: gql`
    fragment GatheringListSquare on square {
      gatherings(order_by: { id: desc }) {
        id
        moderator: participants(
          limit: 1
          where: { is_moderator: { _eq: true } }
        ) {
          id
          towner_id
        }
        ...GatheringBoxGathering
      }
    }

    ${GatheringBox.fragments.gathering}
  `,
};

export default GatheringList;
