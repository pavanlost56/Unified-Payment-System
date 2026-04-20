export default function MetricCard({ label, value, tone = "default", note = "", stack = [] }) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <p className="metric-label">{label}</p>
      <h3>{value}</h3>
      {note ? <p className="metric-note">{note}</p> : null}
      {stack.length ? (
        <div className="metric-stack">
          {stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
