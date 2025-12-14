const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");

// ===============================
// Verify certificate
// ===============================
router.get("/verify/:code", async (req, res) => {
  const cert = await Certificate.findOne({
    where: { certificateCode: req.params.code }
  });

  if (!cert) {
    return res.status(404).json({ error: "Invalid certificate" });
  }

  res.json({
    valid: true,
    certificate: cert
  });
});

module.exports = router;
