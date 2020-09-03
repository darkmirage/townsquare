import React from 'react';
import { gql, useMutation } from '@apollo/client';
import useSound from 'use-sound';

import { AgoraContext } from './AgoraProvider';
import ActiveCanvas from './ActiveCanvas';
import GatheringToolbar from './GatheringToolbar';
import JoinGatheringButton from './JoinGatheringButton';
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
  isModerator?: boolean;
  isActive?: boolean;
};

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

const GatheringBox = ({
  isModerator = false,
  isActive = false,
  gathering,
}: Props) => {
  const {
    description,
    participants,
    id,
    is_invite_only: isInviteOnly,
  } = gathering;
  const { connectionState } = React.useContext(AgoraContext);
  const [updateGathering] = useMutation(UPDATE_GATHERING);
  const [playNotification] = useSound('/notification.mp3', { volume: 0.25 });

  const towners = participants.map((p) => (
    <TownerBox key={p.towner.id} towner={p.towner} showMute />
  ));
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

  const handleEdit = React.useCallback(
    (description: string) => {
      updateGathering({ variables: { gatheringId: id, description } });
    },
    [updateGathering, id]
  );

  const menu = isActive ? null : (
    <JoinGatheringButton gatheringId={id} leave={isActive} />
  );

  const overlay = (
    <LockToggle gatheringId={id} locked={isInviteOnly} enabled={isModerator} />
  );

  return (
    <PureGatheringBox
      menu={menu}
      overlay={overlay}
      connectionState={connectionState}
      isActive={isActive}
      isLocked={isInviteOnly && !isActive}
      description={description}
      onEdit={isModerator ? handleEdit : null}
      canvas={
        isActive ? (
          <ActiveCanvas
            names={participants.map((p) => ({
              name: p.towner.name,
              userId: p.towner.user_id,
            }))}
          />
        ) : null
      }
      footer={isActive ? <GatheringToolbar gatheringId={id} /> : null}
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
          name
          ...TownerBoxTowner
        }
      }
    }

    ${TownerBox.fragments.towner}
  `,
};

export default GatheringBox;
