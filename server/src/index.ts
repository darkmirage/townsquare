import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as admin from 'firebase-admin';

import connectionPromise from './createConnection';
import User from './entities/User';

const serviceAccount = require('../firebase-service-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://townsquare-chat.firebaseio.com',
});

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get('/', async (req, res) => {
  res.send('TownSquare Server');
});

app.post('/graphql/getOrCreateUser', async (req, res) => {
  const { body } = req;
  const { firebaseIdToken } = body.input;

  const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
  const firebaseId = decodedToken.uid;

  const connection = await connectionPromise;
  const { manager } = connection;

  let user = await manager.findOne(User, { firebaseId });
  if (user) {
    res.json({ id: user.id });
    return;
  }

  user = manager.create(User, {
    firebaseId,
    email: decodedToken.email,
  });

  try {
    await manager.save(user);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create user' });
    return;
  }

  res.json({ id: user.id });
});

app.listen(PORT, () => {
  console.log(`[server]: ⚡️ Server is running at http://localhost:${PORT}`);
});
