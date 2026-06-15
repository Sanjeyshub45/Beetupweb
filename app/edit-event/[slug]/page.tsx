"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Edit3 } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useEventFormStore } from "@/store/eventFormStore";
import { useEvent } from "@/hooks/useUserEvents";
import { useUpdateEvent } from "@/hooks/useEventMutations";
import { EventData } from "@/types";

import { Step1BasicDetails } from "@/components/create-event/steps/Step1BasicDetails";
import { Step2Visuals } from "@/components/create-event/steps/Step2Visuals";
import { Step3DateTime } from "@/components/create-event/steps/Step3DateTime";
import { Step4People } from "@/components/create-event/steps/Step4People";
import { Step5Tickets } from "@/components/create-event/steps/Step5Tickets";
import { Step6Details } from "@/components/create-event/steps/Step6Details";

export default function EditEventPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug as string | undefined;
    // slug format: "event-name--firestoreId" — extract the real ID from the end
    const eventId = slug ? slug.split("--").pop() : undefined;

    const { user, isAdmin, loading: authLoading } = useAuthStore();
    const { eventData, setInitialData, resetForm } = useEventFormStore();
    const updateEvent = useUpdateEvent();

    // Fetch the event via React Query (caches it and deduplicates requests)
    const { data: fetchedEvent, isLoading: isFetchingData } = useEvent(eventId);

    // Track whether we've already populated the form to avoid repeated hydration
    const [formReady, setFormReady] = useState(false);

    // Auth guard
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth");
        }
    }, [user, authLoading, router]);

    // Hydrate the Zustand form store once the event loads
    useEffect(() => {
        if (!fetchedEvent || formReady) return;

        // Permission check
        if (fetchedEvent.userId !== user?.uid && !isAdmin) {
            toast.error("You don't have permission to edit this event.");
            router.push("/your-events");
            return;
        }
        // Block regular users from editing a launched (live) event
        if (fetchedEvent.isLaunch && !isAdmin) {
            toast.error("This event is already live and cannot be edited.");
            router.push("/your-events");
            return;
        }

        setInitialData(fetchedEvent as any);
        setFormReady(true);
    }, [fetchedEvent, formReady, user, isAdmin, router, setInitialData]);

    // Clean up form on unmount
    useEffect(() => {
        return () => resetForm();
    }, [resetForm]);

    const handleSubmit = async () => {
        if (!user || !eventId) return;
        try {
            const finalData: Partial<EventData> = JSON.parse(JSON.stringify(eventData));
            await updateEvent.mutateAsync({ eventId, eventData: finalData, isAdmin });
            toast.success("Event updated successfully!");
            router.push(isAdmin ? `/admin` : `/your-events`);
        } catch (error) {
            console.error("Failed to update event:", error);
            toast.error("Failed to update the event. Please ensure all data is valid.");
        }
    };

    if (authLoading || isFetchingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 pt-40 pb-16 px-4 md:px-6 overflow-x-hidden">
            <div className="container mx-auto max-w-[1400px] relative">

                {/* Background blurs */}
                <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

                <div className="relative z-10">
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900/5 border border-slate-200 mb-6 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                        >
                            <Edit3 className="w-8 h-8" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-extrabold mb-4"
                        >
                            Edit Event
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-500 max-w-2xl mx-auto"
                        >
                            Updating existing event: <span className="text-slate-900 font-bold">{eventData.name}</span>
                        </motion.p>
                    </div>

                    {/* Masonry-style Layout for Horizontal packing */}
                    <div className="mx-auto pb-32 columns-1 lg:columns-2 gap-8 space-y-8 [&>div]:break-inside-avoid [&_.pt-8.mt-8.border-t]:hidden [&_.pt-6.border-t.flex.justify-between]:hidden">
                        <Step1BasicDetails />
                        <Step2Visuals />
                        <Step3DateTime />
                        <Step4People />
                        <Step5Tickets />
                        <Step6Details onSubmit={handleSubmit} isSubmitting={updateEvent.isPending} />
                    </div>

                </div>

                {/* Fixed Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50 flex justify-center items-center gap-4">
                    <button
                        onClick={() => router.push(isAdmin ? '/admin' : '/your-events')}
                        className="px-6 py-3 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={updateEvent.isPending}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2"
                    >
                        {updateEvent.isPending ? (
                            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
