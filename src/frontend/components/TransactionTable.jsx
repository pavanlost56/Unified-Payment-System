import { formatCurrency, formatDateTime, gatewayLabel } from "../lib/format.js";
import StatusPill from "./StatusPill.jsx";

export default function TransactionTable({ transactions, selectedId, onSelect, locked = false }) {
  if (!transactions.length) {
    return <p className="empty-copy">No transactions yet. Create a payment to see activity here.</p>;
  }

  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <button
          key={transaction.id}
          type="button"
          disabled={locked}
          onClick={() => onSelect(transaction.id)}
          className={selectedId === transaction.id ? "transaction-row active" : "transaction-row"}
        >
          <div>
            <p>{formatCurrency(transaction.amount, transaction.currency)}</p>
            <span>{formatDateTime(transaction.createdAt)}</span>
          </div>
          <div className="transaction-meta">
            <span>{transaction.country}</span>
            <span>{gatewayLabel(transaction.gateway)}</span>
            <StatusPill status={transaction.status} />
          </div>
        </button>
      ))}
    </div>
  );
}

