import React from 'react';
import { createUseStyles } from 'react-jss';
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import useSound from 'use-sound';

import { debounce } from 'utils';
import agoraClient from '../agoraClient';

type Props = {
  uid: string;
};

interface IAudioTrack {
  _source: {
    analyserNode: AnalyserNode;
    context: AudioContext;
    outputNode: GainNode;
    playNode: AudioDestinationNode;
  };
}

const AgoraSpeaker = ({ uid }: Props) => {
  const [audioTrack, setAudioTrack] = React.useState<IAudioTrack | null>(null);
  const [level, setLevel] = React.useState(0);
  const classes = useStyles();
  const [playEnter] = useSound('/enter.mp3', { volume: 0.25 });
  const [playExit] = useSound('/exit.mp3', { volume: 0.25 });
  const playEnterDebounced = React.useCallback(debounce(playEnter, 500), [
    playEnter,
  ]);
  const playExitDebounced = React.useCallback(debounce(playExit, 500), [
    playExit,
  ]);

  const handlePublished = React.useCallback(
    async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      if (user.uid === uid) {
        await agoraClient.subscribe(user, mediaType);
        const { audioTrack } = user;
        if (audioTrack) {
          playEnterDebounced();
          audioTrack.play();
          setAudioTrack(audioTrack as any);
        }
      }
    },
    [uid, playEnterDebounced]
  );

  const handleLeave = React.useCallback(
    async (user: IAgoraRTCRemoteUser) => {
      if (user.uid === uid) {
        playExitDebounced();
      }
    },
    [uid, playExitDebounced]
  );

  React.useEffect(() => {
    let active = true;
    if (audioTrack) {
      audioTrack._source.analyserNode.fftSize = 32;
      const len = audioTrack._source.analyserNode.frequencyBinCount;
      const arr = new Uint8Array(len);
      const check = () => {
        audioTrack._source.analyserNode.getByteFrequencyData(arr);

        // Kind of an arbitrary choice of bucket. Should try to get it in the human voice range
        const level = Math.min(1, arr[5] / 100);
        if (active) {
          setLevel(level);
          setTimeout(check, 100);
        }
      };
      check();
    }
    return () => {
      active = false;
    };
  }, [audioTrack]);

  React.useEffect(() => {
    agoraClient.on('user-published', handlePublished);
    agoraClient.on('user-left', handleLeave);
    return () => {
      agoraClient.off('user-published', handlePublished);
      agoraClient.off('user-left', handleLeave);
    };
  }, [handlePublished, handleLeave]);

  return (
    <div
      className={classes.AgoraSpeaker}
      style={{
        transform: `scale(${Math.min(1.25, 1 + level)})`,
        opacity: level,
      }}
    ></div>
  );
};

const useStyles = createUseStyles({
  AgoraSpeaker: {
    transition: '100ms',
    background: 'rgb(0, 176, 255)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    width: 64,
    borderRadius: 32,
    zIndex: -1,
  },
});

export default AgoraSpeaker;
