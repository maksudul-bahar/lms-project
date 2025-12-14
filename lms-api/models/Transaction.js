const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Course = require("./Course");

const Transaction = sequelize.define("Transaction", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  amount: { type: DataTypes.FLOAT, allowNull: false },

  status: {
    type: DataTypes.STRING,
    defaultValue: "pending"
}

});

// associations
Transaction.belongsTo(User, { foreignKey: "instructorId" });
Transaction.belongsTo(Course, { foreignKey: "courseId" });

module.exports = Transaction;
