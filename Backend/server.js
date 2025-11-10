import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import { createAccountTable, createTransactionLogTable } from "./models/accountModel.js";
import { createCustomerTable } from "./models/customerModel.js";
import authRoutes from "./routes/auth.js";
import accountRoutes from "./routes/accounts.js";
import transactionRoutes from "./routes/transactions.js";

dotenv.config();

const app = express();

// ✅ Fix: Properly configure CORS for your frontend
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.use(express.json());

// Initialize database tables
const initializeTables = async () => {
  try {
    const conn = await pool.getConnection();
    await createCustomerTable(conn);
    await createAccountTable(conn);
    await createTransactionLogTable(conn);
    conn.release();
    console.log("✓ Database tables initialized successfully");
  } catch (err) {
    console.error("✗ Error initializing database tables:", err);
  }
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => res.send("Banking API running"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  await initializeTables();
  console.log(`Server running on http://localhost:${PORT}`);
});