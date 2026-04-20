import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import ProfileAvatar from "../components/ProfileAvatar.jsx";
import RevealSection from "../components/RevealSection.jsx";
import { useSession } from "../components/SessionProvider.jsx";
import { createDemoPayment } from "../lib/demoData.js";
import {
  COUNTRIES,
  GUEST_PAYMENT_MESSAGE,
  STRIPE_PLACEHOLDER_MESSAGE,
  getCountryMeta
} from "../lib/constants.js";
import { formatCountryAmount, gatewayLabel } from "../lib/format.js";

export default function Payment() {
  const navigate = useNavigate();
  const { profile, isGuest } = useSession();
  const [country, setCountry] = useState("IN");
  const [amount, setAmount] = useState("499");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedCountry = getCountryMeta(country);
  const gateway = selectedCountry.gateway;
  const currency = selectedCountry.currency;
  const displayAmount = Number(amount) || 0;
  const isStripeRoute = gateway === "stripe";
  const isManualRoute = gateway === "manual";
  const identityLabel = isGuest ? profile?.user?.label || "Guest User" : profile?.user?.email || "Registered User";
  const accessTitle = isGuest ? "Preview the route. Sign in to pay." : "Your account is ready for live checkout.";
  const accessCopy = isGuest
    ? "You can explore country routing, currency switching, and gateway selection here. Live payment execution is reserved for registered accounts."
    : "Payments stay linked to your account and flow through the correct country gateway automatically.";

  const handleCountryChange = (nextCountry) => {
    setCountry(nextCountry);
    setMessage("");
    setError("");
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (isGuest) {
      setMessage(GUEST_PAYMENT_MESSAGE);
      return;
    }

    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount to continue.");
      return;
    }

    setBusy(true);

    if (isStripeRoute) {
      const transaction = createDemoPayment({
        country,
        amount: parsedAmount,
        ownerEmail: profile?.user?.email || "guest@ups.local"
      });
      setMessage(STRIPE_PLACEHOLDER_MESSAGE);
      navigate(`/status?transactionId=${transaction.id}`);
      setBusy(false);
      return;
    }

    try {
      const transaction = createDemoPayment({
        country,
        amount: parsedAmount,
        ownerEmail: profile?.user?.email || "guest@ups.local"
      });
      setMessage("Demo checkout completed locally. No API call was made.");
      navigate(`/status?transactionId=${transaction.id}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <RevealSection className="page-header">
        <div>
          <p className="eyebrow">Payment</p>
          <h1>Launch a country-aware checkout.</h1>
          <p className="muted-copy">
            {isGuest
              ? "Guest mode can inspect routing, countries, and pricing behavior. Payment execution stays locked until you register or login."
              : "Authenticated payments stay linked to your account for full dashboard access."}{" "}
            The gateway is locked automatically by country.
          </p>
        </div>
      </RevealSection>

      <RevealSection className="payment-layout" delay={80}>
        <form className="payment-card" onSubmit={handleCheckout}>
          <div className={`payment-access-card ${isGuest ? "guest" : "auth"}`}>
            <div className="payment-profile-row">
              <ProfileAvatar
                src={profile?.user?.avatarUrl}
                label={identityLabel}
                size="md"
                tone={isGuest ? "guest" : profile?.user?.role === "admin" ? "admin" : "default"}
              />
              <div>
                <p className="eyebrow">{isGuest ? "Guest access" : "Registered access"}</p>
                <h2>{accessTitle}</h2>
              </div>
            </div>
            <p className="payment-access-copy">{accessCopy}</p>
            <div className="payment-access-pills">
              <span>{selectedCountry.name}</span>
              <span>
                {selectedCountry.symbol} {currency}
              </span>
              <span>{gatewayLabel(gateway)}</span>
            </div>
            {isGuest ? (
              <div className="payment-access-links">
                <Link className="ghost-button" to="/login">
                  Login
                </Link>
                <Link className="ghost-button" to="/register">
                  Register
                </Link>
              </div>
            ) : null}
          </div>

          <div className="field">
            <span>Country</span>
            <div className="country-switcher" role="radiogroup" aria-label="Choose a country">
              {COUNTRIES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={item.code === country ? "country-option active" : "country-option"}
                  onClick={() => handleCountryChange(item.code)}
                >
                  <span className="country-option-code">{item.code}</span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.symbol} {item.currency}
                  </small>
                </button>
              ))}
            </div>
          </div>

          <label className="field">
            <span>Amount</span>
            <div className="amount-input-shell">
              <span className="amount-prefix">{selectedCountry.symbol}</span>
              <input
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />
              <span className="amount-code">{currency}</span>
            </div>
          </label>

          <div
            key={country}
            className={isStripeRoute ? "gateway-preview gateway-preview-placeholder" : "gateway-preview"}
          >
            <p className="eyebrow">Auto-selected gateway</p>
            <h2>{gatewayLabel(gateway)}</h2>
            <div className="gateway-preview-grid">
              <div className="gateway-preview-row">
                <span>Settlement</span>
                <strong>{selectedCountry.name}</strong>
              </div>
              <div className="gateway-preview-row">
                <span>Charge</span>
                <strong>{formatCountryAmount(displayAmount, country)}</strong>
              </div>
              <div className="gateway-preview-row">
                <span>Currency</span>
                <strong>
                  {selectedCountry.symbol} {currency}
                </strong>
              </div>
              <div className="gateway-preview-row">
                <span>Route state</span>
                <strong>{isStripeRoute ? "Preview only" : isManualRoute ? "Local manual flow" : "Local demo checkout"}</strong>
              </div>
            </div>
            <p className="gateway-state">
              {isStripeRoute
                ? "Stripe stays visible for US and UK as a routing preview, and this frontend-only project records a local demo transaction instead of calling an API."
                : "India now uses a local manual flow. The Razorpay integration has been removed, and checkout is simulated locally without calling any Razorpay API."}
            </p>
          </div>

          {message ? (
            <div className="message info payment-feedback" aria-live="polite">
              {message}
            </div>
          ) : null}
          {error ? (
            <div className="message error payment-feedback" aria-live="polite">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className={`primary-button wide payment-cta ${isGuest ? "is-locked" : ""} ${isStripeRoute ? "is-placeholder" : ""}`}
            disabled={busy}
          >
            {busy
              ? "Processing..."
              : isGuest
                ? "Register or login to pay"
                : isStripeRoute
                ? "Save Stripe demo transaction"
                : `Create ${formatCountryAmount(displayAmount, country)} manual payment`}
          </button>
        </form>

        <aside key={`payment-side-${country}`} className="payment-sidecard">
          <p className="eyebrow">Routing integrity</p>
          <h3>One country. One gateway.</h3>
          <div className="payment-side-grid">
            <div className="payment-side-row">
              <span>Selected country</span>
              <strong>{selectedCountry.name}</strong>
            </div>
            <div className="payment-side-row">
              <span>Selected gateway</span>
              <strong>{gatewayLabel(gateway)}</strong>
            </div>
            <div className="payment-side-row">
              <span>Displayed price</span>
              <strong>{formatCountryAmount(displayAmount, country)}</strong>
            </div>
            <div className="payment-side-row">
              <span>Execution mode</span>
              <strong>
                {isGuest ? "Preview only" : isStripeRoute ? "Placeholder only" : "Manual local flow"}
              </strong>
            </div>
          </div>
          <p className="muted-copy">
            Country selection auto-switches the route instantly. No alternate gateway choices are
            shown because the system enforces a strict country-to-gateway map.
          </p>
        </aside>
      </RevealSection>
    </AppShell>
  );
}
