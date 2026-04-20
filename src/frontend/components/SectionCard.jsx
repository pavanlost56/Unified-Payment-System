export default function SectionCard({ title, eyebrow, locked = false, children }) {
  return (
    <section className="section-card">
      <div className="section-head">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>

      <div className={locked ? "section-body blurred" : "section-body"}>{children}</div>

      {locked ? (
        <div className="locked-overlay">
          <span className="locked-badge">Guest mode</span>
          <strong>Available for registered users</strong>
          <p>Sign in to unlock deeper transaction detail and account-linked history.</p>
        </div>
      ) : null}
    </section>
  );
}
