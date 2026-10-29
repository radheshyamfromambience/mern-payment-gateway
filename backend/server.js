require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
  })
);

app.use(express.json());

// Test API
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Payment Gateway API is running"
  });
});

// Payment APIs
app.use("/api/payments", paymentRoutes);

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();