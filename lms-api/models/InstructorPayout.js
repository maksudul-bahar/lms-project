const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const InstructorPayout = sequelize.define("InstructorPayout", {
  instructorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("requested", "approved", "rejected"),
    defaultValue: "requested"
  }
});

module.exports = InstructorPayout;
