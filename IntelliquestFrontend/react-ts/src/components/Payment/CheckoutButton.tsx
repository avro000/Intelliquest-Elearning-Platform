import { useState } from "react";
import { loadRazorpayScript } from "../../utils/loadRazorpay";
import { Button } from "../ui/button";
import { toast } from "sonner";

const CheckoutButton = ({ userEmail, courseId, price, className }: {
  userEmail: string;
  courseId: number;
  price: number;
  className?: string;
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async () => {
        setIsLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first", {
                description: "You must be logged in to purchase a course.",
                style: {
                    backgroundColor: "#dc2626",
                    color: "white",
                },
            });
            setIsLoading(false);
            return;
        }

        const res = await loadRazorpayScript();
        if (!res) {
            toast.error("Failed to load Razorpay SDK", {
                description: "Please check your internet connection.",
                style: {
                    backgroundColor: "#dc2626",
                    color: "white",
                },
            });
            setIsLoading(false);
            return;
        }

        try {
            const orderResponse = await fetch(
                `http://localhost:9092/auth/payment/create-order?amount=${price}`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!orderResponse.ok) {
                const errData = await orderResponse.json().catch(() => null);
                throw new Error(errData?.message || errData?.error || "Order creation failed");
            }

            const order = await orderResponse.json();

            if (order.status !== "created") {
                toast.error("Failed to create order", {
                    description: "Please try again later.",
                    style: {
                        backgroundColor: "#dc2626",
                        color: "white",
                    },
                });
                setIsLoading(false);
                return;
            }

            const options = {
                key: "rzp_test_DHZhCgGEIBimZS",
                amount: order.amount,
                currency: order.currency,
                name: "IntelliQuest",
                description: "Course Payment",
                order_id: order.id,
                handler(response: any) {
                    toast.success("Payment successful!", {
                        description: "Thank you for your purchase.",
                        style: {
                            backgroundColor: "#16a34a",
                            color: "white",
                        },
                    });

                    const paymentDetails = {
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        userEmail,
                        courseId,
                    };

                    fetch("http://localhost:9092/auth/payment/complete-payment", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(paymentDetails),
                    })
                        .then((res) => res.text())
                        .then((data) => {
                            toast.success("Payment recorded!", {
                                description: data || "Course access granted.",
                                style: {
                                    backgroundColor: "#16a34a",
                                    color: "white",
                                },
                            });
                        })
                        .catch((error) => {
                            toast.error("Error recording payment", {
                                description: error || "Please contact support.",
                                style: {
                                    backgroundColor: "#dc2626",
                                    color: "white",
                                },
                            });
                        });
                },
                prefill: {
                    email: userEmail,
                },
                theme: {
                    color: "#3399cc",
                },
                modal: {
                    ondismiss: () => {
                        setIsLoading(false); 
                    },
                },
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
        } catch (error) {
            toast.error("Payment process failed", {
                description: "Please try again later.",
                style: {
                    backgroundColor: "#dc2626",
                    color: "white",
                },
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <Button onClick={handlePayment} disabled={isLoading} className={className}>
      {isLoading ? <span className="loader mr-2" /> : null}
      {isLoading ? "Processing..." : "Buy Course"}
    </Button>
  );
};

export default CheckoutButton;