"use client";

import { useEffect, useRef } from "react";
import { useEventFormStore } from "@/store/eventFormStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, MapPin, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { geohashForLocation } from "geofire-common";
import { format, differenceInDays, addDays } from "date-fns";

export function Step3DateTime() {
    const { eventData, updateField, updateLocation, updateTimeline, nextStep, prevStep } = useEventFormStore();
    const locationInputRef = useRef<HTMLInputElement>(null);

    // Re-generate timeline days if date range changes
    useEffect(() => {
        if (eventData.startDate && eventData.endDate) {
            // Parse YYYY-MM-DD safely into local timezone to avoid UTC drift
            const parseLocalDate = (dateStr: string) => {
                const [y, m, d] = dateStr.split('-');
                return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
            };

            const start = parseLocalDate(eventData.startDate);
            const end = parseLocalDate(eventData.endDate);
            
            // Calculate number of days (inclusive)
            const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

            if (daysDiff > 0 && daysDiff <= 30) { // Sane limit
                const existingTimeline = eventData.timeline || [];
                const newTimeline = [];

                for (let i = 0; i < daysDiff; i++) {
                    const currentDate = new Date(start);
                    currentDate.setDate(start.getDate() + i);

                    const existingDay = existingTimeline.find(t => t.day === i + 1);
                    
                    // Format matching JS: weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                    const dateFormatted = format(currentDate, "EEE, MMM d, yyyy");
                    // Store the raw YYYY-MM-DD date rather than an ISO string which can drift
                    const rawDate = format(currentDate, "yyyy-MM-dd");

                    newTimeline.push({
                        day: i + 1,
                        date: rawDate,
                        dateFormatted: dateFormatted,
                        entries: existingDay?.entries || [] // JS starts empty
                    });
                }

                if (JSON.stringify(newTimeline) !== JSON.stringify(existingTimeline)) {
                    updateTimeline(newTimeline);
                }
            } else if (daysDiff <= 0) {
                // Clear timeline if end date is before start date
                updateTimeline([]);
            }
        }
    }, [eventData.startDate, eventData.endDate]);

    // Init Google Maps API
    useEffect(() => {
        // Do not return early. The ref might populate on a subsequent render
        // while the script is loading.

        let autocompleteInstances: any[] = [];
        
        const initAutocomplete = async () => {
            try {
                // Wait for the Google script to load and attach
                if (!window.google?.maps?.places) {
                    await new Promise<void>((resolve, reject) => {
                        const existingScript = document.getElementById('google-maps-script');
                        if (existingScript) {
                            const checkInterval = setInterval(() => {
                                if (window.google?.maps?.places) {
                                    clearInterval(checkInterval);
                                    resolve();
                                }
                            }, 100);
                            return;
                        }

                        const script = document.createElement('script');
                        script.id = 'google-maps-script';
                        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
                        script.async = true;
                        script.defer = true;
                        script.onload = () => {
                            const checkInterval = setInterval(() => {
                                if (window.google?.maps?.places) {
                                    clearInterval(checkInterval);
                                    resolve();
                                }
                            }, 50);
                        };
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                }

                if (!window.google?.maps?.places) return;

                // Even after script load, framer motion mounts can delay the element
                const attachAutocomplete = () => {
                    if (!locationInputRef.current) {
                        // Retry attaching after a brief wait
                        setTimeout(attachAutocomplete, 100);
                        return;
                    }

                    // To prevent memory leaks / double bindings
                    if (autocompleteInstances.length > 0) return;

                    const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current, {
                        types: ['establishment', 'geocode'],
                    });

                    autocompleteInstances.push(autocomplete);

                    autocomplete.addListener("place_changed", () => {
                        const place = autocomplete.getPlace();
                        if (!place.geometry || !place.geometry.location) return;

                        let district = "";
                        let state = "";
                        let country = "";

                        place.address_components?.forEach((component: any) => {
                            const types = component.types;
                            if (types.includes("administrative_area_level_3") || types.includes("locality")) district = component.long_name;
                            if (types.includes("administrative_area_level_1")) state = component.long_name;
                            if (types.includes("country")) country = component.long_name;
                        });

                        const lat = place.geometry.location.lat();
                        const lng = place.geometry.location.lng();
                        const geohash = geohashForLocation([lat, lng]);

                        updateLocation({
                            venue: place.name || "",
                            district: district,
                            state: state,
                            country: country,
                            coordinates: { lat, lng },
                            geohash: geohash,
                            geopoint: { latitude: lat, longitude: lng },
                        });
                    });
                };

                attachAutocomplete();

            } catch (error) {
                console.error("Failed to load Google Maps API:", error);
            }
        };

        initAutocomplete();

        return () => {
            // Clean up instances on unmount if possible
            autocompleteInstances = [];
        };
    }, []);



    const handleNext = () => {
        if (!eventData.startDate || !eventData.endDate || !eventData.startTime) {
            toast.error("Please fill in start and end date/time.");
            return;
        }
        if (!eventData.location?.venue) {
            toast.error("Please enter a valid location venue.");
            return;
        }
        nextStep();
    };

    const addTimelineEntry = (dayIndex: number) => {
        const newTimeline = [...(eventData.timeline || [])];
        newTimeline[dayIndex].entries.push({ time: "", action: "" });
        updateTimeline(newTimeline);
    };

    const updateTimelineEntry = (dayIndex: number, entryIndex: number, field: 'time' | 'action', value: string) => {
        const newTimeline = [...(eventData.timeline || [])];
        newTimeline[dayIndex].entries[entryIndex][field] = value;
        updateTimeline(newTimeline);
    };

    const removeTimelineEntry = (dayIndex: number, entryIndex: number) => {
        const newTimeline = [...(eventData.timeline || [])];
        newTimeline[dayIndex].entries.splice(entryIndex, 1);
        updateTimeline(newTimeline);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white glass p-8 rounded-3xl border border-slate-200 space-y-8"
        >
            <div>
                <h2 className="text-2xl font-bold mb-2">When and Where</h2>
                <p className="text-slate-500">Set up the schedule and location for your event.</p>
            </div>

            <div className="space-y-8">

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-slate-700">Start Date <span className="text-red-500">*</span></Label>
                        <Input
                            type="date"
                            value={eventData.startDate || ""}
                            onChange={(e) => updateField("startDate", e.target.value)}
                            className="bg-slate-50 border-slate-200"
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-700">End Date <span className="text-red-500">*</span></Label>
                        <Input
                            type="date"
                            value={eventData.endDate || ""}
                            onChange={(e) => updateField("endDate", e.target.value)}
                            className="bg-slate-50 border-slate-200"
                            min={eventData.startDate || new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-700">Start Time <span className="text-red-500">*</span></Label>
                        <Input
                            type="time"
                            value={eventData.startTime || ""}
                            onChange={(e) => updateField("startTime", e.target.value)}
                            className="bg-slate-50 border-slate-200"
                        />
                    </div>
                </div>

                {/* Location Info */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                    <Label className="text-slate-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" /> Location <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-slate-600 text-xs">Venue Search</Label>
                            <input
                                ref={locationInputRef}
                                value={eventData.location?.venue || ""}
                                onChange={(e) => updateLocation({ ...eventData.location!, venue: e.target.value })}
                                placeholder="Search venue (Google Places)..."
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-slate-50 border-slate-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-600 text-xs">District</Label>
                            <Input
                                value={eventData.location?.district || ""}
                                onChange={(e) => updateLocation({ ...eventData.location!, district: e.target.value })}
                                className="bg-slate-50 border-slate-200"
                                placeholder="District or City"
                            />
                        </div>
                    </div>
                </div>

                {/* Dynamic Timeline Builder */}
                {eventData.timeline && eventData.timeline.length > 0 && (
                    <div className="space-y-6 pt-6 border-t border-slate-200">
                        <div>
                            <Label className="text-lg font-bold text-slate-900 mb-2 block">Event Timeline</Label>
                            <p className="text-xs text-slate-500 mb-4">Dynamically generated based on your Start and End Dates.</p>
                        </div>

                        <div className="space-y-6">
                            {eventData.timeline.map((day, dayIdx) => (
                                <div key={dayIdx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                                        <h3 className="font-bold text-primary">Day {day.day}</h3>
                                        <span className="text-sm text-slate-500">{day.dateFormatted}</span>
                                    </div>

                                    <div className="space-y-3">
                                        {day.entries.length === 0 && (
                                            <p className="text-sm text-slate-500 italic text-center py-2">No schedule entries for this day yet.</p>
                                        )}
                                        <AnimatePresence>
                                            {day.entries.map((entry, entryIdx) => (
                                                <motion.div
                                                    key={entryIdx}
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="flex gap-4 items-start"
                                                >
                                                    <Input
                                                        type="time"
                                                        className="bg-slate-100 border-slate-200 w-[120px] shrink-0"
                                                        value={entry.time}
                                                        onChange={(e) => updateTimelineEntry(dayIdx, entryIdx, 'time', e.target.value)}
                                                    />
                                                    <Input
                                                        placeholder="Activity (e.g., Keynote Speech)"
                                                        className="bg-slate-100 border-slate-200 flex-1"
                                                        value={entry.action}
                                                        onChange={(e) => updateTimelineEntry(dayIdx, entryIdx, 'action', e.target.value)}
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeTimelineEntry(dayIdx, entryIdx)}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addTimelineEntry(dayIdx)}
                                        className="w-full mt-4 bg-transparent border-dashed border-slate-300 hover:bg-slate-900/5 hover:border-white/40 text-slate-500"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add Time Slot
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
