import * as admin from 'firebase-admin';

import server from './server';
import './presenceDetector';

const PORT = process.env.PORT || 3000;
const serviceAccount = require('../firebase-service-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://townsquare-chat.firebaseio.com',
});

server.listen(PORT, () => {
  console.log(`[server]: ⚡️ Server is running at http://localhost:${PORT}`);
});
