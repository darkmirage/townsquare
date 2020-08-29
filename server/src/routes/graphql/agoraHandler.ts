import { Router, Request } from 'express';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

import { getHasuraIdandRole } from './hasuraUtils';
import connectionPromise from '../../createConnection';
import Gathering from '../../entities/Gathering';

const AGORA_APP_ID = process.env.AGORA_APP_ID;
const AGORA_CERTIFICATE = process.env.AGORA_CERTIFICATE;

if (!AGORA_APP_ID || !AGORA_CERTIFICATE) {
  throw new Error('Missing Agora secrets');
}

const router = Router();

type AgoraRequest = Request<{}, {}, {}>;

router.post('/agora', async (req: AgoraRequest, res) => {
  const { id } = getHasuraIdandRole(req);
  const connection = await connectionPromise;

  console.log('/agora', id);

  if (!id) {
    res.status(500).json({ success: false });
    return;
  }

  connection.transaction(async (manager) => {
    const gathering = await manager
      .getRepository(Gathering)
      .createQueryBuilder('gathering')
      .innerJoinAndSelect('gathering.participants', 'participant')
      .innerJoinAndSelect('participant.towner', 'towner')
      .where('towner.user_id = :userId', { userId: id })
      .getOne();

    if (!gathering) {
      res.json({ success: false });
      return;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expirationTimestamp = currentTimestamp + 36000;
    const agoraToken = RtcTokenBuilder.buildTokenWithAccount(
      AGORA_APP_ID,
      AGORA_CERTIFICATE,
      gathering.channel,
      `user-${id}`,
      RtcRole.PUBLISHER,
      expirationTimestamp
    );

    res.json({ success: true, token: agoraToken });
  });
});

export default router;
