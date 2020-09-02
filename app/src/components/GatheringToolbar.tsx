import React from 'react';
import { createUseStyles } from 'react-jss';
import { gql, useSubscription } from '@apollo/client';

import { TownerContext } from './TownerProvider';
import JoinGatheringButton from './JoinGatheringButton';
import MuteToggle from './MuteToggle';

type Props = {
  gatheringId: number;
};

const GET_TOWNER = gql`
  subscription GetTowner($townerId: Int!) {
    towner_by_pk(id: $townerId) {
      id
      is_online
      is_away
      name
      participant {
        id
        ...MuteToggleParticipant
        gathering {
          id
        }
      }
    }
  }

  ${MuteToggle.fragments.participant}
`;

const GatheringToolbar = ({ gatheringId }: Props) => {
  const classes = useStyles();
  const { townerId } = React.useContext(TownerContext);
  const { loading, data } = useSubscription(GET_TOWNER, {
    variables: { townerId },
  });
  if (loading) {
    return null;
  }

  const { towner_by_pk: towner } = data;
  const { participant } = towner;

  return (
    <div className={classes.GatheringToolbar}>
      <MuteToggle
        className={classes.GatheringToolbar_button}
        participant={participant}
      />
      <JoinGatheringButton
        className={classes.GatheringToolbar_button}
        gatheringId={gatheringId}
        leave
      />
    </div>
  );
};

const useStyles = createUseStyles({
  GatheringToolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 4,
  },
  GatheringToolbar_button: {
    marginBottom: 4,
    marginRight: 4,
  },
});

export default GatheringToolbar;
