
import { useState } from "react";
import { getPaymentHistory } from "../services/paymentService";

function PaymentHistory() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSearched(true);
    setOrders([]);

    try {
      const result = await getPaymentHistory(email.trim());

      // Backend response: { success: true, data: [...] }
      const paymentOrders = result.data;

      if (!Array.isArray(paymentOrders)) {
        throw new Error("Invalid payment history response.");
      }

      setOrders(paymentOrders);
    } catch (err) {
      console.error("Payment history error:", err);

      setOrders([]);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Payment history load नहीं हो पाई।"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="history-page">
      <section className="history-card">
        <span className="course-label">
          TRANSACTION RECORDS
        </span>

        <h1>Payment History</h1>

        <form onSubmit={handleSearch} className="history-form">
          <label htmlFor="history-email">
            Customer Email
          </label>

          <input
            id="history-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your checkout email"
            required
          />

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? "Loading..." : "Find Payments"}
          </button>
        </form>

        {error && (
          <p className="error-message">{error}</p>
        )}

        {searched && !loading && !error && orders.length === 0 && (
          <p className="empty-message">
            कोई order नहीं मिला।
          </p>
        )}

        {orders.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Order ID</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id || order.razorpayOrderId}
                  >
                    <td>{order.productName}</td>
                    <td>₹{order.amount}</td>
                    <td>
                      <span className={`status ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="break-text">
                      {order.razorpayOrderId}
                    </td>
                    <td>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="history-warning">
          Demo version: इस endpoint में authentication नहीं है।
          इसे production में सुरक्षित बनाएँ।
        </p>
      </section>
    </main>
  );
}

export default PaymentHistory;
