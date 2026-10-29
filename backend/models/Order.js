const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },

    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    productName: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    razorpayOrderId: {
      type: String,
      required: true,
      unique: true
    },

    razorpayPaymentId: {
      type: String,
      default: null
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created"
    },

    verifiedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);