import { Sequelize, DataTypes } from 'sequelize';

const DB_USER = 'postgres';
const DB_PASSWORD = 'thisisfine1';
const DB_URL = 'raven-ubuntu';
const DB_PORT = 5432;
const DB_NAME = 'townsquare';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_URL,
  port: DB_PORT,
  dialect: 'postgres',
  define: {
    freezeTableName: true,
    underscored: true,
  },
});

export const User = sequelize.define('user', {
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  firebaseId: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
});

export const Square = sequelize.define('square', {
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  domain: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
});

export const Gathering = sequelize.define('gathering', {
  squareId: {
    type: DataTypes.INTEGER,
    references: {
      model: Square,
      key: 'id',
    },
  },
  description: {
    type: DataTypes.TEXT,
  },
  isResidentOnly: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isInviteOnly: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

export const Towner = sequelize.define('towner', {
  squareId: {
    type: DataTypes.INTEGER,
    references: {
      model: Square,
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  isVisitor: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isOnline: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  lastOnline: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

export const Participant = sequelize.define('participant', {
  gatheringId: {
    type: DataTypes.INTEGER,
    references: {
      model: Gathering,
      key: 'id',
    },
  },
  townerId: {
    type: DataTypes.INTEGER,
    references: {
      model: Towner,
      key: 'id',
    },
  },
  isModerator: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isSpeaking: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

export default sequelize;
