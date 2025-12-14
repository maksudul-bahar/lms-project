const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const Course = require("../models/Course");
const User = require("../models/User");
const InstructorTransaction = require("../models/InstructorTransaction");

// ===============================
// Admin-only middleware
// ===============================
function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
}

// ===============================
// Get pending instructors
// ===============================
router.get("/pending-instructors", auth, adminOnly, async (req, res) => {
  try {
    const instructors = await User.findAll({
      where: {
        role: "instructor",
        isApproved: false
      },
      attributes: ["id", "name", "email", "createdAt"]
    });

    res.json(instructors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// Approve instructor
// ===============================
router.post("/approve-instructor/:id", auth, adminOnly, async (req, res) => {
  try {
    const instructor = await User.findByPk(req.params.id);

    if (!instructor || instructor.role !== "instructor") {
      return res.status(404).json({ error: "Instructor not found" });
    }

    instructor.isApproved = true;
    await instructor.save();

    res.json({
      message: "Instructor approved successfully",
      instructorId: instructor.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// Approve a course
// ===============================
router.post("/approve-course/:courseId", auth, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    course.isApproved = true;
    await course.save();

    res.json({
      message: "Course approved successfully",
      courseId: course.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// View all users
// ===============================
router.get("/users", auth, adminOnly, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "isApproved"]
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// View all transactions
// ===============================
router.get("/transactions", auth, adminOnly, async (req, res) => {
  try {
    const tx = await InstructorTransaction.findAll();
    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
