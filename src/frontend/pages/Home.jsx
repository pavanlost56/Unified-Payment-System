import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import RevealSection from "../components/RevealSection.jsx";
import SystemFlow from "../components/SystemFlow.jsx";
import { useSession } from "../components/SessionProvider.jsx";
import { COUNTRIES } from "../lib/constants.js";
import { gatewayLabel } from "../lib/format.js";

export default function Home() {
  const navigate = useNavigate();
  const { enterDemo, profile } = useSession();

  const handleTryDemo = () => {
    enterDemo();
    navigate("/dashboard");
  };

  return (
    <AppShell>
      <RevealSection className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Premium payment orchestration</p>
          <h1>One command center for India, the US, and the UK.</h1>
          <p className="hero-text">
            Unified Payment System routes every checkout through the right gateway, carries the
            right currency context, and now demonstrates the full flow locally without relying on
            an integrated API.
          </p>

          <div className="button-row">
            {profile ? (
              <>
                <Link className="primary-button" to="/dashboard">
                  Open dashboard
                </Link>
                <Link className="ghost-button" to="/payment">
                  Create payment
                </Link>
              </>
            ) : (
              <>
                <Link className="primary-button" to="/register">
                  Create account
                </Link>
                <Link className="ghost-button" to="/login">
                  Login
                </Link>
                <button type="button" className="ghost-button" onClick={handleTryDemo}>
                  Try Demo
                </button>
              </>
            )}
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-stat">
            <span>System behavior</span>
            <strong>Country-aware routing</strong>
          </div>
          <div className="hero-stat">
            <span>India</span>
            <strong>Manual domestic path</strong>
          </div>
          <div className="hero-stat">
            <span>US / UK</span>
            <strong>Stripe routing preview</strong>
          </div>
        </div>
      </RevealSection>

      <RevealSection>
        <SystemFlow />
      </RevealSection>

      <RevealSection className="country-grid" delay={80}>
        {COUNTRIES.map((country) => (
          <article key={country.code} className="country-card">
            <p className="eyebrow">{country.code}</p>
            <h3>{country.name}</h3>
            <p className="country-gateway">{gatewayLabel(country.gateway)}</p>
            <div className="country-meta">
              <span>
                {country.symbol} {country.currency}
              </span>
              <span>{country.availability === "live" ? "Live route" : "Initialization route"}</span>
            </div>
          </article>
        ))}
      </RevealSection>
    </AppShell>
  );
}
