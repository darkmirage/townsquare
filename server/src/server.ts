import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as dotenv from 'dotenv';

import routes from './routes';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use('/', routes);

export default server;
