import React from 'react';
import { createUseStyles } from 'react-jss';
import { gql } from '@apollo/client';

import TownerBox from './TownerBox';

type Props = {
  gathering: {
    description: string;
    participants: any[];
  };
};

const GatheringBox = (props: Props) => {
  const classes = useStyles();
  const { description, participants } = props.gathering;

  const towners = participants.map((p) => (
    <TownerBox key={p.towner.id} towner={p.towner} />
  ));

  return (
    <div className={classes.GatheringBox}>
      <div className={classes.GatheringBox_label}>{description}</div>
      {towners}
    </div>
  );
};

const useStyles = createUseStyles({
  GatheringBox: {
    border: '4px solid #777',
    borderRadius: 12,
    display: 'flex',
    padding: 8,
    maxWidth: 200,
  },
  GatheringBox_label: {
    fontSize: 14,
  },
});

GatheringBox.fragments = {
  gathering: gql`
    fragment GatheringBoxGathering on gathering {
      id
      description
      is_invite_only
      is_resident_only
      participants {
        towner {
          id
          ...TownerBoxTowner
        }
      }
    }

    ${TownerBox.fragments.towner}
  `,
};

export default GatheringBox;
