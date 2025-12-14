const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const InstructorTransaction = sequelize.define("InstructorTransaction", {
  instructor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("pending", "completed"),
    defaultValue: "pending"
  }
});

module.exports = InstructorTransaction;
