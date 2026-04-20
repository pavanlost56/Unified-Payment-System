import { Link } from "react-router-dom";

export default function AuthCard({
  title,
  subtitle,
  submitLabel,
  alternateLabel,
  alternateLink,
  alternateText,
  onSubmit,
  busy,
  error
}) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await onSubmit({
      email: formData.get("email"),
      password: formData.get("password")
    });
  };

  return (
    <section className="auth-card">
      <div className="auth-copy">
        <p className="eyebrow">Secure access</p>
        <h1>{title}</h1>
        <p className="muted-copy">{subtitle}</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" placeholder="founder@company.com" required />
        </label>

        <label className="field">
          <span>Password</span>
          <input name="password" type="password" placeholder="Minimum 8 characters" required minLength="8" />
        </label>

        {error ? <p className="message error">{error}</p> : null}

        <button type="submit" className="primary-button wide" disabled={busy}>
          {busy ? "Please wait..." : submitLabel}
        </button>
      </form>

      <p className="auth-switch">
        {alternateText} <Link to={alternateLink}>{alternateLabel}</Link>
      </p>
    </section>
  );
}

