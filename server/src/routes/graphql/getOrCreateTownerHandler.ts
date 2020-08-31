import * as admin from 'firebase-admin';
import { Router, Request } from 'express';

import connectionPromise from '../../createConnection';
import Participant from '../../entities/Participant';
import Square from '../../entities/Square';
import Towner from '../../entities/Towner';
import User from '../../entities/User';
import { getHasuraIdandRole } from './hasuraUtils';

type GetOrCreateTownerRequest = Request<
  {},
  {},
  {
    input: {
      domain: string;
    };
  }
>;

const router = Router();

router.post(
  '/getOrCreateTowner',
  async (req: GetOrCreateTownerRequest, res) => {
    const { body } = req;
    const { domain } = body.input;
    const { id } = getHasuraIdandRole(req);

    if (!id) {
      res.status(500).json({ success: false });
      return;
    }

    const connection = await connectionPromise;

    connection.transaction(async (manager) => {
      const square = await manager.getRepository(Square).findOne({ domain });
      if (!square) {
        res.status(500).json({ success: false });
        return;
      }

      const user = await manager.getRepository(User).findOne(id);
      if (!user) {
        res.status(500).json({ success: false });
        return;
      }

      const doc = await admin.firestore().collection('settings').doc('whitelist').get();
      const { whitelist } = doc.data() as { whitelist: string[] };

      // Validate user permission to access square
      const emailDomain = user.email.split('@')[1];

      if (!emailDomain.includes(domain) && !whitelist.includes(user.email)) {
        res.json({ success: false });
        return;
      }

      const firebaseUser = await admin.auth().getUser(user.firebaseId);

      let created = false;
      let towner = await manager.getRepository(Towner).findOne({
        square,
        user,
      });

      if (!towner) {
        towner = manager.create(Towner, {
          name: firebaseUser.displayName,
          statusText: '',
          isVisitor: false,
          square,
          user,
        });

        try {
          await manager.save(towner);

          const participant = manager.create(Participant, {
            towner,
            isModerator: false,
            isSpeaking: false,
          });
          await manager.save(participant);

          created = true;
        } catch (error) {
          console.error('/getOrCreateTowner');
          res.status(500).json({ error: 'Unable to create towner' });
          return;
        }
      }

      console.log('/getOrCreateTowner', towner.id, created);

      res.json({ success: true, townerId: towner.id });
    });
  }
);

export default router;
