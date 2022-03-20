const { Sequelize } = require("sequelize");

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const dialect = "mysql";

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host,
  dialect,
});

module.exports = {
  sequelize,
};
