const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order");

const router = express.Router();

const COURSE = {
  name: "MERN Stack Course",
  amount: 499
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 1. CREATE ORDER
router.post("/create-order", async (req, res) => {
  try {
    const { customerName, customerEmail } = req.body;

    if (
      typeof customerName !== "string" ||
      customerName.trim().length < 2 ||
      typeof customerEmail !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid name and email are required."
      });
    }

    // Amount is fixed on the server, not accepted from the browser.
    const razorpayOrder = await razorpay.orders.create({
      amount: COURSE.amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    await Order.create({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      productName: COURSE.name,
      amount: COURSE.amount,
      currency: "INR",
      razorpayOrderId: razorpayOrder.id,
      status: "created"
    });

    res.status(201).json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      },
      customer: {
        name: customerName.trim(),
        email: customerEmail.trim()
      },
      productName: COURSE.name
    });
  } catch (error) {
    console.error("Create order error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to create order."
    });
  }
});

// 2. VERIFY PAYMENT
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are incomplete."
      });
    }

    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    // Verify the signature using the server-side secret.
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
      .digest("hex");

    const received = Buffer.from(razorpay_signature, "utf8");
    const expected = Buffer.from(expectedSignature, "utf8");

    if (
      received.length !== expected.length ||
      !crypto.timingSafeEqual(received, expected)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature."
      });
    }

    // Confirm the payment directly with Razorpay.
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (
      payment.order_id !== order.razorpayOrderId ||
      payment.amount !== order.amount * 100 ||
      payment.currency !== order.currency
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details do not match the order."
      });
    }

    // Only captured payments count as paid.
    if (payment.status !== "captured") {
      return res.status(409).json({
        success: false,
        message: `Payment is not captured. Current status: ${payment.status}`
      });
    }

    // Do not overwrite an already-paid order with another payment ID.
    if (
      order.status === "paid" &&
      order.razorpayPaymentId !== razorpay_payment_id
    ) {
      return res.status(409).json({
        success: false,
        message: "This order has already been paid."
      });
    }

    order.razorpayPaymentId = razorpay_payment_id;
    order.status = "paid";
    order.verifiedAt = new Date();

    await order.save();

    res.json({
      success: true,
      message: "Payment verified successfully.",
      order: {
        id: order._id,
        productName: order.productName,
        amount: order.amount,
        status: order.status,
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: order.razorpayPaymentId
      }
    });
  } catch (error) {
    console.error("Payment verification error:", error.message);

    res.status(500).json({
      success: false,
      message: "Payment verification could not be completed."
    });
  }
});



/* 3. PAYMENT HISTORY */
router.get("/history", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required."
      });
    }

    const orders = await Order.find({
      customerEmail: email.trim().toLowerCase()
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error("Payment history error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load payment history."
    });
  }
});


module.exports = router;