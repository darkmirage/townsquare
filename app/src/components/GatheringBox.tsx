import React from 'react';
import { createUseStyles } from 'react-jss';
import { gql, useMutation } from '@apollo/client';

import { TownerContext } from './TownerProvider';
import TownerBox from './TownerBox';
import Button from './Button';

type Props = {
  gathering: {
    id: number;
    description: string;
    participants: any[];
  };
};

const JOIN_GATHERING = gql`
  mutation JoinGathering($gatheringId: Int!, $leave: Boolean!) {
    joinGathering(gatheringId: $gatheringId, leave: $leave) {
      success
    }
  }
`;

const GatheringBox = (props: Props) => {
  const classes = useStyles();
  const { description, participants, id } = props.gathering;
  const { townerId } = React.useContext(TownerContext);
  const [joinGathering, { loading }] = useMutation(JOIN_GATHERING);

  let isActive = false;

  const towners = participants.map((p) => {
    const isUser = townerId === p.towner.id;
    if (isUser) {
      isActive = true;
    }

    return <TownerBox key={p.towner.id} towner={p.towner} isUser={isUser} />;
  });

  const handleClick = React.useCallback(() => {
    joinGathering({ variables: { gatheringId: id, leave: isActive } });
  }, [joinGathering, isActive, id]);

  return (
    <div className={classes.GatheringBox}>
      <div className={classes.GatheringBox_label}>{description}</div>
      {towners}
      <div className={classes.GatheringBox_menu}>
        <Button onClick={handleClick} loading={loading}>
          {isActive ? 'Leave' : 'Join'}
        </Button>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  GatheringBox: {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    display: 'flex',
    flexWrap: 'wrap',
    padding: 8,
    marginBottom: 12,
    marginRight: 24,
    maxWidth: 240,
    position: 'relative',
    transition: '200ms',
    '&:hover': {
      background: '#eee',
      '& $GatheringBox_menu': {
        opacity: 1.0,
      },
    },
  },
  GatheringBox_label: {
    fontSize: 14,
    position: 'absolute',
    top: 0,
  },
  GatheringBox_menu: {
    bottom: 0,
    opacity: 0,
    position: 'absolute',
    right: 0,
    transform: 'translate(-8px, 12px)',
    transition: '200ms',
  },
});

GatheringBox.fragments = {
  gathering: gql`
    fragment GatheringBoxGathering on gathering {
      id
      description
      is_invite_only
      is_resident_only
      participants(order_by: { towner: { name: asc } }) {
        id
        towner {
          id
          user_id
          ...TownerBoxTowner
        }
      }
    }

    ${TownerBox.fragments.towner}
  `,
};

export default GatheringBox;
