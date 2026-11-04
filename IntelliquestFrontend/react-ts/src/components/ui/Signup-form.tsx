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
import { toast } from "sonner";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match", {
                description: "Please ensure both passwords are the same.",
                style: {
                    backgroundColor: "#dc2626",
                    color: "white",
                },
            });
            return;
        }
        try {
            const response = await axios.post("http://localhost:9092/auth/register", {
                username,
                email,
                password,
            });
            console.log("Signup Response:", response.data);
              
            toast.success("Signup successful! Redirecting...", {
                description: "Please wait while we redirect you.",
                style: {
                    backgroundColor: "#16a34a",
                    color: "white",
                },
            });
            setTimeout(() => {
                navigate("/login");
            }, 4000);
        } catch (err: any) {
            console.error("Signup error (full):", err);

            let errorMessage = "Signup failed. Please try again.";

            if (err?.response) {
                if (typeof err.response.data === "string") {
                    errorMessage = err.response.data;
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                }
            }
            toast.error(errorMessage, {
                description: "Please try again with valid details.",
                style: {
                    backgroundColor: "#dc2626",
                    color: "white",
                },
            });
        }
    };
    console.log("Sending payload:", {
        username,
        email,
        password
      });
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create an Account</CardTitle>
                    <CardDescription>Sign up to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup}>
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Your Name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

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
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-center">
                            </div>
                            <Button type="submit" className="w-full">Sign Up</Button>
                        </div>
                    </form>
                    <div className="text-center text-sm mt-4">
                        Already have an account? {" "}
                        <a href="/login" className="hover:underline">
                            Login
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}