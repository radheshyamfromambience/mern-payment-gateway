import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

export const createOrder = async (customerName, customerEmail) => {
  const response = await API.post("/api/payments/create-order", {
    customerName,
    customerEmail,
  });

  return response.data;
};

export const verifyPayment = async (paymentResponse) => {
  const response = await API.post(
    "/api/payments/verify",
    paymentResponse
  );

  return response.data;
};

export const getPaymentHistory = async (email) => {
  const response = await API.get("/api/payments/history", {
    params: { email },
  });

  return response.data;
};