const Sequelize = require("sequelize");
const connection = new Sequelize("blogdoigor", "root", "root",{
    host: "localhost",
    dialect: "mysql"
});

module.exports = connection;