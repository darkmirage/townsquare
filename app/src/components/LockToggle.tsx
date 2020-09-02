import React from 'react';
import { createUseStyles } from 'react-jss';
import { ImLock, ImUnlocked } from 'react-icons/im';
import { gql, useMutation } from '@apollo/client';
import classNames from 'classnames';

type Props = {
  gatheringId: number;
  locked: boolean;
  enabled: boolean;
};

const SET_INVITE_ONLY = gql`
  mutation SetInviteOnly($gatheringId: Int!, $inviteOnly: Boolean!) {
    update_gathering_by_pk(
      pk_columns: { id: $gatheringId }
      _set: { is_invite_only: $inviteOnly }
    ) {
      id
      is_invite_only
    }
  }
`;

const LockToggle = (props: Props) => {
  const classes = useStyles();
  const { gatheringId, locked, enabled } = props;
  const [setInviteOnly, { loading }] = useMutation(SET_INVITE_ONLY);

  const icon = locked ? <ImLock size={20} /> : <ImUnlocked size={20} />;
  const handleClick = React.useCallback(() => {
    setInviteOnly({ variables: { gatheringId, inviteOnly: !locked } });
  }, [setInviteOnly, gatheringId, locked]);

  return (
    <div
      role="button"
      className={classNames(classes.LockToggle, {
        [classes.LockToggle_enabled]: enabled,
        [classes.LockToggle_loading]: loading,
      })}
      onClick={handleClick}
    >
      {icon}
      <span className={classes.LockToggle_label}>
        {locked ? 'Private' : 'Public'}
      </span>
    </div>
  );
};

const useStyles = createUseStyles({
  LockToggle: {
    color: '#999',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      '& $LockToggle_label': {
        opacity: 1.0,
        visibility: 'visible',
      },
    },
  },
  LockToggle_loading: {
    opacity: 0.5,
  },
  LockToggle_enabled: {
    cursor: 'pointer',
    transition: 'opacity 200ms',
    '&:hover': {
      filter: 'brightness(90%)',
    },
  },
  LockToggle_label: {
    background: '#333',
    borderRadius: 4,
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
    opacity: 0,
    padding: 4,
    pointerEvents: 'none',
    visibility: 'hidden',
  },
});

export default LockToggle;
