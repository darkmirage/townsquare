import { Router } from 'express';

import getOrCreateUserHandler from './getOrCreateUserHandler';
import joinGatheringHandler from './joinGatheringHandler';
import joinTownerHandler from './joinTownerHandler';

const router = Router();

router.use('/', getOrCreateUserHandler);
router.use('/', joinGatheringHandler);
router.use('/', joinTownerHandler);

export default router;
