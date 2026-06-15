"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAdmin, ADMIN_EMAIL } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function EmailAuthForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            await loginAdmin(data.email, data.password);
            if (data.email === ADMIN_EMAIL) {
                toast.success("Admin login successful");
                router.push("/admin");
            } else {
                toast.success("Login successful");
                router.push("/");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to sign in. Check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
        >
            {/* Shield Icon Header */}
            <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-1">Admin Portal</h2>
                <p className="text-slate-500 text-sm">Sign in with your administrator credentials</p>

                {/* Restricted Access Badge */}
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse inline-block" />
                    Restricted Access — Authorised Personnel Only
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        className="bg-slate-900/5 border-slate-200 rounded-xl h-11"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Invalid email format"
                            }
                        })}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email?.message as string}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-slate-900/5 border-slate-200 rounded-xl h-11"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Minimum 6 characters required" }
                        })}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password?.message as string}</p>}
                </div>

                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold h-12 rounded-xl mt-2"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {loading ? "Signing in..." : "Sign In"}
                </Button>
            </form>
        </motion.div>
    );
}
