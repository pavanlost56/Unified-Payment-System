import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "./SessionProvider.jsx";

export default function RouteGate({ children }) {
  const location = useLocation();
  const { profile, status } = useSession();

  if (status === "loading") {
    return <div className="screen-state">Preparing your workspace...</div>;
  }

  if (!profile) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}

