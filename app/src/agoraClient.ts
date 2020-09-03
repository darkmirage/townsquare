import AgoraRTC, {
  IMicrophoneAudioTrack,
  ILocalVideoTrack,
} from 'agora-rtc-sdk-ng';

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
let localScreenTrack: ILocalVideoTrack | null = null;

let volume = 100;

client.on('connection-state-change', async () => {
  if (client.connectionState === 'CONNECTED') {
    localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    localAudioTrack.setVolume(volume);
    await client.publish([localAudioTrack]);
  } else if (client.connectionState === 'DISCONNECTED') {
    if (localAudioTrack) {
      localAudioTrack.close();
      localAudioTrack = null;
    }
    if (localScreenTrack) {
      localScreenTrack.close();
      localScreenTrack = null;
    }
  }
});

export function setVolume(v: number) {
  volume = v;
  if (localAudioTrack) {
    localAudioTrack.setVolume(volume);
  }
}

export function getVolume(): number {
  return volume;
}

export async function publishScreen() {
  localScreenTrack = await AgoraRTC.createScreenVideoTrack(
    {
      optimizationMode: 'detail',
    },
    'disable'
  );
  await client.publish([localScreenTrack]);
}

export async function unpublishScreen() {
  if (localScreenTrack) {
    await client.unpublish([localScreenTrack]);
    localScreenTrack.close();
    localScreenTrack = null;
  }
}

export function getScreenTrack(): ILocalVideoTrack | null {
  return localScreenTrack;
}

export function userIdToUid(userId: number): string {
  return `user-${userId}`;
}

export function uidToUserId(uid: string): number {
  return parseInt(uid.replace('user-', ''), 10);
}

export default client;
