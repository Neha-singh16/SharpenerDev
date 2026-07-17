const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('expensetracker', 'root', '160308', {
  host: 'localhost',
  dialect: 'mysql'
});


console.log("Database:", sequelize.config.database);
(async () => {
  try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
})();

module.exports = sequelize;