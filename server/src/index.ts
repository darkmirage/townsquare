import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as admin from 'firebase-admin';

import routes from './routes';

const serviceAccount = require('../firebase-service-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://townsquare-chat.firebaseio.com',
});

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`[server]: ⚡️ Server is running at http://localhost:${PORT}`);
});
