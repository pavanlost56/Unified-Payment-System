import { Navigate, Route, Routes } from "react-router-dom";
import RouteGate from "./components/RouteGate.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Payment from "./pages/Payment.jsx";
import Register from "./pages/Register.jsx";
import Status from "./pages/Status.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <RouteGate>
            <Dashboard />
          </RouteGate>
        }
      />
      <Route
        path="/payment"
        element={
          <RouteGate>
            <Payment />
          </RouteGate>
        }
      />
      <Route
        path="/status"
        element={
          <RouteGate>
            <Status />
          </RouteGate>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

