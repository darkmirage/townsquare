import React from 'react';
import { createUseStyles } from 'react-jss';
import { gql, useSubscription, useMutation } from '@apollo/client';

import MuteToggle from './MuteToggle';
import OnlineIndicator from './OnlineIndicator';
import { TownerContext } from './TownerProvider';
import TownerBox from './TownerBox';

const GET_TOWNER = gql`
  subscription GetTowner($townerId: Int!) {
    towner_by_pk(id: $townerId) {
      id
      is_online
      is_away
      name
      ...TownerBoxTowner
      participant {
        id
        ...MuteToggleParticipant
        gathering {
          id
        }
      }
    }
  }

  ${TownerBox.fragments.towner}
  ${MuteToggle.fragments.participant}
`;

const SET_AWAY = gql`
  mutation SetAway($townerId: Int!, $isAway: Boolean!) {
    update_towner_by_pk(
      pk_columns: { id: $townerId }
      _set: { is_away: $isAway }
    ) {
      is_away
    }
  }
`;

const UserToolbar = () => {
  const classes = useStyles();
  const { townerId } = React.useContext(TownerContext);
  const { loading, data } = useSubscription(GET_TOWNER, {
    variables: { townerId },
  });
  const [setAway] = useMutation(SET_AWAY);

  const handleClick = React.useCallback(() => {
    if (!data) {
      return;
    }
    setAway({
      variables: {
        townerId,
        isAway: !data.towner_by_pk.is_away,
      },
    });
  }, [setAway, townerId, data]);

  let body = null;
  if (!loading) {
    const { towner_by_pk: towner } = data;
    const { participant } = towner;
    const inGathering = !!participant.gathering;
    body = inGathering ? (
      <MuteToggle participant={participant} />
    ) : (
      <>
        <TownerBox
          towner={towner}
          showIndicator={false}
          showName={false}
          isUser
        />
        <div className={classes.UserToolbar_controls}>
          <div className={classes.UserToolbar_name}>{towner.name}</div>
          <div className={classes.UserToolbar_status} onClick={handleClick}>
            <div>
              {towner.is_online
                ? towner.is_away
                  ? 'Away'
                  : 'Online'
                : 'Offline'}
            </div>
            <OnlineIndicator
              className={classes.UserToolbar_indicator}
              isOnline={towner.is_online}
              isAway={towner.is_away}
            />
          </div>
        </div>
        <div className={classes.UserToolbar_right}></div>
      </>
    );
  }

  return <div className={classes.UserToolbar}>{body}</div>;
};

const useStyles = createUseStyles({
  UserToolbar: {
    alignItems: 'center',
    display: 'flex',
    height: 140,
  },
  UserToolbar_name: {
    fontSize: 20,
    fontWeight: 600,
    padding: '4px 8px',
  },
  UserToolbar_controls: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 8,
  },
  UserToolbar_status: {
    alignItems: 'center',
    border: '2px solid rgba(0, 0, 0, 0)',
    borderRadius: 8,
    cursor: 'pointer',
    display: 'flex',
    height: 24,
    padding: '4px 8px',
    transition: 'border 200ms',
    '&:hover': {
      border: '2px solid rgba(0, 0, 0, 0.5)',
    },
  },
  UserToolbar_indicator: {
    marginLeft: 4,
  },
  UserToolbar_right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

export default UserToolbar;
