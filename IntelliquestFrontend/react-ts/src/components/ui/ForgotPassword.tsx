import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./input-otp";
import { GraduationCapIcon } from "lucide-react";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        if (step === 2 && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [step, timer]);

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:9092/auth/forgot-password", { email });
            toast.success("OTP sent", {
                description: res.data,
                style: {
                    backgroundColor: "#16a34a",
                    color: "white",
                },
            });
            setStep(2);
            setTimer(30);    
            setOtp("");       
        } catch (error: any) {
            toast.error("Error sending OTP", {
                description: error.response?.data || "Please try again.",
                style: {
                    backgroundColor: "#dc2626",
                    color: "white",
                },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:9092/auth/verify-otp", { email, otp });
            toast.success("OTP verified", {
                description: res.data,
                style: {
                    backgroundColor: "#16a34a",
                    color: "white",
                },
            });
            setStep(3);
        } catch (error: any) {
            toast.error("Invalid OTP", {
                description: error.response?.data || "Please try again.",
                style: {
                    backgroundColor: "#dc2626",
                    color: "white",
                },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:9092/auth/reset-password", {
                email,
                newPassword,
            });
            toast.success("Password reset successful", {
                description: res.data,
                style: {
                    backgroundColor: "#16a34a",
                    color: "white",
                },
            });
            navigate("/");
        } catch (error: any) {
            toast.error("Reset failed", {
                description: error.response?.data || "Please try again.",
                style: {
                    backgroundColor: "#dc2626",
                    color: "white",
                },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted flex flex-col items-center justify-center px-4">
            <a href="/" className="flex items-center gap-2 font-medium mb-6">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <GraduationCapIcon className="size-4" />
                </div>
                Intelliquest.
            </a>
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">Forgot Password</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {step === 1 && (
                        <>
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                />
                            </div>
                            <Button onClick={handleSendOtp} disabled={loading}>
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        Sending
                                        <div className="loader" />
                                    </div>
                                ) : (
                                    "Send OTP"
                                )}
                            </Button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="flex justify-between items-center mb-2">
                                <Label>One-Time Password</Label>
                            </div>

                            <div className="grid gap-2">
                                <InputOTP
                                    maxLength={6}
                                    value={otp}
                                    onChange={(value) => setOtp(value)}
                                    disabled={timer <= 0}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>

                                <label className="text-sm text-muted-foreground">
                                    Please enter the one-time password sent to your Email.
                                </label>

                                <span className="text-sm text-destructive-foreground">
                                    {`${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`}
                                </span>

                                {timer <= 0 && (
                                    <Button
                                        variant="secondary"
                                        className="w-fit mt-2"
                                        onClick={handleSendOtp}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                Resending
                                                <div className="loader white-loader" />
                                            </div>
                                        ) : (
                                            "Resend OTP"
                                        )}
                                    </Button>
                                )}
                            </div>

                            <Button onClick={handleVerifyOtp} disabled={loading || timer <= 0}>
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        Verifying
                                        <div className="loader" />
                                    </div>
                                ) : timer <= 0 ? (
                                    "OTP Expired"
                                ) : (
                                    "Verify OTP"
                                )}

                            </Button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="grid gap-2">
                                <Label>New Password</Label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Confirm Password</Label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter new password"
                                />
                            </div>

                            <Button
                                onClick={() => {
                                    if (newPassword !== confirmPassword) {
                                        toast.error("Passwords do not match", {
                                            description: "Please make sure both password fields match.",
                                            style: {
                                                backgroundColor: "#dc2626",
                                                color: "white",
                                            },
                                        });
                                        return;
                                    }
                                    handleResetPassword();
                                }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        Resetting...
                                        <div className="loader" />
                                    </div>
                                ) : (
                                    "Reset Password"
                                )}

                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
