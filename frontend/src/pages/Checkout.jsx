import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createOrder, verifyPayment } from "../services/paymentService";

function Checkout() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error("Razorpay Checkout load nahi ho paya.");
      }

      // Step 1: Create order through backend
      const data = await createOrder(name, email);

      // Step 2: Open Razorpay Checkout
      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Ambience Computer Education",
        description: data.productName,
        order_id: data.order.id,

        prefill: {
          name: data.customer.name,
          email: data.customer.email,
        },

        theme: {
          color: "#e2ad00",
        },

        handler: async (response) => {
          try {
            // Step 3: Verify payment on backend
            const result = await verifyPayment(response);

            if (result.success) {
              navigate("/payment-success", {
                state: { order: result.order },
              });
            }
          } catch (err) {
            navigate("/payment-failed", {
              state: {
                message:
                  "Payment verification pending. Please check your payment status before trying again.",
              },
            });
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            setError(
              "Checkout closed. If you attempted payment, check its status before retrying."
            );
          },
        },
      };

      const checkout = new window.Razorpay(options);

      checkout.on("payment.failed", (response) => {
        setLoading(false);

        navigate("/payment-failed", {
          state: {
            message:
              response.error?.description ||
              "Payment failed. Check the payment status before retrying.",
          },
        });
      });

      checkout.open();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to start payment."
      );
      setLoading(false);
    }
  };

  return (
    <main className="checkout-page">
      <section className="checkout-card">
        <span className="course-label">SECURE CHECKOUT</span>

        <h1>Complete Your Enrollment</h1>

        <div className="checkout-summary">
          <div>
            <strong>MERN Stack Development</strong>
            <p>Demo course enrollment</p>
          </div>

          <strong className="checkout-price">₹499</strong>
        </div>

        <form onSubmit={handlePayment}>
          <label htmlFor="name">Full Name</label>

          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
            maxLength={100}
            required
          />

          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button
            className="primary-button pay-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay ₹499 Now"}
          </button>
        </form>

        <p className="secure-text">
          🔒 Secure payment powered by Razorpay Test Mode
        </p>
      </section>
    </main>
  );
}

export default Checkout;