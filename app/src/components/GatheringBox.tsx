import React from 'react';
import { createUseStyles } from 'react-jss';
import { gql, useMutation } from '@apollo/client';
import classNames from 'classnames';
import useSound from 'use-sound';
import { ConnectionState } from 'agora-rtc-sdk-ng';

import { AgoraContext } from './AgoraProvider';
import { TownerContext } from './TownerProvider';
import Button from './Button';
import LockToggle from './LockToggle';
import TownerBox from './TownerBox';

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

function getColor(connectionState: ConnectionState): string {
  let borderColor = '0, 0, 0';
  switch (connectionState) {
    case 'CONNECTED':
      borderColor = '0, 176, 255';
      break;
    case 'RECONNECTING':
    case 'CONNECTING':
      borderColor = '127, 127, 127';
      break;
    case 'DISCONNECTED':
    case 'DISCONNECTING':
      borderColor = '255, 81, 0';
      break;
    default:
      break;
  }
  return borderColor;
}

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
  const [playNotification] = useSound('/notification.mp3', { volume: 0.25 });
  const classes = useStyles({ connectionState });

  let isActive = false;
  let isModerator = false;
  const isLocked = !isActive && isInviteOnly;

  const towners = participants.map((p) => {
    const isUser = townerId === p.towner.id;
    if (isUser) {
      isActive = true;
      if (p.is_moderator) {
        isModerator = true;
      }
    }

    return <TownerBox key={p.towner.id} towner={p.towner} isUser={isUser} />;
  });

  React.useEffect(() => {
    if (connectionState === 'CONNECTED') {
      playNotification();
    }
  }, [playNotification, connectionState]);

  const handleClick = React.useCallback(() => {
    joinGathering({ variables: { gatheringId: id, leave: isActive } });
  }, [joinGathering, isActive, id]);

  const spinner = loading ? (
    <div className={classes.GatheringBox_loader}></div>
  ) : null;

  const connnectionState = isActive ? (
    <div className={classes.GatheringBox_status}>{connectionState}</div>
  ) : null;

  return (
    <div
      className={classNames(classes.GatheringBox, {
        [classes.GatheringBox_active]: isActive,
        [classes.GatheringBox_locked]: isLocked,
      })}
    >
      <div className={classes.GatheringBox_header}>
        <div className={classes.GatheringBox_label}>{description}</div>
      </div>
      <div className={classes.GatheringBox_lock}>
        <LockToggle
          gatheringId={id}
          locked={isInviteOnly}
          enabled={isModerator}
        />
      </div>
      {connnectionState}
      <div className={classes.GatheringBox_towners}>{towners}</div>

      <div className={classes.GatheringBox_menu}>
        <Button onClick={handleClick} loading={loading}>
          {isActive ? 'Leave' : 'Join'}
        </Button>
      </div>
      {spinner}
    </div>
  );
};

const useStyles = createUseStyles({
  GatheringBox: {
    background: '#fff',
    border: '4px solid rgba(229, 229, 229)',
    borderRadius: 12,
    marginBottom: 24,
    marginRight: 24,
    position: 'relative',
    transition: 'background 200ms, border 200ms',
    '&:hover': {
      background: '#eee',
      '& $GatheringBox_menu': {
        opacity: 1.0,
      },
      '& $GatheringBox_header': {
        visibility: 'visible',
        opacity: 1,
      },
      '& $GatheringBox_lock': {
        visibility: 'visible',
        opacity: 1,
      },
    },
  },
  GatheringBox_locked: {
    '& $GatheringBox_lock': {
      visibility: 'visible',
      opacity: 1,
    },
    '& $GatheringBox_menu': {
      display: 'none',
    },
  },
  GatheringBox_towners: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 240,
    minWidth: 160,
    padding: 12,
  },
  GatheringBox_active: ({ connectionState }) => ({
    border: `4px solid rgb(${getColor(connectionState)})`,
    '&:hover': {
      background: `rgba(${getColor(connectionState)}, 0.1)`,
    },
    '& $GatheringBox_header': {
      color: '#fff',
      background: `rgb(${getColor(connectionState)})`,
    },
    '& $GatheringBox_towners': {
      padding: 24,
      paddingBottom: 32,
    },
  }),
  GatheringBox_status: ({ connectionState }) => ({
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 12,
    background: `rgb(${getColor(connectionState)})`,
    color: '#fff',
    paddingLeft: 4,
    paddingTop: 4,
    paddingRight: 8,
    position: 'absolute',
    pointerEvents: 'none',
    left: 0,
    bottom: 0,
  }),
  GatheringBox_loader: {
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.1)',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  GatheringBox_header: {
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    background: 'rgba(229, 229, 229)',
    opacity: 0,
    padding: 8,
    position: 'absolute',
    top: 0,
    transform: 'translateY(calc(-100%))',
    transition: 'opacity 200ms, background 200ms, color 200ms',
    visibility: 'hidden',
    '&:hover': {
      opacity: 1,
      visibility: 'visible',
    },
  },
  GatheringBox_label: {
    fontSize: 16,
    fontWeight: 600,
    maxHeight: '2.5em',
    lineHeight: '1.25em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  GatheringBox_menu: {
    bottom: 0,
    opacity: 0,
    position: 'absolute',
    right: 0,
    transform: 'translate(-8px, 16px)',
    transition: '200ms',
  },
  GatheringBox_lock: {
    visibility: 'hidden',
    color: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    padding: 8,
    opacity: 0,
    transition: 'opacity 200ms',
    zIndex: 3,
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
