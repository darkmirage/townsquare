import { Router } from 'express';

import graphqlHandler from './graphql/graphqlHandler';

const router = Router();

router.get('/', async (req, res) => {
  res.send('TownSquare Server');
});

router.use('/graphql', graphqlHandler);

export default router;
