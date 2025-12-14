const express = require("express");
const router = express.Router();
const BankAccount = require("../models/BankAccount");
const Transaction = require("../models/Transaction");
const bcrypt = require("bcrypt");


// Create account
router.post("/create", async (req, res) => {
    try {
        const { accountNumber, secret } = req.body;

        const hashedSecret = await bcrypt.hash(secret, 10);

        const acc = await BankAccount.create({
            accountNumber,
            secret: hashedSecret,
            balance: 1000 // initial balance
        });

        res.json({ message: "Account created", acc });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/balance/:acc", async (req, res) => {
    try {
        const account = await BankAccount.findByPk(req.params.acc);

        if (!account) return res.json({ error: "Account not found" });

        res.json({ balance: account.balance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post("/transfer", async (req, res) => {
    try {
        const { from, secret, to, amount } = req.body;

        const sender = await BankAccount.findOne({
            where: { accountNumber: from }
        });

        const receiver = await BankAccount.findOne({
            where: { accountNumber: to }
        });

        if (!sender || !receiver)
            return res.json({ error: "Invalid accounts" });

        const validSecret = await bcrypt.compare(secret, sender.secret);
        if (!validSecret)
            return res.json({ error: "Invalid secret PIN" });

        if (sender.balance < amount)
            return res.json({ error: "Insufficient balance" });

        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        await Transaction.create({
            fromAccount: from,
            toAccount: to,
            amount,
            status: "success"
        });

        res.json({ message: "Transfer successful" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
