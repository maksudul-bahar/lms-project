const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Certificate = sequelize.define("Certificate", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  certificateCode: {
    type: DataTypes.STRING,
    unique: true
  }
});

module.exports = Certificate;
