import { Link, NavLink } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar.jsx";
import { useSession } from "./SessionProvider.jsx";

export default function AppShell({ children }) {
  const { profile, logout, isGuest } = useSession();
  const isAdmin = profile?.user?.role === "admin";
  const identityLabel = isGuest ? profile?.user?.label || "Guest User" : profile?.user?.email || "Account";
  const identityMeta = isGuest
    ? "Preview routing only"
    : isAdmin
      ? "Admin account"
      : "Registered user";

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          Unified Payment System
        </Link>

        <div className="topbar-actions">
          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Home
            </NavLink>
            {profile ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/payment"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  Payment
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>

          {profile ? (
            <div className="session-actions">
              <div className={`session-badge session-identity ${isGuest ? "guest" : "auth"}`}>
                <ProfileAvatar
                  src={profile.user.avatarUrl}
                  label={identityLabel}
                  size="sm"
                  tone={isGuest ? "guest" : isAdmin ? "admin" : "default"}
                />
                <span className="session-copy">
                  <strong>{identityLabel}</strong>
                  <small>{identityMeta}</small>
                </span>
              </div>
              <button type="button" className="ghost-button" onClick={logout}>
                {isGuest ? "Exit demo" : "Sign out"}
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="page-frame">{children}</main>
    </div>
  );
}
