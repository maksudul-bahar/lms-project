const express = require("express");
require("dotenv").config();
const sequelize = require("./config/db");

const app = express();
app.use(express.json());

// Test API
app.get("/", (req, res) => {
    res.send("Instructor API is running...");
});

// Connect MySQL
sequelize.authenticate()
    .then(() => console.log("MySQL connected"))
    .catch(err => console.log("DB error:", err));

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`INSTRUCTOR API started on ${PORT}`));
