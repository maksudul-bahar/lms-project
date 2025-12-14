const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CourseModeration = sequelize.define("CourseModeration", {
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  action: {
    type: DataTypes.ENUM("approved", "rejected"),
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = CourseModeration;
