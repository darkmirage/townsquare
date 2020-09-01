import React from 'react';

import agoraClient, { joinChannel } from '../agoraClient';

type Props = {
  token: string;
  channel: string;
  uid: string;
};

const AgoraChannel = (props: Props) => {
  const { token, channel, uid } = props;

  React.useEffect(() => {
    (async () => {
      await joinChannel(channel, token, uid);
    })();
    return () => {
      agoraClient.unpublish().then(() => agoraClient.leave());
    };
  }, [channel, token, uid]);

  return null;
};

export default AgoraChannel;
