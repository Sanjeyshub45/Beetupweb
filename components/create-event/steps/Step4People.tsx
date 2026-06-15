"use client";

import { useState } from "react";
import { useEventFormStore } from "@/store/eventFormStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/storage";

export function Step4People() {
    const { eventData, addVIP, updateVIP, removeVIP, addToList, removeFromList, updateInList, nextStep, prevStep, uploadSessionKey } = useEventFormStore();
    const { user } = useAuthStore();
    const [uploadingVipIdx, setUploadingVipIdx] = useState<number | null>(null);

    const handleVipImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        try {
            setUploadingVipIdx(index);
            const url = await uploadImage(file, `events/${user.uid}/${uploadSessionKey}/vip_${index}.jpg`);
            if (url) {
                const vip = eventData.vips?.[index];
                if (vip) updateVIP(index, { ...vip, image: url });
            }
        } catch (error) {
            console.error("Vip image upload error", error);
        } finally {
            setUploadingVipIdx(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white glass p-8 rounded-3xl border border-slate-200 space-y-8"
        >
            <div>
                <h2 className="text-2xl font-bold mb-2">People & Contacts</h2>
                <p className="text-slate-500">Highlight your VIPs/Speakers and provide contact information.</p>
            </div>

            <div className="space-y-8">

                {/* VIPs Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <Label className="text-lg font-bold text-slate-900">VIPs & Speakers</Label>
                    </div>

                    <AnimatePresence>
                        {eventData.vips?.map((vip, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-6 mb-4"
                            >
                                {/* VIP Image */}
                                <div className="w-24 h-24 rounded-full border-2 border-slate-200 bg-slate-100 flex-shrink-0 relative overflow-hidden group mx-auto md:mx-0">
                                    {vip.image ? (
                                        <img src={vip.image} alt="VIP" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500/50 group-hover:bg-primary/20 transition-colors">
                                            {uploadingVipIdx === i ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <ImageIcon className="w-8 h-8 opacity-50" />}
                                        </div>
                                    )}
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                        <span className="text-xs font-bold text-slate-900 text-center px-2">Upload</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleVipImageUpload(i, e)} disabled={uploadingVipIdx === i} />
                                    </label>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Name (e.g., Jane Doe)"
                                            value={vip.name}
                                            onChange={(e) => updateVIP(i, { ...vip, name: e.target.value })}
                                            className="bg-slate-100 border-slate-200"
                                        />
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Designation / Role"
                                                value={vip.designation}
                                                onChange={(e) => updateVIP(i, { ...vip, designation: e.target.value })}
                                                className="bg-slate-100 border-slate-200 flex-1"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeVIP(i)}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <Button
                        variant="outline"
                        onClick={() => addVIP({ name: "", designation: "", image: "" })}
                        className="w-full bg-transparent border-dashed border-slate-300 hover:bg-slate-900/5 hover:border-white/40 text-slate-500"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add VIP / Speaker
                    </Button>
                </div>

                {/* Contacts Section */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                    <Label className="text-lg font-bold text-slate-900 mb-2 block">Contact Information</Label>
                    <p className="text-xs text-slate-500 mb-4">Phone numbers or emails for attendees to reach out.</p>

                    <AnimatePresence>
                        {eventData.contacts?.map((contact, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex gap-2 mb-3"
                            >
                                <Input
                                    placeholder="e.g., +1 234 567 8900 or hello@event.com"
                                    value={contact}
                                    onChange={(e) => updateInList('contacts', i, e.target.value)}
                                    className="bg-slate-50 border-slate-200 flex-1"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFromList('contacts', i)}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {(eventData.contacts?.length || 0) < 3 ? (
                        <Button
                            variant="outline"
                            onClick={() => addToList('contacts', "")}
                            className="bg-transparent border-dashed border-slate-300 hover:bg-slate-900/5 hover:border-white/40 text-slate-500"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Contact
                        </Button>
                    ) : (
                        <p className="text-xs text-slate-400 italic">Maximum 3 contacts reached.</p>
                    )}
                </div>

            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-between">
                <Button onClick={prevStep} variant="outline" className="bg-transparent border-slate-300 text-slate-900 hover:bg-slate-900/5 gap-2">
                    <ArrowLeft className="w-4 h-4" /> Previous
                </Button>
                <Button onClick={nextStep} className="bg-primary hover:bg-primary-hover font-bold gap-2">
                    Next Step <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}
