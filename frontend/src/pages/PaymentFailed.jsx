import { Link, useLocation } from "react-router-dom";

function PaymentFailed() {
  const { state } = useLocation();

  const message =
    state?.message ||
    "Payment status confirm नहीं हुआ है। Retry करने से पहले status जाँचें।";

  return (
    <main className="status-page">
      <div className="status-card">
        <div className="status-icon failed-icon">!</div>

        <span className="course-label">PAYMENT STATUS</span>

        <h1>Payment Not Confirmed</h1>

        <p>{message}</p>

        <div className="notice">
          यदि आपके खाते से पैसे कटे हैं, तो तुरंत दोबारा भुगतान न करें।
          पहले transaction status verify करें।
        </div>

        <div className="button-group">
          <Link to="/checkout" className="primary-button">
            Try Again
          </Link>

          <Link to="/payment-history" className="secondary-button">
            Payment History
          </Link>
        </div>
      </div>
    </main>
  );
}

export default PaymentFailed;