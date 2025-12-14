// lms-api/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const isInstructor = role === "instructor";

const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role,
  isApproved: !isInstructor   // instructors need admin approval
});


    res.json({ message: "User registered", user: { id: user.id, name: user.name, email: user.email, role: user.role }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "12h" });
    res.json({ message: "Login success", token, user: { id: user.id, name: user.name, email: user.email, role: user.role }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
