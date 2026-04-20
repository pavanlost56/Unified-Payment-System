import { createContext, useContext, useState } from "react";
import { ensureDemoState } from "../lib/demoData.js";

const SESSION_KEY = "ups.session";
const SessionContext = createContext(null);

const readStoredSession = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null");
  } catch (_error) {
    return null;
  }
};

export function SessionProvider({ children }) {
  ensureDemoState();
  const [profile, setProfile] = useState(() => readStoredSession());
  const [status, setStatus] = useState("ready");

  const finishAuth = ({ user }) => {
    const nextProfile = {
      mode: "authenticated",
      user
    };

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextProfile));
    setProfile(nextProfile);
    setStatus("ready");
  };

  const enterDemo = () => {
    const nextProfile = {
      mode: "guest",
      user: {
        label: "Guest User"
      }
    };

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextProfile));
    setProfile(nextProfile);
    setStatus("ready");
  };

  const logout = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setProfile(null);
    setStatus("ready");
  };

  return (
    <SessionContext.Provider
      value={{
        profile,
        status,
        isGuest: profile?.mode === "guest",
        finishAuth,
        enterDemo,
        logout
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
