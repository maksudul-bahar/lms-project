// lms-api/models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("learner", "instructor","admin"), allowNull: false, defaultValue: "learner" },

  // bank info stored in LMS user table (bank will have its own table in bank-api)
  bankAccountNumber: { type: DataTypes.STRING, allowNull: true },
  bankSecretHash: { type: DataTypes.STRING, allowNull: true }, // hashed secret (for local verification if needed)
  isApproved: {
  type: DataTypes.BOOLEAN,
  defaultValue: false
}

});

module.exports = User;
