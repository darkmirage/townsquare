import { Router, Request } from 'express';

import { createGathering, setGathering, getTownerForUser } from './entityUtils';
import { getHasuraIdandRole } from './hasuraUtils';
import connectionPromise from '../../createConnection';
import Towner from '../../entities/Towner';

const router = Router();

type JoinTownerRequest = Request<
  {},
  {},
  {
    input: {
      townerId: number;
    };
  }
>;

router.post('/joinTowner', async (req: JoinTownerRequest, res) => {
  const { body } = req;
  const { townerId } = body.input;
  const { id } = getHasuraIdandRole(req);
  const connection = await connectionPromise;

  console.log('/joinTowner', townerId, id);

  if (!id) {
    res.status(500).json({ success: false });
    return;
  }

  connection.transaction(async (manager) => {
    const t2 = await manager
      .getRepository(Towner)
      .createQueryBuilder('towner')
      .leftJoinAndSelect('towner.square', 'square')
      .leftJoinAndSelect('towner.participant', 'participant')
      .leftJoinAndSelect('participant.gathering', 'gathering')
      .where('towner.id = :townerId', { townerId })
      .getOne();

    if (!t2 || !t2.isOnline) {
      res.status(500).json({ success: false });
      return;
    }
    const squareId = t2.square.id;

    const t1 = await getTownerForUser(manager, squareId, id);

    if (!t1) {
      res.status(500).json({ success: false });
      return;
    }

    let { gathering } = t2.participant;
    let created = !gathering;
    if (!gathering) {
      gathering = await createGathering(
        manager,
        t2.square,
        `${t1.name.split(' ')[0]}'s gathering`
      );
      t2.participant.gathering = gathering;
      await manager.save(t2.participant);
    }

    await setGathering(manager, t1.participant, gathering, created);

    res.json({ success: true, gatheringId: gathering.id });
  });
});

export default router;
