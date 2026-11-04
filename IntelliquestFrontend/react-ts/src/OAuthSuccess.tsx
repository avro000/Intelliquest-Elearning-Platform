import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./AuthContext";

type JwtPayload = {
  role: string;
};

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      const token = params.get("token");
      if (token) {
        localStorage.setItem("token", token);
        // Clean sensitive token query param from URL and browser history immediately
        window.history.replaceState({}, document.title, window.location.pathname);

        try {
          const user = await refreshUser();
          const decoded: JwtPayload = jwtDecode(token);
          const role = user?.role || decoded.role;

          switch (role) {
            case "ADMIN":
              navigate("/AdminDashboard");
              break;
            case "INSTRUCTOR":
              navigate("/InstructorDashboard");
              break;
            case "USER":
              navigate("/UserDashboard");
              break;
            default:
              navigate("/");
          }
        } catch (error) {
          console.error("Error decoding token in OAuthSuccess:", error);
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };

    handleAuth();
  }, [params, navigate, refreshUser]);

  return <p>Redirecting...</p>;
}
