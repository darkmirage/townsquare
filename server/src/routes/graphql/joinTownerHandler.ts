import { Router, Request } from 'express';

import { getHasuraIdandRole } from './hasuraUtils';
import connectionPromise from '../../createConnection';
import Gathering from '../../entities/Gathering';
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

    const t1 = await manager
      .getRepository(Towner)
      .createQueryBuilder('towner')
      .leftJoinAndSelect('towner.square', 'square')
      .leftJoinAndSelect('towner.participant', 'participant')
      .leftJoinAndSelect('participant.gathering', 'gathering')
      .where('towner.user_id = :userId', { userId: id })
      .andWhere('square.id = :squareId', { squareId })
      .getOne();

    if (!t1) {
      res.status(500).json({ success: false });
      return;
    }

    if (t1.id === t2.id) {
      res.status(500).json({ success: false });
      return;
    }

    let { gathering } = t2.participant;
    if (!gathering) {
      gathering = manager.create(Gathering, {
        square: t2.square,
        isInviteOnly: false,
        isResidentOnly: false,
        description: '',
      });
      await manager.save(gathering);
      t2.participant.gathering = gathering;
      await manager.save(t2.participant);
    }

    t1.participant.gathering = gathering;
    await manager.save(t1.participant);

    res.json({ success: true, gatheringId: gathering.id });
  });
});

export default router;
