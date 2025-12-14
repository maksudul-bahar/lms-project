const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const InstructorTransaction = require("../models/InstructorTransaction");
const Course = require("../models/Course");

// ==================================
// Instructor payment summary
// ==================================
router.get("/summary", auth, async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ error: "Instructor only" });
    }

    if (!req.user.isApproved) {
      return res.status(403).json({
        error: "Instructor not approved by admin yet"
      });
    }

    const instructorId = req.user.id;

    const total =
      (await InstructorTransaction.sum("amount", {
        where: { instructorId }
      })) || 0;

    const pending =
      (await InstructorTransaction.sum("amount", {
        where: { instructorId, status: "pending" }
      })) || 0;

    const completed =
      (await InstructorTransaction.sum("amount", {
        where: { instructorId, status: "completed" }
      })) || 0;

    res.json({
      instructorId,
      total,
      pending,
      completed
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================================
// Instructor course sales
// ==================================
router.get("/course-sales", auth, async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ error: "Instructor only" });
    }

    const instructorId = req.user.id;

    const sales = await InstructorTransaction.findAll({
      where: { instructorId },
      include: [
        {
          model: Course,
          attributes: ["id", "title"]
        }
      ]
    });

    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
