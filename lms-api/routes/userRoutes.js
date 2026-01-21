const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const bcrypt = require("bcrypt");
const axios = require("axios");

require("dotenv").config();

const BANK_API = process.env.BANK_API_URL;


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

/* =====================================================
   LINK EXISTING BANK ACCOUNT (ONLY OPTION)
===================================================== */
router.post("/bank/link", auth, async (req, res) => {
  try {
    const { accountNumber, secret } = req.body;

    if (!accountNumber || !secret) {
      return res.status(400).json({
        error: "accountNumber and secret required"
      });
    }

    // 1️⃣ Verify bank account exists
    const bankCheck = await axios
      .get(`${BANK_API}/balance/${accountNumber}`)
      .catch(() => null);

    if (!bankCheck || bankCheck.data?.error) {
      return res.status(400).json({
        error: "Bank account does not exist"
      });
    }

    // 2️⃣ Save reference in LMS (hashed secret)
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
