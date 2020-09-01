import AgoraRTC, { IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

import { AGORA_APP_ID } from 'config';

AgoraRTC.setLogLevel(4);
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

let localAudioTrack: IMicrophoneAudioTrack | null = null;

client.on('connection-state-change', async () => {
  if (client.connectionState === 'CONNECTED') {
    localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await client.publish([localAudioTrack]);
  } else if (client.connectionState === 'DISCONNECTED') {
    if (localAudioTrack) {
      localAudioTrack.close();
      localAudioTrack = null;
    }
  }
});

export default client;
