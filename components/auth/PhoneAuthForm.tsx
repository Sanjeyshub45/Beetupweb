"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setupRecaptcha, sendOTP } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

interface PhoneAuthFormProps {
    onOTPSent: () => void;
}

export function PhoneAuthForm({ onOTPSent }: PhoneAuthFormProps) {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<{ phone: string }>();

    const onSubmit = async (data: { phone: string }) => {
        try {
            setLoading(true);
            const formattedPhone = data.phone.startsWith("+") ? data.phone : `+91${data.phone}`;
            const appVerifier = setupRecaptcha("recaptcha-container");
            if (!appVerifier) {
                toast.error("Recaptcha failed to initialize. Please refresh and try again.");
                return;
            }
            await sendOTP(formattedPhone, appVerifier);
            toast.success("OTP sent via SMS");
            onOTPSent();
        } catch (error: any) {
            toast.error(error.message || "Failed to send OTP. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
        >
            {/* Icon Header */}
            <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>
                <p className="text-slate-500 text-sm">Enter your phone number to sign in or create an account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>

                    {/* Input with +91 prefix badge */}
                    <div className="flex gap-2">
                        <div className="flex items-center px-3 bg-slate-900/5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 whitespace-nowrap select-none">
                            🇮🇳 +91
                        </div>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="9876543210"
                            className="bg-slate-900/5 border-slate-200 rounded-xl h-11 flex-1"
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Please enter a valid 10-digit number"
                                }
                            })}
                        />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                {/* Invisible recaptcha */}
                <div id="recaptcha-container" className="hidden"></div>

                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold h-12 rounded-xl"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {loading ? "Sending..." : "Send OTP"}
                </Button>
            </form>
        </motion.div>
    );
}
