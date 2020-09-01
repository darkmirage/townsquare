import React from 'react';
import { createUseStyles } from 'react-jss';
import { gql, useMutation } from '@apollo/client';
import classNames from 'classnames';
import { motion } from 'framer-motion';

import { getInitials } from 'utils';
import OnlineIndicator from './OnlineIndicator';
import Spinner from './Spinner';
import AgoraSpeaker from './AgoraSpeaker';

const JOIN_TOWNER = gql`
  mutation JoinTowner($townerId: Int!) {
    joinTowner(townerId: $townerId) {
      success
      gatheringId
    }
  }
`;

type Props = {
  towner: {
    name: string;
    id: number;
    is_online: boolean;
    is_away: boolean;
    user_id: number;
    participant: {
      is_moderator: boolean;
    };
  };
  clickable?: boolean;
  isUser?: boolean;
  showName?: boolean;
  showIndicator?: boolean;
};

const TownerBox = ({
  towner,
  clickable = false,
  isUser = false,
  showName = true,
  showIndicator = true,
}: Props) => {
  const classes = useStyles();
  const {
    name,
    is_online: isOnline,
    user_id: userId,
    is_away: isAway,
    participant,
  } = towner;
  const [joinTowner, { loading }] = useMutation(JOIN_TOWNER);

  const active = clickable && isOnline && !isUser && !loading && !isAway;

  const initials = getInitials(name);

  const handleClick = React.useCallback(() => {
    joinTowner({ variables: { townerId: towner.id } });
  }, [towner, joinTowner]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layoutId={`towner-${towner.id}`}
      className={classNames(classes.TownerBox, {
        [classes.TownerBox_clickable]: active,
        [classes.TownerBox_user]: isUser,
      })}
      role={active ? 'button' : undefined}
      onClick={active ? handleClick : undefined}
    >
      <div className={classes.TownerBox_avatar}>{initials}</div>
      <AgoraSpeaker uid={`user-${userId}`} />
      {showName ? (
        <div className={classes.TownerBox_label}>
          {participant.is_moderator ? (
            <span className={classes.TownerBox_moderator} role="presentation">
              <span role="img" aria-label="host">
                👑
              </span>{' '}
            </span>
          ) : null}
          {name}
        </div>
      ) : null}
      <div className={classes.TownerBox_overlay}>
        <Spinner
          className={classNames(classes.TownerBox_spinner, {
            [classes.TownerBox_visible]: loading,
          })}
        />
      </div>
      {showIndicator ? (
        <OnlineIndicator
          className={classes.TownerBox_indicator}
          isOnline={isOnline}
          isAway={isAway}
        />
      ) : null}
    </motion.div>
  );
};

const useStyles = createUseStyles({
  TownerBox: {
    margin: 8,
    position: 'relative',
    width: 64,
  },
  TownerBox_user: {
    '& $TownerBox_avatar': {
      backgroundColor: '#333',
    },
  },
  TownerBox_clickable: {
    cursor: 'pointer',
  },
  TownerBox_avatar: {
    alignItems: 'center',
    backgroundColor: '#777',
    borderRadius: 32,
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
    boxSizing: 'border-box',
    color: '#fff',
    display: 'flex',
    fontSize: 24,
    height: 64,
    justifyContent: 'center',
    userSelect: 'none',
    width: 64,
  },
  TownerBox_label: {
    fontSize: 14,
    marginTop: 4,
    overflow: 'hidden',
    textAlign: 'center',
    textOverflow: 'ellipsis',
  },
  TownerBox_indicator: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  TownerBox_spinner: {
    opacity: 0,
    transition: 'opacity 200ms',
  },
  TownerBox_visible: {
    opacity: 1,
  },
  TownerBox_moderator: {
    userSelect: 'none',
  },
  TownerBox_overlay: {
    alignItems: 'center',
    display: 'flex',
    height: 64,
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
    width: 64,
  },
});

TownerBox.fragments = {
  towner: gql`
    fragment TownerBoxTowner on towner {
      id
      name
      is_online
      is_away
      is_visitor
      user_id
      participant {
        is_moderator
        is_speaking
      }
    }
  `,
};

export default TownerBox;
