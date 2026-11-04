import { API_BASE_URL } from "@/api/config";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useAuth } from "@/AuthContext";
import { FcGoogle } from "react-icons/fc";


export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUserRole, setProfileImage, refreshUser } = useAuth();



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:9092/auth/login", {
        email,
        password,
      });

      if (response.data && typeof response.data === "string") {
        const token = response.data;
        localStorage.setItem("token", token);

        const decoded: { role: string; sub: string } = jwtDecode(token);
        const user = await refreshUser();
        const role = user?.role || decoded.role;

        setUserRole(role);

        // ✅ Navigate only after setting user state
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
            toast.error("Unknown role. Please contact support.", {
              description: "Role is not specified correctly.",
              style: { backgroundColor: "#dc2626", color: "white" },
            });
        }
      } else {
        toast.error("Invalid credentials.", {
          description: "Please check your email and password.",
          style: { backgroundColor: "#dc2626", color: "white" },
        });
      }
    } catch (err: any) {
      const backendMsg =
        err.response?.data || "Login failed. Please check your credentials.";
      toast.error(backendMsg, {
        description: "Please try again.",
        style: { backgroundColor: "#dc2626", color: "white" },
      });
      console.error("Login error:", err);
    }
  };


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
                  }}
                >

                  <FcGoogle className="w-5 h-5" />
                  Login with Google
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="ml-auto text-sm hover:underline cursor-pointer"
                    >
                      Forgot your password?
                    </button>

                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
