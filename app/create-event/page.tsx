"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useEventFormStore } from "@/store/eventFormStore";
import { useCreateEvent } from "@/hooks/useEventMutations";
import { EventData } from "@/types";

import { StepIndicator } from "@/components/create-event/StepIndicator";
import { Step1BasicDetails } from "@/components/create-event/steps/Step1BasicDetails";
import { Step2Visuals } from "@/components/create-event/steps/Step2Visuals";
import { Step3DateTime } from "@/components/create-event/steps/Step3DateTime";
import { Step4People } from "@/components/create-event/steps/Step4People";
import { Step5Tickets } from "@/components/create-event/steps/Step5Tickets";
import { Step6Details } from "@/components/create-event/steps/Step6Details";

export default function CreateEventPage() {
    const router = useRouter();
    const { user, isAdmin, loading: authLoading } = useAuthStore();
    const { currentStep, eventData, resetForm } = useEventFormStore();
    const createEvent = useCreateEvent();

    // Auth Guard
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth");
        }
    }, [user, authLoading, router]);

    // Clean form on unmount
    useEffect(() => {
        return () => resetForm();
    }, [resetForm]);

    const handleSubmit = async () => {
        if (!user) return;
        try {
            const finalData: EventData = JSON.parse(JSON.stringify(eventData));
            await createEvent.mutateAsync({ eventData: finalData, userId: user.uid, isAdmin });
            toast.success(isAdmin && finalData.isLaunch ? "Event launched successfully!" : "Event created successfully! It is now pending admin review.");
            resetForm();
            router.push(isAdmin ? `/admin` : `/your-events`);
        } catch (error) {
            console.error("Failed to create event:", error);
            toast.error("Failed to create the event. Please ensure all data is valid.");
        }
    };


    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 pt-40 pb-16 px-4 md:px-6 overflow-x-hidden">
            <div className="container mx-auto max-w-4xl relative">

                {/* Background blurs */}
                <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

                <div className="relative z-10">
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900/5 border border-slate-200 mb-6 text-primary shadow-[0_0_30px_rgba(225,29,72,0.2)]"
                        >
                            <PlusCircle className="w-8 h-8" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-extrabold mb-4"
                        >
                            List your new event
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-500 max-w-2xl mx-auto"
                        >
                            Fill out the details below to create your event page and start selling tickets.
                        </motion.p>
                    </div>

                    <StepIndicator currentStep={currentStep} totalSteps={6} />

                    <div className="mt-8">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && <Step1BasicDetails key="step1" />}
                            {currentStep === 2 && <Step2Visuals key="step2" />}
                            {currentStep === 3 && <Step3DateTime key="step3" />}
                            {currentStep === 4 && <Step4People key="step4" />}
                            {currentStep === 5 && <Step5Tickets key="step5" />}
                            {currentStep === 6 && <Step6Details key="step6" onSubmit={handleSubmit} isSubmitting={createEvent.isPending} />}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
}
