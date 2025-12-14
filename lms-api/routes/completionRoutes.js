const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const Purchase = require("../models/Purchase");
const Certificate = require("../models/Certificate");
const crypto = require("crypto");

// ===============================
// Mark course as completed
// ===============================
router.post("/complete/:courseId", auth, async (req, res) => {
  try {
    const user = req.user;
    const courseId = req.params.courseId;

    if (user.role !== "learner") {
      return res.status(403).json({ error: "Only learners can complete courses" });
    }

    const purchase = await Purchase.findOne({
      where: { userId: user.id, courseId, status: "success" }
    });

    if (!purchase) {
      return res.status(403).json({ error: "Course not purchased" });
    }

    // Check if certificate already exists
    const existing = await Certificate.findOne({
      where: { userId: user.id, courseId }
    });

    if (existing) {
      return res.json({ message: "Course already completed", certificate: existing });
    }

    const certificateCode = crypto.randomBytes(8).toString("hex");

    const cert = await Certificate.create({
      userId: user.id,
      courseId,
      certificateCode
    });

    res.json({
      message: "Course completed successfully",
      certificate: cert
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
