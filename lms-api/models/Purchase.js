const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
// const User = require("./User");


const Purchase = sequelize.define("Purchase", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    status: { type: DataTypes.ENUM("pending", "success", "failed"), defaultValue: "pending" }
});



module.exports = Purchase;
