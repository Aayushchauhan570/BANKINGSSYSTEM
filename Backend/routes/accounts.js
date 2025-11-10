import express from "express";
import pool from "../config/db.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get user's accounts
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.userId;
    const [accounts] = await pool.execute("SELECT * FROM Account WHERE customer_id = ?", [userId]);
    res.json({ accounts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Account details by id (must belong to user)
router.get("/:id", protect, async (req, res) => {
  try {
    const userId = req.userId;
    const accountId = req.params.id;
    const [rows] = await pool.execute("SELECT * FROM Account WHERE account_id = ? AND customer_id = ?", [accountId, userId]);
    if (!rows.length) return res.status(404).json({ message: "Account not found" });
    res.json({ account: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
