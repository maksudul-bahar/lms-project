const express = require("express");
require("dotenv").config();
const sequelize = require("./config/db");

const app = express();
app.use(express.json());

// Test API
app.get("/", (req, res) => {
    res.send("learner API is running...");
});

// Connect MySQL
sequelize.authenticate()
    .then(() => console.log("MySQL connected"))
    .catch(err => console.log("DB error:", err));

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`learner API started on ${PORT}`));
