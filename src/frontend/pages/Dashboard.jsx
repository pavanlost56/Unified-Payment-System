import { useEffect, useState } from "react";
import AppShell from "../components/AppShell.jsx";
import MetricCard from "../components/MetricCard.jsx";
import ProfileAvatar from "../components/ProfileAvatar.jsx";
import RevealSection from "../components/RevealSection.jsx";
import SectionCard from "../components/SectionCard.jsx";
import TransactionDetail from "../components/TransactionDetail.jsx";
import TransactionTable from "../components/TransactionTable.jsx";
import { useSession } from "../components/SessionProvider.jsx";
import { getDashboardData, getTransactionById } from "../lib/demoData.js";
import { COUNTRIES, getCountryMeta } from "../lib/constants.js";
import { formatCurrency } from "../lib/format.js";

const initialSummary = {
  totalTransactions: 0,
  totalAmount: 0,
  successCount: 0,
  issueCount: 0
};

export default function Dashboard() {
  const { isGuest, profile } = useSession();
  const [filters, setFilters] = useState({ country: "", gateway: "" });
  const [summary, setSummary] = useState(initialSummary);
  const [transactions, setTransactions] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const selectedCountry = filters.country ? getCountryMeta(filters.country) : null;
  const totalsByCurrency = summary.totalsByCurrency || [];
  const amountValue = loading
    ? "..."
    : selectedCountry
      ? formatCurrency(summary.totalAmount, selectedCountry.currency)
      : totalsByCurrency.length
        ? "Portfolio volume"
        : "0.00";
  const amountNote = loading
    ? ""
    : selectedCountry
      ? `${selectedCountry.name} settlement view`
      : "Separated by settlement currency";
  const amountStack = loading
    ? []
    : selectedCountry
      ? []
      : totalsByCurrency.map((item) => formatCurrency(item.total, item.currency));
  const accountLabel = isGuest ? profile?.user?.label || "Guest User" : profile?.user?.email || "Operator";
  const accountMode = isGuest
    ? "Guest workspace"
    : profile?.user?.role === "admin"
      ? "Admin workspace"
      : "Registered workspace";
  const accountSummary = isGuest
    ? "Routing previews remain open, while live payments stay locked until you register or login."
    : "Verified transactions stay linked to this account for clearer reporting and status tracking.";

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const filterValues = {
          country: filters.country,
          gateway: filters.gateway
        };
        const { summary: summaryResponse, transactions: transactionResponse } = getDashboardData(filterValues);

        if (!active) {
          return;
        }

        setSummary(summaryResponse);
        setTransactions(transactionResponse);
        setSelectedId((currentId) => {
          if (currentId && transactionResponse.some((item) => item.id === currentId)) {
            return currentId;
          }

          return transactionResponse[0]?.id || "";
        });
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

    loadDashboard();

    return () => {
      active = false;
    };
  }, [filters.country, filters.gateway]);

  useEffect(() => {
    let active = true;

    if (!selectedId) {
      setSelectedTransaction(null);
      return () => {
        active = false;
      };
    }

    const loadDetail = async () => {
      setDetailLoading(true);

      try {
        const transaction = getTransactionById(selectedId);

        if (active) {
          setSelectedTransaction(transaction);
        }
      } catch (_error) {
        if (active) {
          setSelectedTransaction(null);
        }
      } finally {
        if (active) {
          setDetailLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      active = false;
    };
  }, [selectedId]);

  return (
    <AppShell>
      <RevealSection className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Payment performance at a glance.</h1>
          <p className="muted-copy">
            {isGuest
              ? "Guest mode is active. You can inspect the routing system, while payment execution stays intentionally locked."
              : "Monitor transaction health, filter flows by region, and inspect each payment record."}
          </p>
        </div>
        <div className="dashboard-head-stack">
          <article className={`account-panel ${isGuest ? "guest" : ""}`}>
            <ProfileAvatar
              src={profile?.user?.avatarUrl}
              label={accountLabel}
              size="lg"
              tone={isGuest ? "guest" : profile?.user?.role === "admin" ? "admin" : "default"}
            />
            <div className="account-copy">
              <p className="eyebrow">{accountMode}</p>
              <h2>{accountLabel}</h2>
              <p>{accountSummary}</p>
            </div>
          </article>

          <div className="filter-row">
            <label className="field compact">
              <span>Country</span>
              <select
                value={filters.country}
                onChange={(event) => setFilters((current) => ({ ...current, country: event.target.value }))}
              >
                <option value="">All</option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field compact">
              <span>Gateway</span>
              <select
                value={filters.gateway}
                onChange={(event) => setFilters((current) => ({ ...current, gateway: event.target.value }))}
              >
                <option value="">All</option>
                <option value="manual">Manual</option>
                <option value="stripe">Stripe</option>
              </select>
            </label>
          </div>
        </div>
      </RevealSection>

      {error ? <p className="message error">{error}</p> : null}

      <RevealSection className="metric-grid" delay={60}>
        <MetricCard
          label="Total transactions"
          value={loading ? "..." : String(summary.totalTransactions)}
          note="Across the active filter scope"
          tone="default"
        />
        <MetricCard
          label="Total amount"
          value={amountValue}
          note={amountNote}
          stack={amountStack}
          tone="accent"
        />
        <MetricCard
          label="Success count"
          value={loading ? "..." : String(summary.successCount)}
          note="Verified completions"
          tone="success"
        />
        <MetricCard
          label="Failed / pending"
          value={loading ? "..." : String(summary.issueCount)}
          note="Needs attention or confirmation"
          tone="warning"
        />
      </RevealSection>

      <RevealSection className="dashboard-grid" delay={120}>
        <SectionCard title="Recent transactions" eyebrow="Activity" locked={isGuest}>
          <TransactionTable
            transactions={transactions}
            selectedId={selectedId}
            onSelect={setSelectedId}
            locked={isGuest}
          />
        </SectionCard>

        <SectionCard title="Transaction detail view" eyebrow="Inspection" locked={isGuest}>
          <TransactionDetail transaction={selectedTransaction} loading={detailLoading} />
        </SectionCard>
      </RevealSection>
    </AppShell>
  );
}
