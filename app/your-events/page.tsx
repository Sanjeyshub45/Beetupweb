"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Search } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useUserEvents } from "@/hooks/useUserEvents";
import { EventCard } from "@/components/events/EventCard";
import { Input } from "@/components/ui/input";

export default function YourEventsPage() {
    const router = useRouter();
    const { user, isAdmin, loading: authLoading } = useAuthStore();
    const { data: events, isLoading: eventsLoading } = useUserEvents(user?.uid);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/auth");
            } else if (isAdmin) {
                router.push("/admin");
            }
        }
    }, [user, isAdmin, authLoading, router]);

    if (authLoading || (user && eventsLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null; // Prevent flash before redirect

    return (
        <div className="min-h-screen bg-slate-50 pt-40 pb-16 px-6">
            <div className="container mx-auto max-w-7xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Your Events</h1>
                        <p className="text-slate-500">Manage and track the events you've created.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                placeholder="Search events..."
                                className="pl-10 bg-slate-900/5 border-slate-200 w-full"
                            />
                        </div>
                        <Link
                            href="/create-event"
                            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors whitespace-nowrap"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Create Event
                        </Link>
                    </div>
                </div>

                {/* Content */}
                {(!events || events.length === 0) ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 bg-white glass border border-slate-200 rounded-3xl text-center px-6"
                    >
                        <div className="w-24 h-24 mb-6 rounded-full bg-slate-900/5 flex items-center justify-center relative">
                            <PlusCircle className="w-10 h-10 text-primary opacity-50" />
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                        </div>
                        <h2 className="text-2xl font-bold mb-3">No events yet</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">
                            Looks like you haven't created any events yet. Host your first event and start managing it right here.
                        </p>
                        <Link
                            href="/create-event"
                            className="px-8 py-3 bg-white text-bg-dark font-bold rounded-full hover:bg-gray-200 transition-colors shadow-lg"
                        >
                            Start Creating
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {events.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <EventCard event={event} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
