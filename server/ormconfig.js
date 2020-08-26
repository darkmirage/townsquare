const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy;

const DB_USER = 'postgres';
const DB_PASSWORD = 'thisisfine1';
const DB_URL = 'raven-ubuntu';
const DB_PORT = 5432;
const DB_NAME = 'townsquare';

module.exports = {
  type: 'postgres',
  host: DB_URL,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: true,
  entities: ['src/entities/*.ts'],
}