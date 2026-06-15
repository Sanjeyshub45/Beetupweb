"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneAuthForm } from "@/components/auth/PhoneAuthForm";
import { OtpForm } from "@/components/auth/OtpForm";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";
import { useAuthStore } from "@/store/authStore";
import { Smartphone, ShieldCheck, Zap, Users, CalendarCheck } from "lucide-react";

const features = [
    { icon: <CalendarCheck className="w-5 h-5 text-blue-600" />, text: "Discover local & national events" },
    { icon: <Zap className="w-5 h-5 text-yellow-500" />, text: "Instant ticket booking & management" },
    { icon: <Users className="w-5 h-5 text-indigo-500" />, text: "Connect with your community" },
];

export default function AuthPage() {
    // Custom state for layout completely replacing buggy Tabs
    const [authMode, setAuthMode] = useState<"user" | "admin">("user");
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const { user, loading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading || user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white overflow-hidden">
            {/* ─── LEFT HERO PANEL (desktop only) ─── */}
            <div className="hidden lg:flex lg:w-[50%] xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-r border-slate-200">

                {/* Decorative Elements */}
                <div className="absolute inset-0 pattern-dots pattern-slate-200 pattern-bg-transparent pattern-size-4 pattern-opacity-40" />
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-100/40 blur-[100px] pointer-events-none" />

                {/* Top — Logo */}
                <div className="relative z-10 block">
                    <img
                        src="/beetuplogo.png"
                        alt="Beetup by Fnext"
                        className="h-20 w-auto object-contain"
                        draggable={false}
                    />
                </div>

                {/* Middle — Hero copy */}
                <div className="relative z-10 max-w-lg mt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <h1 className="text-5xl xl:text-6xl font-extrabold leading-[1.1] mb-6 text-slate-900 tracking-tight">
                            Discover &amp; join<br />
                            <span className="text-blue-600">
                                amazing events
                            </span>
                        </h1>
                        <p className="text-slate-500 text-lg mb-12 leading-relaxed font-medium">
                            Your gateway to the best events in your city. Sign in securely with your phone — no passwords needed.
                        </p>

                        <div className="space-y-4">
                            {features.map((f, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.12 }}
                                    className="flex items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center flex-shrink-0">
                                        {f.icon}
                                    </div>
                                    <span className="text-slate-700 font-bold text-[15px]">{f.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom — decorative footer */}
                <div className="relative z-10 mt-auto pt-12 flex items-center gap-4 opacity-60">
                    <ShieldCheck className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-500 text-sm font-semibold tracking-wide">Secure Login Powered by Firebase</span>
                </div>
            </div>

            {/* ─── RIGHT FORM PANEL ─── */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative bg-white">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-[420px] relative z-10"
                >
                    {/* Mobile logo only */}
                    <div className="lg:hidden flex justify-center mb-10 w-full">
                        <img
                            src="/beetuplogo.png"
                            alt="Beetup by Fnext"
                            className="h-16 w-auto object-contain"
                            draggable={false}
                        />
                    </div>

                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h2>
                        <p className="text-slate-500 text-sm font-medium">Enter your details to sign in to your account</p>
                    </div>

                    {/* Custom Toggle Switch */}
                    <div className="flex p-1 bg-slate-100 rounded-2xl mb-10 shadow-inner border border-slate-200/60">
                        <button
                            onClick={() => setAuthMode("user")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${authMode === "user"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <Smartphone className="w-4 h-4" /> User
                        </button>
                        <button
                            onClick={() => setAuthMode("admin")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${authMode === "admin"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <ShieldCheck className="w-4 h-4" /> Admin
                        </button>
                    </div>

                    {/* Forms rendered based on toggle state */}
                    <div className="min-h-[250px] relative">
                        <AnimatePresence mode="wait">
                            {authMode === "user" ? (
                                <motion.div
                                    key="user-auth"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <AnimatePresence mode="wait">
                                        {step === "phone" ? (
                                            <PhoneAuthForm key="phone" onOTPSent={() => setStep("otp")} />
                                        ) : (
                                            <OtpForm key="otp" />
                                        )}
                                    </AnimatePresence>

                                    {step === "otp" && (
                                        <button
                                            onClick={() => setStep("phone")}
                                            className="mt-6 text-sm font-semibold text-slate-400 hover:text-slate-800 transition-colors w-full text-center"
                                        >
                                            ← Use a different phone number
                                        </button>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="admin-auth"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <EmailAuthForm />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <p className="text-center text-slate-400 text-xs mt-12 bg-white pt-4">
                        By continuing, you agree to our <a href="#" className="font-semibold text-slate-500 hover:text-slate-900 underline underline-offset-2">Terms of Service</a> & <a href="#" className="font-semibold text-slate-500 hover:text-slate-900 underline underline-offset-2">Privacy Policy</a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
