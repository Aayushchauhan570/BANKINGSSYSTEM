import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const [existing] = await pool.execute("SELECT customer_id FROM Customer WHERE email = ?", [email]);
    if (existing.length) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      "INSERT INTO Customer (name,email,password,address,phone) VALUES (?,?,?,?,?)",
      [name, email, hashed, address || null, phone || null]
    );
    const customerId = result.insertId;

    // create default savings account
    const [accRes] = await pool.execute(
      "INSERT INTO Account (customer_id, account_type, balance) VALUES (?, ?, ?)",
      [customerId, "Savings", 0.00]
    );

    const token = jwt.sign({ id: customerId }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: customerId, name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.execute("SELECT * FROM Customer WHERE email = ?", [email]);
    const user = rows[0];
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.customer_id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user.customer_id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
