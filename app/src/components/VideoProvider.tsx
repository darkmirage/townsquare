import React from 'react';
import { IRemoteVideoTrack, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';

import agoraClient, { uidToUserId } from '../agoraClient';
import { AgoraContext } from './AgoraProvider';

type VideoContextType = {
  userId: number;
  playing: boolean;
  videoTrack: IRemoteVideoTrack | null;
};

const defaultContext: VideoContextType = {
  userId: 0,
  playing: false,
  videoTrack: null,
};

export const VideoContext = React.createContext<VideoContextType>(
  defaultContext
);

const VideoProvider = (props: React.ComponentPropsWithoutRef<'div'>) => {
  const [context, setContext] = React.useState(defaultContext);
  const { connectionState } = React.useContext(AgoraContext);

  const handlePublished = React.useCallback(
    async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      if (mediaType === 'video') {
        await agoraClient.subscribe(user, mediaType);
        setContext({
          playing: true,
          videoTrack: user.videoTrack || null,
          userId: uidToUserId(user.uid as string),
        });
      }
    },
    [setContext]
  );

  const handleUnpublished = React.useCallback(
    async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      console.log(user, mediaType);
      if (mediaType === 'video') {
        setContext({ playing: false, userId: 0, videoTrack: null });
      }
    },
    [setContext]
  );

  React.useEffect(() => {
    if (connectionState === 'DISCONNECTED') {
      setContext({ playing: false, userId: 0, videoTrack: null });
    }
  }, [connectionState, setContext]);

  React.useEffect(() => {
    agoraClient.on('user-published', handlePublished);
    agoraClient.on('user-unpublished', handleUnpublished);
    return () => {
      agoraClient.off('user-published', handlePublished);
      agoraClient.off('user-unpublished', handleUnpublished);
    };
  }, [handlePublished, handleUnpublished]);

  return (
    <VideoContext.Provider value={context}>
      {props.children}
    </VideoContext.Provider>
  );
};

export default VideoProvider;
