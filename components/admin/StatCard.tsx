"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: string;
    delay?: number;
}

export function StatCard({ title, value, icon, trend, delay = 0 }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="bg-white glass rounded-2xl p-6 border border-slate-200 relative overflow-hidden group cursor-default"
        >
            {/* Fixed: hover gradient glow actually visible */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-violet-700/0 group-hover:from-primary/10 group-hover:to-violet-700/5 transition-all duration-500 rounded-2xl" />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-slate-900/5 rounded-xl text-primary group-hover:bg-primary/10 transition-colors duration-300">
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {trend}
                    </span>
                )}
            </div>

            <div className="relative z-10">
                <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
                <p className="text-3xl font-extrabold text-slate-900">{value}</p>
            </div>
        </motion.div>
    );
}
