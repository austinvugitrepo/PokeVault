import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// This is a bouncer for pages. Wrap a page in it in App.js and
// only logged-in people can see it. Everyone else gets sent to /login.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Wait for the server to answer first, or logged-in people would
  // flash over to the login page for a second on every refresh.
  if (loading) {
    return <p style={{ padding: "2rem" }}>Checking your session…</p>;
  }

  // Not logged in: go to login, but remember the page they wanted
  // so we can send them back there afterward.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
}
