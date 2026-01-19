const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const Course = require("../models/Course");
const CourseMaterial = require("../models/CourseMaterial");
const InstructorTransaction = require("../models/InstructorTransaction");
const InstructorPayout = require("../models/InstructorPayout");

// ================================
// Instructor-only + approval check
// ================================
function instructorOnly(req, res, next) {
  if (req.user.role !== "instructor") {
    return res.status(403).json({ error: "Only instructors allowed" });
  }

  if (!req.user.isApproved) {
    return res.status(403).json({ error: "Instructor not approved yet" });
  }

  if (!req.user.bankAccountNumber) {
    return res.status(403).json({
      error: "Please link a bank account first"
    });
  }

  next();
}

function instructorAuth(req, res, next) {
  if (req.user.role !== "instructor") {
    return res.status(403).json({ error: "Only instructors allowed" });
  }

  if (!req.user.isApproved) {
    return res.status(403).json({ error: "Instructor not approved yet" });
  }

  next();
}


// ================================
// Upload course
// ================================
router.post("/upload-course", auth, instructorOnly, async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: "Title and price required" });
    }

    const course = await Course.create({
      title,
      description,
      price,
      instructorId: req.user.id,
      status: "pending"
    });

    res.json({
      message: "Course uploaded. Waiting for admin approval.",
      course
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =================================
// Upload material (approved course only)
// =================================
router.post("/upload-material/:courseId", auth, instructorOnly, async (req, res) => {
  try {
    const { type, content } = req.body;

    const course = await Course.findByPk(req.params.courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.instructorId !== req.user.id) return res.status(403).json({ error: "Not your course" });
    if (course.status !== "approved") return res.status(403).json({ error: "Course not approved yet" });

    const material = await CourseMaterial.create({
      type,
      content,
      courseId: course.id
    });

    res.json({ message: "Material uploaded", material });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================================
// Instructor summary
// ================================
router.get("/summary", auth, instructorAuth, async (req, res) => {
  const instructorId = req.user.id;

  const totalEarned =
    (await InstructorTransaction.sum("amount", {
      where: { instructor_id: instructorId }
    })) || 0;

  const totalWithdrawn =
    (await InstructorPayout.sum("amount", {
      where: { instructorId, status: "approved" }
    })) || 0;

  res.json({
    totalEarned,
    totalWithdrawn,
    availableBalance: totalEarned - totalWithdrawn
  });
});

// ===============================
// Request withdrawal (PARTIAL)
// ===============================
router.post("/withdraw", auth, instructorOnly, async (req, res) => {
  const instructorId = req.user.id;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid withdrawal amount" });
  }

  const totalEarned =
    (await InstructorTransaction.sum("amount", {
      where: { instructor_id: instructorId }
    })) || 0;

  const totalWithdrawn =
    (await InstructorPayout.sum("amount", {
      where: { instructorId, status: "approved" }
    })) || 0;

  const availableBalance = totalEarned - totalWithdrawn;

  if (availableBalance <= 0) {
    return res.status(400).json({ error: "No balance available" });
  }

  if (amount > availableBalance) {
    return res.status(400).json({
      error: `Maximum withdrawable amount is ${availableBalance}`
    });
  }

  const payout = await InstructorPayout.create({
    instructorId,
    amount,
    status: "requested"
  });

  res.json({
    message: "Withdrawal request submitted",
    payout
  });
});

// ==============================
// My courses
// ==============================
router.get("/my-courses", auth, instructorAuth, async (req, res) => {
  const courses = await Course.findAll({
    where: { instructorId: req.user.id },
    attributes: ["id", "title", "status", "rejectionReason"]
  });

  res.json(courses);
});

module.exports = router;


// ===============================
// Instructor course details
// ===============================
router.get("/course/:id", auth, instructorAuth, async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [CourseMaterial]
  });

  if (!course || course.instructorId !== req.user.id) {
    return res.status(403).json({ error: "Not allowed" });
  }

  res.json(course);
});

// ===============================
// Instructor withdrawals
// ===============================
router.get("/withdrawals", auth, instructorAuth, async (req, res) => {
  const data = await InstructorPayout.findAll({
    where: { instructorId: req.user.id },
    order: [["createdAt", "DESC"]]
  });

  res.json(data);
});

