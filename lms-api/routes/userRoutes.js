const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const bcrypt = require("bcrypt");
const axios = require("axios");

require("dotenv").config();

// ===============================
// Get user profile
// ===============================
router.get("/profile", auth, async (req, res) => {
  const user = req.user;

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    bankAccountNumber: user.bankAccountNumber || null
  });
});

// ===============================
// Save EXISTING bank info (NO creation)
// ===============================
router.post("/bank", auth, async (req, res) => {
  try {
    const { accountNumber, secret } = req.body;

    if (!accountNumber || !secret) {
      return res.status(400).json({
        error: "accountNumber and secret required"
      });
    }

    // 1️⃣ Verify bank account exists (Bank API)
    const bankApiUrl = "http://localhost:4000/bank";

    const bankCheck = await axios
  .get(`http://localhost:4000/bank/balance/${accountNumber}`)
  .catch(() => null);

if (!bankCheck || bankCheck.data?.error) {
  return res.status(400).json({
    error: "Bank account does not exist"
  });
}

    // 2️⃣ Hash secret and save reference in LMS
    const secretHash = await bcrypt.hash(secret, 10);

    req.user.bankAccountNumber = accountNumber;
    req.user.bankSecretHash = secretHash;
    await req.user.save();

    res.json({
      message: "Bank account linked successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
