"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { verifyOTP } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2, MessageSquareCode } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function OtpForm() {
    const [loading, setLoading] = useState(false);
    const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();

    const handleChange = (index: number, value: string) => {
        // Allow only digits
        if (!/^\d*$/.test(value)) return;

        const newDigits = [...digits];

        // Handle paste
        if (value.length > 1) {
            const pasted = value.slice(0, 6).split("");
            pasted.forEach((char, i) => {
                if (i < 6) newDigits[i] = char;
            });
            setDigits(newDigits);
            const nextIndex = Math.min(pasted.length, 5);
            inputRefs.current[nextIndex]?.focus();
            return;
        }

        newDigits[index] = value;
        setDigits(newDigits);

        // Auto-advance
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = digits.join("");
        if (code.length < 6) {
            toast.error("Please enter the full 6-digit code.");
            return;
        }
        try {
            setLoading(true);
            await verifyOTP(code);
            toast.success("Successfully signed in!");
            router.push("/");
        } catch (error: any) {
            toast.error(error.message || "Invalid OTP code. Please try again.");
            setDigits(Array(6).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            {/* Icon Header */}
            <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                    <MessageSquareCode className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-1">Verify Phone</h2>
                <p className="text-slate-500 text-sm">Enter the 6-digit code sent to your phone</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 6-Box OTP Input */}
                <div className="flex gap-2 justify-center">
                    {digits.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => { inputRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onFocus={(e) => e.target.select()}
                            className={`w-11 h-14 text-center text-xl font-bold rounded-xl border transition-all duration-200 
                                bg-slate-900/5 text-slate-900 outline-none
                                ${digit
                                    ? "border-primary shadow-[0_0_12px_rgba(225,29,72,0.3)]"
                                    : "border-slate-200 focus:border-primary/60"
                                }`}
                        />
                    ))}
                </div>

                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold h-12 rounded-xl"
                    disabled={loading || digits.join("").length < 6}
                >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {loading ? "Verifying..." : "Verify & Sign In"}
                </Button>
            </form>
        </motion.div>
    );
}
