import React from 'react';
import classNames from 'classnames';
import { createUseStyles } from 'react-jss';
import { gql, useMutation } from '@apollo/client';
import { ImVolumeMedium, ImVolumeMute2 } from 'react-icons/im';

import Button from './Button';
import { setVolume } from 'agoraClient';
import { RGB_BLUE } from 'colors';

type Props = {
  participant: any;
};

const SET_MUTED = gql`
  mutation SetMuted($participantId: Int!, $isMuted: Boolean!) {
    update_participant_by_pk(
      pk_columns: { id: $participantId }
      _set: { is_muted: $isMuted }
    ) {
      id
      is_muted
    }
  }
`;

const MuteToggle = (props: Props) => {
  const classes = useStyles();
  const { is_muted: isMuted, id } = props.participant;
  const [setMuted, { loading }] = useMutation(SET_MUTED);

  const handleClick = React.useCallback(() => {
    setMuted({ variables: { isMuted: !isMuted, participantId: id } });
  }, [setMuted, isMuted, id]);

  React.useEffect(() => {
    if (isMuted) {
      setVolume(0);
    } else {
      setVolume(100);
    }
  }, [isMuted]);

  return (
    <div
      className={classNames(classes.MuteToggle, {
        [classes.MuteToggle_unmuted]: !isMuted,
      })}
    >
      <Button
        className={classes.MuteToggle_button}
        loading={loading}
        onClick={handleClick}
      >
        {isMuted ? 'Unmute' : 'Mute'}
      </Button>
      <div className={classes.MuteToggle_label}>
        {isMuted ? (
          <>
            <ImVolumeMute2 className={classes.MuteToggle_icon} />
            You are muted
          </>
        ) : (
          <>
            <ImVolumeMedium className={classes.MuteToggle_icon} />
            You are speaking
          </>
        )}
      </div>
    </div>
  );
};

MuteToggle.fragments = {
  participant: gql`
    fragment MuteToggleParticipant on participant {
      id
      is_muted
      is_speaking
    }
  `,
};

const useStyles = createUseStyles({
  MuteToggle: {
    alignItems: 'flex-start',
    display: 'flex',
  },
  MuteToggle_icon: {
    margin: 4,
  },
  MuteToggle_button: {
    width: 64,
  },
  MuteToggle_unmuted: {
    '& $MuteToggle_label': {
      color: `rgb(${RGB_BLUE})`,
    },
  },
  MuteToggle_label: {
    alignItems: 'center',
    color: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    fontWeight: 'bold',
    marginLeft: 8,
    transition: 'color 200ms',
  },
});

export default MuteToggle;
