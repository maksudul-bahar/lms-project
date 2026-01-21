// lms-api/server.js
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const sequelize = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://lms-project-omega-black.vercel.app/"
  ],
  credentials: true
}));


// models
const User = require("./models/User");
require("./models");  // <-- loads all models + associations


// routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const instructorPaymentRoutes = require("./routes/instructorPaymentRoutes");
const completionRoutes = require("./routes/completionRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const adminRoutes = require("./routes/adminRoutes");
const learnerRoutes = require("./routes/learnerRoutes");






app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/courses", courseRoutes);
app.use("/instructor", instructorRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/instructor/payments", instructorPaymentRoutes);
app.use("/completion", completionRoutes);
app.use("/certificate", certificateRoutes);
app.use("/admin", adminRoutes);
app.use("/learner", learnerRoutes);




app.get("/", (req, res) => res.send("LMS API running"));

// database sync & server start
sequelize.sync({ alter: true })
  .then(() => {
    console.log("LMS DB synced");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`LMS API running on ${PORT}`));
  })
  .catch(err => {
    console.error("DB sync error:", err);
  });


