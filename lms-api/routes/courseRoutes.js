const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const CourseMaterial = require("../models/CourseMaterial");
const Purchase = require("../models/Purchase");
const User = require("../models/User");

const auth = require("../middleware/authMiddleware");

// ===============================
// List approved courses (PUBLIC)
// ===============================
router.get("/", async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { isApproved: true },
      attributes: ["id", "title", "description", "price"],
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

// ===============================
// Get single course with materials
// ===============================
router.get("/:id", auth, async (req, res) => {
  try {
    const courseId = req.params.id;
    const user = req.user;

    const course = await Course.findByPk(courseId, {
      include: [
        { model: CourseMaterial },
        { model: User, attributes: ["name"] }
      ]
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // ⛔ Course must be approved
    if (!course.isApproved && user.role !== "admin") {
      return res.status(403).json({
        error: "Course not approved yet"
      });
    }

    // ⛔ Learner must purchase
    if (user.role === "learner") {
      const purchase = await Purchase.findOne({
        where: { userId: user.id, courseId }
      });

      if (!purchase || purchase.status !== "success") {
        return res.status(403).json({
          error: "Buy the course to view materials"
        });
      }
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
