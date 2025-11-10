import express from "express";
import pool from "../config/db.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
Endpoints:
POST /api/transactions/deposit { account_id, amount, remarks }
POST /api/transactions/withdraw { account_id, amount, remarks }
POST /api/transactions/transfer { from_account_id, to_account_id, amount, remarks }
GET /api/transactions/account/:accountId  -- list transactions for account
*/

router.post("/deposit", protect, async (req, res) => {
  const { account_id, amount, remarks } = req.body;
  if (!account_id || !amount || amount <= 0) return res.status(400).json({ message: "Invalid input" });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // check ownership
    const [accRows] = await conn.execute("SELECT * FROM Account WHERE account_id = ? AND customer_id = ?", [
      account_id,
      req.userId,
    ]);
    if (!accRows.length) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ message: "Account not found or not owned by user" });
    }

    await conn.execute("INSERT INTO TransactionLog (account_id, type, amount, receiver_account, remarks) VALUES (?, 'Deposit', ?, NULL, ?)", [account_id, amount, remarks || null]);
    await conn.execute("UPDATE Account SET balance = balance + ? WHERE account_id = ?", [amount, account_id]);

    await conn.commit();
    conn.release();
    res.json({ message: "Deposit successful" });
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/withdraw", protect, async (req, res) => {
  const { account_id, amount, remarks } = req.body;
  if (!account_id || !amount || amount <= 0) return res.status(400).json({ message: "Invalid input" });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [accRows] = await conn.execute("SELECT * FROM Account WHERE account_id = ? AND customer_id = ? FOR UPDATE", [
      account_id,
      req.userId,
    ]);
    if (!accRows.length) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ message: "Account not found or not owned by user" });
    }

    const balance = parseFloat(accRows[0].balance);
    if (balance < amount) {
      await conn.rollback();
      conn.release();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    await conn.execute("INSERT INTO TransactionLog (account_id, type, amount, receiver_account, remarks) VALUES (?, 'Withdraw', ?, NULL, ?)", [account_id, amount, remarks || null]);
    await conn.execute("UPDATE Account SET balance = balance - ? WHERE account_id = ?", [amount, account_id]);

    await conn.commit();
    conn.release();
    res.json({ message: "Withdraw successful" });
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/transfer", protect, async (req, res) => {
  const { from_account_id, to_account_id, amount, remarks } = req.body;
  if (!from_account_id || !to_account_id || !amount || amount <= 0) return res.status(400).json({ message: "Invalid input" });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // lock both accounts (order by account id to avoid deadlocks)
    const [fromRows] = await conn.execute("SELECT * FROM Account WHERE account_id = ? AND customer_id = ? FOR UPDATE", [
      from_account_id,
      req.userId,
    ]);
    if (!fromRows.length) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ message: "Source account not found or not owned by user" });
    }

    const [toRows] = await conn.execute("SELECT * FROM Account WHERE account_id = ? FOR UPDATE", [to_account_id]);
    if (!toRows.length) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ message: "Destination account not found" });
    }

    const fromBalance = parseFloat(fromRows[0].balance);
    if (fromBalance < amount) {
      await conn.rollback();
      conn.release();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // add transaction rows
    await conn.execute("INSERT INTO TransactionLog (account_id, type, amount, receiver_account, remarks) VALUES (?, 'Transfer', ?, ?, ?)", [from_account_id, amount, to_account_id, remarks || null]);
    await conn.execute("INSERT INTO TransactionLog (account_id, type, amount, receiver_account, remarks) VALUES (?, 'Transfer', ?, ?, ?)", [to_account_id, amount, from_account_id, `Received from ${from_account_id}${remarks ? ' - ' + remarks : ''}`]);

    await conn.execute("UPDATE Account SET balance = balance - ? WHERE account_id = ?", [amount, from_account_id]);
    await conn.execute("UPDATE Account SET balance = balance + ? WHERE account_id = ?", [amount, to_account_id]);

    await conn.commit();
    conn.release();
    res.json({ message: "Transfer successful" });
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/account/:accountId", protect, async (req, res) => {
  try {
    const accountId = req.params.accountId;
    // ensure ownership or allowed view
    const [accRows] = await pool.execute("SELECT * FROM Account WHERE account_id = ? AND customer_id = ?", [accountId, req.userId]);
    if (!accRows.length) return res.status(404).json({ message: "Account not found or not owned by user" });

    const [tx] = await pool.execute("SELECT * FROM TransactionLog WHERE account_id = ? ORDER BY transaction_date DESC", [accountId]);
    res.json({ transactions: tx, account: accRows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
