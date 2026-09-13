import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const user = localStorage.getItem("user");

  // Already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not logged in
  return children;
}

export default PublicRoute;