import { Link, useLocation } from "react-router-dom";

function PaymentSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <main className="status-page">
        <div className="status-card">
          <h1>Payment Status</h1>
          <p>
            कोई verified order details नहीं मिलीं।
            Payment History में status check करें।
          </p>
          <Link to="/payment-history" className="primary-button">
            Check Payment History
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="status-page">
      <div className="status-card">
        <div className="status-icon success-icon">✓</div>

        <span className="course-label">PAYMENT VERIFIED</span>

        <h1>Payment Successful!</h1>

        <p>Your payment has been verified by our server.</p>

        <div className="receipt">
          <p>
            <span>Course</span>
            <strong>{order.productName}</strong>
          </p>

          <p>
            <span>Amount</span>
            <strong>₹{order.amount}</strong>
          </p>

          <p>
            <span>Status</span>
            <strong className="paid-status">{order.status}</strong>
          </p>

          <p>
            <span>Order ID</span>
            <strong className="break-text">
              {order.razorpayOrderId}
            </strong>
          </p>

          <p>
            <span>Payment ID</span>
            <strong className="break-text">
              {order.razorpayPaymentId}
            </strong>
          </p>
        </div>

        <Link to="/" className="primary-button">
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default PaymentSuccess;