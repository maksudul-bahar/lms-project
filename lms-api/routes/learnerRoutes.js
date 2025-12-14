const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const Purchase = require("../models/Purchase");
const Course = require("../models/Course");
const User = require("../models/User");

// ===============================
// Learner-only middleware
// ===============================
function learnerOnly(req, res, next) {
  if (req.user.role !== "learner") {
    return res.status(403).json({ error: "Learner only" });
  }
  next();
}

// ===============================
// Get learner purchased courses
// GET /learner/my-courses
// ===============================
router.get("/my-courses", auth, learnerOnly, async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      where: {
        userId: req.user.id,
        status: "success"
      },
      include: [
        {
          model: Course,
          where: { status: "approved" },
          attributes: ["id", "title", "description", "price"],
          include: {
            model: User,
            attributes: ["name"]
          }
        }
      ]
    });

    // Extract only courses
    const courses = purchases.map(p => p.Course);

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
