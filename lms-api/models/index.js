const User = require("./User");
const Course = require("./Course");
const CourseMaterial = require("./CourseMaterial");
const Purchase = require("./Purchase");
const Transaction = require("./Transaction");

const InstructorPayout = require("./InstructorPayout");

require("./InstructorTransaction");
require("./Certificate");



// ========== ASSOCIATIONS ==========

// User -> Course (Instructor)
User.hasMany(Course, { foreignKey: "instructorId" });
Course.belongsTo(User, { foreignKey: "instructorId" });

// Course -> Materials
Course.hasMany(CourseMaterial, { foreignKey: "courseId" });
CourseMaterial.belongsTo(Course, { foreignKey: "courseId" });

// User -> Purchases
User.hasMany(Purchase, { foreignKey: "userId" });
Purchase.belongsTo(User, { foreignKey: "userId" });

// Course -> Purchases
Course.hasMany(Purchase, { foreignKey: "courseId" });
Purchase.belongsTo(Course, { foreignKey: "courseId" });


User.hasMany(Transaction, { foreignKey: "instructorId" });
Transaction.belongsTo(User, { foreignKey: "instructorId" });

Course.hasMany(Transaction, { foreignKey: "courseId" });
Transaction.belongsTo(Course, { foreignKey: "courseId" });



// VERY IMPORTANT
InstructorPayout.belongsTo(User, {
  foreignKey: "instructorId"
});

User.hasMany(InstructorPayout, {
  foreignKey: "instructorId"
});



module.exports = {
  User,
  Course,
  CourseMaterial,
  Transaction,
  Purchase
};
