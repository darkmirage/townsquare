import { Router } from 'express';

import getOrCreateUserHandler from './getOrCreateUserHandler';
import joinTownerHandler from './joinTownerHandler';

const router = Router();

router.use('/', getOrCreateUserHandler);
router.use('/', joinTownerHandler);

export default router;
