const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const Purchase = require("../models/Purchase");
const Course = require("../models/Course");
const InstructorTransaction = require("../models/InstructorTransaction");

const axios = require("axios");
require("dotenv").config();

// ===============================
// Learner buys a course
// ===============================
router.post("/buy/:courseId", auth, async (req, res) => {
  try {
    const user = req.user;
    const courseId = req.params.courseId;
    const { secret } = req.body;

    // Only learners
    if (user.role !== "learner") {
      return res.status(403).json({
        error: "Only learners can buy courses"
      });
    }

    // Check course
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        error: "Course not found"
      });
    }

    // Course must be approved
    if (course.status !== "approved") {
      return res.status(403).json({
        error: "Course is not approved yet"
      });
    }

    // Already purchased?
    const existing = await Purchase.findOne({
      where: { userId: user.id, courseId }
    });

    if (existing && existing.status === "success") {
      return res.json({
        message: "You already purchased this course"
      });
    }

    // Bank info check
    if (!user.bankAccountNumber || !secret) {
      return res.status(400).json({
        error: "Bank account or secret missing"
      });
    }

    // -------------------------------
    // Call BANK API
    // -------------------------------
    const bankResp = await axios.post(
      `${process.env.BANK_API_URL}/transfer`,
      {
        from: user.bankAccountNumber,
        to: process.env.LMS_BANK_ACCOUNT,
        secret,
        amount: course.price
      }
    );

    if (bankResp.data?.error) {
      return res.status(400).json({
        error: bankResp.data.error
      });
    }

    // -------------------------------
    // Save purchase
    // -------------------------------
    const purchase = await Purchase.create({
      userId: user.id,
      courseId,
      status: "success"
    });

    // -------------------------------
    // Instructor payout record (80%)
    // -------------------------------
    await InstructorTransaction.create({
      instructor_id: course.instructorId,
      course_id: course.id,
      amount: course.price * 0.8,
      status: "completed"
    });

    res.json({
      message: "Payment successful. Course purchased.",
      purchase
    });

  } catch (err) {
    console.error("Purchase error:", err.message);
    res.status(500).json({
      error: "Purchase failed",
      details: err.message
    });
  }
});

module.exports = router;
