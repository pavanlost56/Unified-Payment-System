import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import AppShell from "../components/AppShell.jsx";
import AuthCard from "../components/AuthCard.jsx";
import { useSession } from "../components/SessionProvider.jsx";
import { loginDemoUser } from "../lib/demoData.js";

export default function Login() {
  const navigate = useNavigate();
  const { finishAuth, profile } = useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (profile) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (values) => {
    setBusy(true);
    setError("");

    try {
      const response = loginDemoUser(values);
      finishAuth(response);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to unlock full analytics, transaction drilldowns, and account-bound payment history."
        submitLabel="Login"
        alternateText="Need an account?"
        alternateLabel="Register"
        alternateLink="/register"
        onSubmit={handleSubmit}
        busy={busy}
        error={error}
      />
    </AppShell>
  );
}
