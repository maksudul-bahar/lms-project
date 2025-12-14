const express = require("express");
require("dotenv").config();
const sequelize = require("./config/db");
const BankAccount = require("./models/BankAccount");
const Transaction = require("./models/Transaction");

const bankRoutes = require("./routes/bankRoutes");

const app = express();





app.use(express.json());

app.use("/bank", bankRoutes);

// Test API
app.get("/", (req, res) => {
    res.send("Bank API is running...");
});

// Connect MySQL
sequelize.authenticate()
    .then(() => console.log("MySQL connected"))
    .catch(err => console.log("DB error:", err));

const PORT = process.env.PORT || 4000;

sequelize.sync({ alter: true })
    .then(() => console.log("Database synced"))
    .catch(err => console.log("Sync error:", err));


app.listen(PORT, () => console.log(`Bank API started on ${PORT}`));
