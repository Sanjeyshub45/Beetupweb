"use client";

import { useEventFormStore } from "@/store/eventFormStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/storage";
import { useAuthStore } from "@/store/authStore";

export function Step2Visuals() {
    const { eventData, updateField, addToList, removeFromList, nextStep, prevStep, uploadSessionKey } = useEventFormStore();
    const { user } = useAuthStore();

    const [uploadingMain, setUploadingMain] = useState(false);
    const [uploadingShowcase, setUploadingShowcase] = useState(false);

    const handleNext = () => {
        if (!eventData.mainImage) {
            toast.error("A main event poster is required.");
            return;
        }
        nextStep();
    };

    const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        try {
            setUploadingMain(true);
            const url = await uploadImage(file, `events/${user.uid}/${uploadSessionKey}/main.jpg`);
            if (url) updateField("mainImage", url);
        } catch (error) {
            toast.error("Failed to upload image");
        } finally {
            setUploadingMain(false);
        }
    };

    const handleShowcaseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !user || files.length === 0) return;

        // Prevent exceeding reasonable limit (e.g., 5 total)
        const currentCount = eventData.showcaseImages?.length || 0;
        if (currentCount + files.length > 5) {
            toast.error("Maximum 5 showcase images allowed");
            return;
        }

        try {
            setUploadingShowcase(true);
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const url = await uploadImage(file, `events/${user.uid}/${uploadSessionKey}/showcase_${currentCount + i}.jpg`);
                if (url) addToList("showcaseImages", url);
            }
        } catch (error) {
            toast.error("Failed to upload one or more images");
        } finally {
            setUploadingShowcase(false);
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
                <h2 className="text-2xl font-bold mb-2">Visuals</h2>
                <p className="text-slate-500">Make your event stand out with a great poster and showcase images.</p>
            </div>

            <div className="space-y-8">
                {/* Main Image */}
                <div className="space-y-4">
                    <Label className="text-slate-700">Main Event Poster <span className="text-red-500">*</span></Label>

                    <div className="relative w-full aspect-video md:aspect-[3/1] rounded-2xl border-2 border-dashed border-slate-300 hover:border-primary/50 transition-colors overflow-hidden bg-slate-50 flex flex-col items-center justify-center group">
                        {eventData.mainImage ? (
                            <>
                                <img src={eventData.mainImage} alt="Main Poster" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                                    <span className="font-bold">Replace Image</span>
                                    <label className="bg-primary hover:bg-primary-hover px-6 py-2 rounded-full cursor-pointer font-bold transition-colors">
                                        Upload New
                                        <input type="file" className="hidden" accept="image/*" onChange={handleMainImageUpload} disabled={uploadingMain} />
                                    </label>
                                </div>
                            </>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-6">
                                {uploadingMain ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                        <span className="text-sm font-medium">Uploading...</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-full bg-slate-900/5 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                            <ImageIcon className="w-8 h-8 text-primary" />
                                        </div>
                                        <p className="font-bold text-lg mb-1">Click to upload poster</p>
                                        <p className="text-sm text-slate-500">Recommended size: 1920x1080 (16:9 ratio)</p>
                                    </>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleMainImageUpload} disabled={uploadingMain} />
                            </label>
                        )}
                    </div>
                </div>

                {/* Showcase Images */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                    <div className="flex justify-between items-end">
                        <Label className="text-slate-700">Showcase Images (max 5)</Label>
                        <span className="text-xs text-slate-500">{eventData.showcaseImages?.length || 0}/5 uploaded</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {eventData.showcaseImages?.map((url, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200">
                                <img src={url} alt={`Showcase ${i}`} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removeFromList("showcaseImages", i)}
                                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {(eventData.showcaseImages?.length || 0) < 5 && (
                            <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-primary/50 bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                                {uploadingShowcase ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                ) : (
                                    <>
                                        <Upload className="w-6 h-6 text-slate-500 mb-2" />
                                        <span className="text-xs font-medium text-slate-500">Add Image</span>
                                    </>
                                )}
                                <input type="file" className="hidden" accept="image/*" multiple onChange={handleShowcaseUpload} disabled={uploadingShowcase} />
                            </label>
                        )}
                    </div>
                </div>

                {/* YouTube */}
                <div className="space-y-2 pt-6 border-t border-slate-200">
                    <Label htmlFor="youtube" className="text-slate-700">YouTube Video Link (Optional)</Label>
                    <Input
                        id="youtube"
                        placeholder="https://youtube.com/watch?v=..."
                        value={eventData.youtubeVideo || ""}
                        onChange={(e) => updateField("youtubeVideo", e.target.value)}
                        className="bg-slate-50 border-slate-200"
                    />
                </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-between">
                <Button onClick={prevStep} variant="outline" className="bg-transparent border-slate-300 text-slate-900 hover:bg-slate-900/5 gap-2">
                    <ArrowLeft className="w-4 h-4" /> Previous
                </Button>
                <Button onClick={handleNext} className="bg-primary hover:bg-primary-hover font-bold gap-2">
                    Next Step <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}
