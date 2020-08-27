import { Router, Request } from 'express';

import { joinGathering } from './entityUtils';
import { getHasuraIdandRole } from './hasuraUtils';
import connectionPromise from '../../createConnection';

const router = Router();

type JoinGatheringRequest = Request<
  {},
  {},
  {
    input: {
      gatheringId: number;
      leave: boolean;
    };
  }
>;

router.post('/joinGathering', async (req: JoinGatheringRequest, res) => {
  const { body } = req;
  const { gatheringId, leave } = body.input;
  const { id } = getHasuraIdandRole(req);
  const connection = await connectionPromise;

  console.log('/joinGathering', gatheringId, id, leave);

  if (!id) {
    res.status(500).json({ success: false });
    return;
  }

  connection.transaction(async (manager) => {
    const success = await joinGathering(manager, gatheringId, id, leave);
    if (!success) {
      res.status(500);
    }
    res.json({ success });
  });
});

export default router;
