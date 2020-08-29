import React from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

type Props = {
  token: string;
  channel: string;
  uid: string;
};

const AGORA_APP_ID = 'b4b2d6ff48ca4022a3259a1f99cac9c5';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

async function join(channel: string, token: string, uid: string) {
  await client.leave();
  await new Promise((resolve) => {
    const check = () => {
      if (client.connectionState === 'DISCONNECTED') {
        resolve();
        return;
      }
      setTimeout(check, 100);
    };
    check();
  });
  await client.join(AGORA_APP_ID, channel, token, uid);
}

const AgoraChannel = (props: Props) => {
  const { token, channel, uid } = props;

  React.useEffect(() => {
    (async () => {
      await join(channel, token, uid);
    })();
    return () => {
      client.leave();
    };
  }, [channel, token, uid]);

  return null;
};

export default AgoraChannel;
