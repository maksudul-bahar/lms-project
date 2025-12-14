const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BankAccount = sequelize.define("BankAccount", {
    accountNumber: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    secret: {
        type: DataTypes.STRING,
        allowNull: false
    },
    balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    }
});

module.exports = BankAccount;
