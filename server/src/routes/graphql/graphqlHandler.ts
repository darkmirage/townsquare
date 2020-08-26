import { Router } from 'express';

import getOrCreateUserHandler from './getOrCreateUserHandler';

const router = Router();

router.use('/', getOrCreateUserHandler);

export default router;
