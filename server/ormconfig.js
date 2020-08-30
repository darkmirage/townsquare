require('dotenv').config();
const SnakeNamingStrategy = require('typeorm-naming-strategies')
  .SnakeNamingStrategy;

const url = process.env.HASURA_GRAPHQL_DATABASE_URL;

module.exports = {
  type: 'postgres',
  url,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: true,
  entities: ['src/entities/*.ts'],
};
