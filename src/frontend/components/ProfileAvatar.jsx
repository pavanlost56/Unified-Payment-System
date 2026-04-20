const palette = [
  ["#8f9eff", "#c3cafc", "#4a538a"],
  ["#9bc2ff", "#dce6ff", "#45618e"],
  ["#9bb8a2", "#d2dfd7", "#4e6657"],
  ["#c6a98f", "#ede2d7", "#7d6651"],
  ["#b3a1cb", "#e2daf0", "#67557e"]
];

const hashSeed = (value = "") =>
  value.split("").reduce((total, character, index) => total + character.charCodeAt(0) * (index + 17), 0);

const getInitials = (label = "") => {
  const cleaned = label.trim();

  if (!cleaned) {
    return "UP";
  }

  if (cleaned.includes("@")) {
    return cleaned.slice(0, 2).toUpperCase();
  }

  const parts = cleaned.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

const buildPattern = (seedValue) => {
  const seed = hashSeed(seedValue);
  const cells = [];

  for (let row = 0; row < 5; row += 1) {
    const sourceRow = [];

    for (let column = 0; column < 3; column += 1) {
      const index = row * 3 + column;
      sourceRow.push(((seed >> (index % 12)) + seed + row * 11 + column * 7) % 3 !== 0);
    }

    const fullRow = [sourceRow[0], sourceRow[1], sourceRow[2], sourceRow[1], sourceRow[0]];
    cells.push(...fullRow);
  }

  return cells;
};

export default function ProfileAvatar({
  src = "",
  label = "",
  size = "md",
  tone = "default"
}) {
  const seed = label || "Unified Payment System";
  const [accent, highlight, shadow] = palette[hashSeed(seed) % palette.length];
  const cells = buildPattern(seed);
  const initials = getInitials(label);

  return (
    <div
      className={`profile-avatar profile-avatar-${size} tone-${tone}`}
      style={{
        "--avatar-accent": accent,
        "--avatar-highlight": highlight,
        "--avatar-shadow": shadow
      }}
      aria-label={label || "Profile avatar"}
    >
      {src ? (
        <img src={src} alt={label || "Profile avatar"} className="profile-avatar-image" />
      ) : (
        <>
          <div className="profile-avatar-grid" aria-hidden="true">
            {cells.map((active, index) => (
              <span
                key={`${seed}-${index}`}
                className={active ? "profile-avatar-pixel active" : "profile-avatar-pixel"}
              />
            ))}
          </div>
          <span className="profile-avatar-initials" aria-hidden="true">
            {initials}
          </span>
        </>
      )}
    </div>
  );
}
