import React from 'react';
import { gql, useMutation } from '@apollo/client';
import useSound from 'use-sound';

import { AgoraContext } from './AgoraProvider';
import { TownerContext } from './TownerProvider';
import Button from './Button';
import LockToggle from './LockToggle';
import TownerBox from './TownerBox';
import PureGatheringBox from './PureGatheringBox';

type Props = {
  gathering: {
    id: number;
    is_invite_only: boolean;
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

const UPDATE_GATHERING = gql`
  mutation UpdateGathering($gatheringId: Int!, $description: String!) {
    update_gathering_by_pk(
      pk_columns: { id: $gatheringId }
      _set: { description: $description }
    ) {
      id
      description
    }
  }
`;

const GatheringBox = (props: Props) => {
  const {
    description,
    participants,
    id,
    is_invite_only: isInviteOnly,
  } = props.gathering;
  const { townerId } = React.useContext(TownerContext);
  const { connectionState } = React.useContext(AgoraContext);
  const [joinGathering, { loading }] = useMutation(JOIN_GATHERING);
  const [updateGathering] = useMutation(UPDATE_GATHERING);
  const [playNotification] = useSound('/notification.mp3', { volume: 0.25 });

  let isActive = false;
  let isModerator = false;

  const towners = participants.map((p) => {
    const isUser = townerId === p.towner.id;
    if (isUser) {
      isActive = true;
      if (p.is_moderator) {
        isModerator = true;
      }
    }

    return (
      <TownerBox key={p.towner.id} towner={p.towner} showMute isUser={isUser} />
    );
  });
  const content =
    towners.length === 4 ? (
      <div style={{ width: 160, display: 'flex', flexWrap: 'wrap' }}>
        {towners}
      </div>
    ) : (
      towners
    );

  React.useEffect(() => {
    if (connectionState === 'CONNECTED') {
      playNotification();
    }
  }, [playNotification, connectionState]);

  const handleClick = React.useCallback(() => {
    joinGathering({ variables: { gatheringId: id, leave: isActive } });
  }, [joinGathering, isActive, id]);

  const handleEdit = React.useCallback(
    (description: string) => {
      updateGathering({ variables: { gatheringId: id, description } });
    },
    [updateGathering, id]
  );

  const menu = (
    <Button onClick={handleClick} loading={loading}>
      {isActive ? 'Leave' : 'Join'}
    </Button>
  );

  const overlay = (
    <LockToggle gatheringId={id} locked={isInviteOnly} enabled={isModerator} />
  );

  return (
    <PureGatheringBox
      id={id}
      menu={menu}
      overlay={overlay}
      connectionState={connectionState}
      isActive={isActive}
      isLocked={isInviteOnly && !isActive}
      description={description}
      loading={loading}
      onEdit={isModerator ? handleEdit : null}
    >
      {content}
    </PureGatheringBox>
  );
};

GatheringBox.fragments = {
  gathering: gql`
    fragment GatheringBoxGathering on gathering {
      id
      description
      is_invite_only
      is_resident_only
      participants(order_by: { towner: { name: asc } }) {
        id
        is_moderator
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
