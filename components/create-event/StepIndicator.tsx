"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
    currentStep: number;
    totalSteps?: number; // always 6 steps
}

const allSteps = [
    { num: 1, label: "Basic Details" },
    { num: 2, label: "Visuals" },
    { num: 3, label: "Date & Location" },
    { num: 4, label: "People" },
    { num: 5, label: "Tickets" },
    { num: 6, label: "Details" },
];

export function StepIndicator({ currentStep, totalSteps = 6 }: StepIndicatorProps) {
    const steps = allSteps.slice(0, totalSteps);
    return (
        <div className="w-full py-6 mb-8 overflow-x-auto">
            <div className="min-w-[700px] flex items-center justify-between relative px-4">
                {/* Background connecting line */}
                <div className="absolute top-1/2 left-8 right-8 h-1 bg-white/10 -translate-y-1/2 rounded-full z-0"></div>

                {/* Active connecting line */}
                <motion.div
                    className="absolute top-1/2 left-8 h-1 bg-slate-900 -translate-y-1/2 rounded-full z-0"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.max(0, (currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ right: '2rem' }} // Account for right padding
                />

                {steps.map((step) => {
                    const isActive = step.num === currentStep;
                    const isCompleted = step.num < currentStep;

                    return (
                        <div key={step.num} className="flex flex-col items-center relative z-10 gap-3 min-w-[100px]">
                            <motion.div
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${isActive
                                    ? "bg-white border-2 border-slate-900 text-slate-900"
                                    : isCompleted
                                        ? "bg-black border border-black text-white"
                                        : "bg-slate-50 border border-slate-200 text-slate-400"
                                    }`}
                                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                            >
                                {step.num}
                            </motion.div>

                            <span className={`text-xs font-medium text-center whitespace-nowrap transition-colors ${isActive ? "text-primary" : isCompleted ? "text-slate-900 font-semibold" : "text-slate-500"
                                }`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
