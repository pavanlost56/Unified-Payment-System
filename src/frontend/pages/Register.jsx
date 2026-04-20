import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import AuthCard from "../components/AuthCard.jsx";
import { useSession } from "../components/SessionProvider.jsx";
import { registerDemoUser } from "../lib/demoData.js";

export default function Register() {
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
      const response = registerDemoUser(values);
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
        title="Create your operator account"
        subtitle="Register once to keep transactions linked to your identity and remove guest limits across the dashboard."
        submitLabel="Register"
        alternateText="Already registered?"
        alternateLabel="Login"
        alternateLink="/login"
        onSubmit={handleSubmit}
        busy={busy}
        error={error}
      />
    </AppShell>
  );
}
