import * as admin from 'firebase-admin';
import { Router, Request } from 'express';

import connectionPromise from '../../createConnection';
import User from '../../entities/User';
import { getHasuraClaims } from './hasuraUtils';

type GetOrCreateUserRequest = Request<
  {},
  {},
  {
    input: {
      firebaseIdToken: string;
    };
  }
>;

const router = Router();

router.post('/getOrCreateUser', async (req: GetOrCreateUserRequest, res) => {
  const { body } = req;
  const { firebaseIdToken } = body.input;

  const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
  const firebaseId = decodedToken.uid;

  const connection = await connectionPromise;
  const { manager } = connection;

  let user = await manager.findOne(User, { firebaseId });
  if (!user) {
    user = manager.create(User, {
      firebaseId,
      email: decodedToken.email,
    });

    try {
      await manager.save(user);
    } catch (error) {
      res.status(500).json({ error: 'Unable to create user' });
      return;
    }
  }

  const claims = getHasuraClaims(user.id);
  await admin.auth().setCustomUserClaims(firebaseId, claims);

  console.log('getOrCreateUser', user);

  res.json({ success: true, userId: user.id });
});

export default router;
