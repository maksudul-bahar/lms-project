const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const Course = require("../models/Course");
const CourseMaterial = require("../models/CourseMaterial");

// ===============================
// Instructor-only + approval check
// ===============================
function instructorOnly(req, res, next) {
  if (req.user.role !== "instructor") {
    return res.status(403).json({
      error: "Only instructors can perform this action"
    });
  }

  if (!req.user.isApproved) {
    return res.status(403).json({
      error: "Instructor not approved by admin yet"
    });
  }

  next();
}

// ===============================
// Upload a new course
// ===============================
router.post("/upload-course", auth, instructorOnly, async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: "Title and price required" });
    }

    // Limit LMS total courses
    // const count = await Course.count();
    // if (count >= 5) {
    //   return res.status(400).json({
    //     error: "LMS already has 5 courses"
    //   });
    // }

    const course = await Course.create({
      title,
      description,
      price,
      instructorId: req.user.id,
      isApproved: false   // course itself needs admin approval
    });

    res.json({
      message: "Course uploaded. Waiting for admin approval.",
      course
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// Upload course material
// ===============================
router.post("/upload-material/:courseId", auth, instructorOnly, async (req, res) => {
  try {
    const { type, content } = req.body;
    const courseId = req.params.courseId;

    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (course.instructorId !== req.user.id) {
      return res.status(403).json({
        error: "You do not own this course"
      });
    }

    if (!course.isApproved) {
      return res.status(403).json({
        error: "Course not approved by admin yet"
      });
    }

    const material = await CourseMaterial.create({
      type,
      content,
      courseId
    });

    res.json({
      message: "Material uploaded",
      material
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
