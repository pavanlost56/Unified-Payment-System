import { formatCurrency, formatDateTime, gatewayLabel } from "../lib/format.js";
import StatusPill from "./StatusPill.jsx";

export default function TransactionDetail({ transaction, loading }) {
  if (loading) {
    return <p className="empty-copy">Loading transaction detail...</p>;
  }

  if (!transaction) {
    return <p className="empty-copy">Select a transaction to inspect payment details.</p>;
  }

  return (
    <div className="detail-grid">
      <div className="detail-item">
        <span>Amount</span>
        <strong>{formatCurrency(transaction.amount, transaction.currency)}</strong>
      </div>
      <div className="detail-item">
        <span>Status</span>
        <StatusPill status={transaction.status} />
      </div>
      <div className="detail-item">
        <span>Gateway</span>
        <strong>{gatewayLabel(transaction.gateway)}</strong>
      </div>
      <div className="detail-item">
        <span>Country</span>
        <strong>{transaction.country}</strong>
      </div>
      <div className="detail-item">
        <span>Order ID</span>
        <strong>{transaction.orderId || "Not created"}</strong>
      </div>
      <div className="detail-item">
        <span>Payment ID</span>
        <strong>{transaction.paymentId || "Pending confirmation"}</strong>
      </div>
      <div className="detail-item full">
        <span>Created</span>
        <strong>{formatDateTime(transaction.createdAt)}</strong>
      </div>
      <div className="detail-item full">
        <span>Updated</span>
        <strong>{formatDateTime(transaction.updatedAt)}</strong>
      </div>
    </div>
  );
}

