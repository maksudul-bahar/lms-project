const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const CourseMaterial = sequelize.define("CourseMaterial", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: { 
        type: DataTypes.ENUM("text", "video", "audio", "mcq"),
        allowNull: false 
    },
    content: { type: DataTypes.TEXT, allowNull: false }, 
    // for MCQ, store JSON string
});


module.exports = CourseMaterial;
