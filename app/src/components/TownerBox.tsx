import React from 'react';
import { createUseStyles } from 'react-jss';
import { gql, useMutation } from '@apollo/client';
import classNames from 'classnames';

import { getInitials } from 'utils';

const JOIN_TOWNER = gql`
  mutation JoinTowner($townerId: Int!) {
    joinTowner(townerId: $townerId) {
      success
      gatheringId
    }
  }
`;

type Props = {
  towner: { name: string; id: number; is_online: boolean };
  clickable: boolean;
  isUser: boolean;
};

const TownerBox = (props: Props) => {
  const classes = useStyles();
  const { towner, clickable, isUser } = props;
  const { name, is_online: isOnline } = towner;
  const [joinTowner, { loading }] = useMutation(JOIN_TOWNER);

  const active = clickable && isOnline && !isUser;

  const initials = getInitials(name);

  const handleClick = React.useCallback(() => {
    joinTowner({ variables: { townerId: towner.id } });
  }, [towner, joinTowner]);

  return (
    <div
      className={classNames(classes.TownerBox, {
        [classes.TownerBox_clickable]: active,
        [classes.TownerBox_user]: isUser,
      })}
      role={active ? 'button' : undefined}
      onClick={active ? handleClick : undefined}
    >
      <div
        className={classNames(classes.TownerBox_indicator, {
          [classes.TownerBox_indicator_online]: isOnline,
        })}
      ></div>
      <div className={classes.TownerBox_avatar}>{initials}</div>
      <div className={classes.TownerBox_label}>{name}</div>
    </div>
  );
};

TownerBox.defaultProps = {
  clickable: false,
  isUser: false,
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
    '& $TownerBox_label': {
      fontWeight: 'bold',
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
    textAlign: 'center',
  },
  TownerBox_indicator: {
    background: '#0f0',
    borderRadius: 8,
    height: 16,
    opacity: 0,
    pointerEvent: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
    transition: '200ms',
    width: 16,
  },
  TownerBox_indicator_online: {
    opacity: 1,
  },
});

TownerBox.fragments = {
  towner: gql`
    fragment TownerBoxTowner on towner {
      id
      name
      is_online
      is_visitor
    }
  `,
};

export default TownerBox;
