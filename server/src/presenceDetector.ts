import * as WebSocket from 'ws';

import server from './server';
import Towner from './entities/Towner';
import connectionPromise from './createConnection';

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  let townerId: number | null = null;
  ws.on('message', async (message) => {
    townerId = parseInt(message.toString(), 10);
    const connection = await connectionPromise;
    connection.transaction(async (manager) => {
      if (!townerId) {
        return;
      }
      const towner = await manager.getRepository(Towner).findOne(townerId);
      if (towner) {
        towner.isOnline = true;
        await manager.save(towner);
      }
    });
  });

  ws.on('close', async () => {
    const connection = await connectionPromise;
    connection.transaction(async (manager) => {
      if (!townerId) {
        return;
      }
      const towner = await manager.getRepository(Towner).findOne(townerId);
      if (towner) {
        towner.isOnline = false;
        await manager.save(towner);
      }
    });
  });
});
