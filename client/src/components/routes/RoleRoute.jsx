import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

/**
 * roles: array of allowed roles
 * Example: <RoleRoute roles={['admin','owner','kosadhokko']} />
 */
export default function RoleRoute({ roles }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />; // Unauthorized user → normal dashboard
  }

  return <Outlet />;
}
