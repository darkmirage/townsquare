import { Router } from 'express';

import agoraHandler from './agoraHandler';
import getOrCreateTownerHandler from './getOrCreateTownerHandler';
import getOrCreateUserHandler from './getOrCreateUserHandler';
import joinGatheringHandler from './joinGatheringHandler';
import joinTownerHandler from './joinTownerHandler';

const router = Router();

router.use('/', agoraHandler);
router.use('/', getOrCreateTownerHandler);
router.use('/', getOrCreateUserHandler);
router.use('/', joinGatheringHandler);
router.use('/', joinTownerHandler);

export default router;
