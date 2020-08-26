import * as express from 'express';

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
  res.send('TownSquare hello Server');
});

app.listen(PORT, () => {
  console.log(`[server]: ⚡️ Server is running at http://localhost:${PORT}`);
});
