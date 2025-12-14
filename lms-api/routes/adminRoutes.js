const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const Course = require("../models/Course");
const CourseMaterial = require("../models/CourseMaterial");
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

/* =====================================================
   INSTRUCTOR APPROVAL
===================================================== */

// Get pending instructors
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

// Approve instructor
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

/* =====================================================
   COURSE MODERATION
===================================================== */

// Get pending courses
router.get("/pending-courses", auth, adminOnly, async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { status: "pending" },
      attributes: ["id", "title", "price", "createdAt"],
      include: {
        model: User,
        attributes: ["name"]
      }
    });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve course
router.post("/approve-course/:id", auth, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    course.status = "approved";
    course.rejectionReason = null;
    await course.save();

    res.json({
      message: "Course approved successfully",
      courseId: course.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject course
router.post("/reject-course/:id", auth, adminOnly, async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: "Rejection reason required" });
    }

    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    course.status = "rejected";
    course.rejectionReason = reason;
    await course.save();

    res.json({
      message: "Course rejected successfully",
      courseId: course.id,
      reason
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =====================================================
   ADMIN VIEWS
===================================================== */

// Approved learners
router.get("/approved-learners", auth, adminOnly, async (req, res) => {
  const learners = await User.findAll({
    where: { role: "learner", isApproved: true },
    attributes: ["id", "name", "email", "createdAt"]
  });

  res.json(learners);
});

// Approved instructors
router.get("/approved-instructors", auth, adminOnly, async (req, res) => {
  const instructors = await User.findAll({
    where: { role: "instructor", isApproved: true },
    attributes: ["id", "name", "email", "createdAt"]
  });

  res.json(instructors);
});

// Approved courses with materials
router.get("/approved-courses", auth, adminOnly, async (req, res) => {
  const courses = await Course.findAll({
    where: { status: "approved" },
    include: [
      {
        model: CourseMaterial
      },
      {
        model: User,
        attributes: ["name"]
      }
    ]
  });

  res.json(courses);
});

// View all users
router.get("/users", auth, adminOnly, async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "name", "email", "role", "isApproved"]
  });

  res.json(users);
});

// View all instructor transactions
router.get("/transactions", auth, adminOnly, async (req, res) => {
  const tx = await InstructorTransaction.findAll();
  res.json(tx);
});

module.exports = router;
