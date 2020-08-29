import React from 'react';
import { createUseStyles } from 'react-jss';
import { gql, useMutation } from '@apollo/client';
import classNames from 'classnames';
import { motion } from 'framer-motion';

import { getInitials } from 'utils';
import Spinner from './Spinner';

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

  const active = clickable && isOnline && !isUser && !loading;

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
      <div className={classes.TownerBox_label}>{name}</div>
      <div className={classes.TownerBox_overlay}>
        <Spinner
          className={classNames(classes.TownerBox_spinner, {
            [classes.TownerBox_visible]: loading,
          })}
        />
      </div>
      <div
        className={classNames(classes.TownerBox_indicator, {
          [classes.TownerBox_visible]: isOnline,
        })}
      ></div>
    </motion.div>
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
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
    transition: '200ms',
    width: 16,
  },
  TownerBox_visible: {
    opacity: 1,
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
  TownerBox_spinner: {
    opacity: 0,
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
