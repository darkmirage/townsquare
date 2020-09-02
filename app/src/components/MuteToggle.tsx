import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { ImVolumeMedium, ImVolumeMute2 } from 'react-icons/im';

import Button, { Props as ButtonProps } from './Button';
import { setVolume } from 'agoraClient';

type Props = {
  participant: any;
} & ButtonProps;

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

const MuteToggle = ({ participant, ...rest }: Props) => {
  const { is_muted: isMuted, id } = participant;
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
    <Button
      loading={loading}
      onClick={handleClick}
      tooltip={isMuted ? 'Unmute' : 'Mute'}
      round
      {...rest}
    >
      {isMuted ? <ImVolumeMedium /> : <ImVolumeMute2 />}
    </Button>
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

export default MuteToggle;
