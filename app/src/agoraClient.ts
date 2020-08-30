import AgoraRTC from 'agora-rtc-sdk-ng';

const AGORA_APP_ID = 'b4b2d6ff48ca4022a3259a1f99cac9c5';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

export async function joinChannel(channel: string, token: string, uid: string) {
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

export default client;
