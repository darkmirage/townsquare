import * as express from 'express';

import sequelize, { User } from './sequelize';

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
  await sequelize.authenticate();
  const users = User.findAll();
  console.log(users);
  res.send('TownSquare hello Server');
});

app.listen(PORT, () => {
  console.log(`[server]: ⚡️ Server is running at http://localhost:${PORT}`);
});
