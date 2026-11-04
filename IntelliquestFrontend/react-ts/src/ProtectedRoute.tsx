// ProtectedRoute.tsx
import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

  try {
    const decoded: { role: string } = jwtDecode(token);
    const userRole = decoded.role;


    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/" />;
    }

    return <Outlet />;
  } catch (err) {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
