import { statusLabel } from "../lib/format.js";

export default function StatusPill({ status }) {
  return <span className={`status-pill ${status}`}>{statusLabel(status)}</span>;
}

