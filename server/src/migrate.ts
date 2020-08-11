import sequelize from './sequelize';

sequelize.sync({ alter: true }).then(() => {
  console.log('All models were synchrnoized successfully');
});
