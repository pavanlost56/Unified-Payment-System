import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import TransactionDetail from "../components/TransactionDetail.jsx";
import { getTransactionById } from "../lib/demoData.js";

export default function Status() {
  const [searchParams] = useSearchParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const transactionId = searchParams.get("transactionId");

  useEffect(() => {
    let active = true;

    const loadTransaction = async () => {
      if (!transactionId) {
        setLoading(false);
        return;
      }

      try {
        const nextTransaction = getTransactionById(transactionId);

        if (active) {
          setTransaction(nextTransaction);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTransaction();

    return () => {
      active = false;
    };
  }, [transactionId]);

  return (
    <AppShell>
      <section className="status-card">
        <p className="eyebrow">Status</p>
        <h1>Payment status</h1>
        <p className="muted-copy">Use this page to inspect the latest locally stored payment record in this frontend-only demo.</p>

        {error ? <p className="message error">{error}</p> : null}

        {!transactionId ? (
          <p className="empty-copy">No transaction selected yet. Start from the payment page to generate a new checkout.</p>
        ) : (
          <TransactionDetail transaction={transaction} loading={loading} />
        )}

        <div className="button-row">
          <Link to="/payment" className="primary-button">
            New payment
          </Link>
          <Link to="/dashboard" className="ghost-button">
            Back to dashboard
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
