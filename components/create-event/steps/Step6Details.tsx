"use client";

import { useEventFormStore } from "@/store/eventFormStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Loader2, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const LANGUAGES = [
    { label: "Tamil", value: "tamil" },
    { label: "English", value: "english" },
    { label: "Hindi", value: "hindi" },
    { label: "Telugu", value: "telugu" },
    { label: "Malayalam", value: "malayalam" },
    { label: "Kannada", value: "kannada" },
    { label: "Bengali", value: "bengali" },
    { label: "Marathi", value: "marathi" },
    { label: "Gujarati", value: "gujarati" },
    { label: "Urdu", value: "urdu" },
    { label: "Odia", value: "odia" },
    { label: "Punjabi", value: "punjabi" },
    { label: "Sanskrit", value: "sanskrit" },
    { label: "Assamese", value: "assamese" },
    { label: "Konkani", value: "konkani" },
    { label: "Kashmiri", value: "kashmiri" },
    { label: "Nepali", value: "nepali" },
    { label: "Sindhi", value: "sindhi" },
    { label: "Manipuri", value: "manipuri" },
    { label: "Bhojpuri", value: "bhojpuri" },
    { label: "Rajasthani", value: "rajasthani" },
    { label: "Khasi", value: "khasi" },
    { label: "Haryanvi", value: "haryanvi" },
    { label: "Arabic", value: "arabic" },
    { label: "Thai", value: "thai" },
    { label: "Japanese", value: "japanese" },
    { label: "Korean", value: "korean" },
    { label: "French", value: "french" },
    { label: "Italian", value: "italian" },
    { label: "Chinese (Mandarin)", value: "chinese" },
    { label: "Spanish", value: "spanish" },
    { label: "German", value: "german" },
    { label: "Turkish", value: "turkish" },
    { label: "Russian", value: "russian" },
    { label: "Serbian", value: "serbian" },
];

const MIN_AGE_OPTIONS = [
    "no-restriction", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "50+"
];

const TICKET_AGE_OPTIONS = [
    "no-restriction", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "50+"
];

interface Step6Props {
    onSubmit?: () => void;
    isSubmitting?: boolean;
}

export function Step6Details({ onSubmit, isSubmitting = false }: Step6Props) {
    const { eventData, updateNotableField, prevStep, updateField } = useEventFormStore();
    const { isAdmin } = useAuthStore();
    const notables = eventData.notables || {};

    type NotablesCategory = Parameters<typeof updateNotableField>[0];

    const getVal = (category: NotablesCategory, field: string): string => {
        const categoryData = notables[category as keyof typeof notables] as Record<string, unknown> | undefined;
        const val = categoryData?.[field];
        return (typeof val === "string" && val) ? val : "";
    };

    const set = (category: NotablesCategory, field: string, value: string | null) =>
        updateNotableField(category, field, value ?? "");

    // Languages stored in notables.infoAboutEvent.languages as array
    const selectedLanguages: string[] = (notables as any)?.infoAboutEvent?.languages || [];

    const toggleLanguage = (value: string) => {
        const current: string[] = (notables as any)?.infoAboutEvent?.languages || [];
        const updated = current.includes(value)
            ? current.filter((l: string) => l !== value)
            : [...current, value];
        updateNotableField("infoAboutEvent", "languages", updated);
    };

    const renderSelect = (
        category: NotablesCategory,
        field: string,
        label: string,
        options: string[] = ["yes", "no"],
        displayMap?: Record<string, string>
    ) => (
        <div className="space-y-2">
            <Label className="text-slate-700 text-sm">{label} <span className="text-red-500">*</span></Label>
            <Select value={getVal(category, field)} onValueChange={(val) => set(category, field, val)}>
                <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                    {options.map(opt => (
                        <SelectItem key={opt} value={opt}>
                            {displayMap?.[opt] ?? (opt.charAt(0).toUpperCase() + opt.slice(1))}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );

    const renderSelectCustom = (
        category: NotablesCategory,
        field: string,
        label: string,
        options: { value: string; label: string }[]
    ) => (
        <div className="space-y-2">
            <Label className="text-slate-700 text-sm">{label} <span className="text-red-500">*</span></Label>
            <Select value={getVal(category, field)} onValueChange={(val) => set(category, field, val)}>
                <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                    {options.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );

    const renderTimeInput = (category: NotablesCategory, field: string, label: string) => (
        <div className="space-y-2">
            <Label className="text-slate-700 text-sm">{label} <span className="text-red-500">*</span></Label>
            <Input
                type="time"
                value={getVal(category, field)}
                onChange={(e) => set(category, field, e.target.value)}
                className="bg-slate-50 border-slate-200"
            />
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white glass p-8 rounded-3xl border border-slate-200 space-y-8"
        >
            <div>
                <h2 className="text-2xl font-bold mb-2">Event Details</h2>
                <p className="text-slate-500">Configure key event information, entry rules, and amenities.</p>
            </div>

            <div className="space-y-10">

                {/* A) Info About Event */}
                <div>
                    <h3 className="text-base font-bold text-slate-900 mb-4">A) Info About Event</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderSelectCustom("infoAboutEvent", "minAge", "Minimum age for entry",
                            MIN_AGE_OPTIONS.map(v => ({ value: v, label: v === "no-restriction" ? "No age restriction" : v }))
                        )}
                        {renderSelectCustom("infoAboutEvent", "ticketAge", "From what age is a ticket required?",
                            TICKET_AGE_OPTIONS.map(v => ({ value: v, label: v === "no-restriction" ? "No age restriction" : v }))
                        )}
                        {renderSelect("infoAboutEvent", "petsAllowed", "Are pets allowed at this event?", ["yes", "no"], { yes: "Yes", no: "No" })}
                        {renderSelect("infoAboutEvent", "venueType", "Event venue type", ["indoor", "outdoor", "both"], { indoor: "Indoor", outdoor: "Outdoor", both: "Both" })}
                        {renderSelect("infoAboutEvent", "childFriendly", "Is this event suitable for children?", ["yes", "no"], { yes: "Yes", no: "No" })}
                    </div>

                    {/* Languages Grid */}
                    <div className="mt-4 space-y-2">
                        <Label className="text-slate-700 text-sm">Event language(s) <span className="text-red-500">*</span></Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-4 bg-slate-50 border border-slate-200 rounded-xl max-h-72 overflow-y-auto">
                            {LANGUAGES.map(lang => {
                                const selected = selectedLanguages.includes(lang.value);
                                return (
                                    <label
                                        key={lang.value}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm ${selected
                                            ? "bg-red-50 border-primary text-slate-900 font-semibold"
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-red-50 hover:border-primary"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="accent-primary w-4 h-4 cursor-pointer"
                                            checked={selected}
                                            onChange={() => toggleLanguage(lang.value)}
                                        />
                                        <span>{lang.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                        <p className="text-xs text-slate-500">Select all languages that apply to this event</p>
                    </div>
                </div>

                {/* B) Entry & Access */}
                <div>
                    <h3 className="text-base font-bold text-slate-900 mb-4">B) Entry &amp; Access</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderSelect("entryAccess", "reEntryAllowed", "Is re-entry allowed after exit?", ["yes", "no"], { yes: "Yes", no: "No" })}
                        {renderSelect("entryAccess", "ticketsTransferable", "Are tickets transferable?", ["yes", "no"], { yes: "Yes", no: "No" })}
                        {renderSelect("entryAccess", "ticketCheck", "How will tickets be checked?", ["digital", "physical", "both"], { digital: "Digital", physical: "Physical", both: "Both" })}
                        {renderSelect("entryAccess", "onSpotPurchase", "Is on-spot ticket purchase available?", ["yes", "no"], { yes: "Yes", no: "No" })}
                    </div>
                </div>

                {/* C) Timing & Schedule */}
                <div>
                    <h3 className="text-base font-bold text-slate-900 mb-4">C) Timing &amp; Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderTimeInput("timingSchedule", "gateOpeningTime", "Gate opening time")}
                        {renderSelect("timingSchedule", "lateEntryPermitted", "Is late entry permitted?", ["yes", "no"], { yes: "Yes", no: "No" })}
                        {renderTimeInput("timingSchedule", "eventStartTime", "Expected event start time")}
                        {renderTimeInput("timingSchedule", "eventEndTime", "Expected event end time")}
                    </div>
                </div>

                {/* D) Comfort & Accessibility */}
                <div>
                    <h3 className="text-base font-bold text-slate-900 mb-4">D) Comfort &amp; Accessibility</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderSelect("comfortAccessibility", "restroomsAvailable", "Are restrooms available at the venue?", ["yes", "no"], { yes: "Yes", no: "No" })}
                        {renderSelect("comfortAccessibility", "wheelchairAccessible", "Is the venue wheelchair accessible?", ["yes", "no"], { yes: "Yes", no: "No" })}
                    </div>
                </div>

                {/* E) Rules & Restrictions */}
                <div>
                    <h3 className="text-base font-bold text-slate-900 mb-4">E) Rules &amp; Restrictions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderSelect("rulesRestrictions", "bagsAllowed", "Are bags/backpacks allowed inside the venue?", ["yes", "no"], { yes: "Yes", no: "No" })}
                        {renderSelect("rulesRestrictions", "camerasAllowed", "Are cameras or professional equipment allowed?", ["yes", "no"], { yes: "Yes", no: "No" })}
                        {renderSelect("rulesRestrictions", "smokingAlcoholPermitted", "Is smoking or alcohol permitted?", ["yes", "no"], { yes: "Yes", no: "No" })}
                    </div>
                </div>

                {/* F) Food & Amenities */}
                <div>
                    <h3 className="text-base font-bold text-slate-900 mb-4">F) Food &amp; Amenities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderSelect("foodAmenities", "foodAvailable", "Will food and beverages be available at the venue?", ["yes", "no"], { yes: "Yes", no: "No" })}
                        {renderSelect("foodAmenities", "vegOptions", "Are vegetarian/vegan options available?", ["yes", "no"], { yes: "Yes", no: "No" })}
                        {renderSelect("foodAmenities", "freeWater", "Is free drinking water available?", ["yes", "no"], { yes: "Yes", no: "No" })}
                    </div>
                </div>

                {/* G) Travel & Parking */}
                <div>
                    <h3 className="text-base font-bold text-slate-900 mb-4">G) Travel &amp; Parking</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderSelect("travelParking", "parkingAvailable", "Is parking available at the venue?", ["yes", "no"], { yes: "Yes", no: "No" })}
                        {renderSelect("travelParking", "publicTransportAccess", "Is the venue accessible via public transport?", ["yes", "no"], { yes: "Yes", no: "No" })}
                    </div>
                </div>

            </div>

            {/* Admin Only Section */}
            {isAdmin && (
                <div className="pt-8 border-t border-red-200 mt-8 space-y-6 bg-red-50/50 -mx-8 px-8 pb-8 rounded-b-3xl">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        <h3 className="text-lg font-bold text-red-900">Admin Controls</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-base font-bold text-slate-900">Trending Event</Label>
                                <p className="text-sm text-slate-500">Feature this event in the trending section.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={eventData.isTrending || false}
                                    onChange={(e) => updateField('isTrending', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">
                            <span className="font-semibold">Note:</span> To launch or un-launch this event, use the approve button on the Admin Dashboard.
                        </p>
                    </div>
                </div>
            )}

            <div className={`pt-8 border-t border-slate-200 flex justify-between items-center ${isAdmin ? 'mt-0' : 'mt-8'}`}>
                <Button
                    onClick={prevStep}
                    variant="outline"
                    disabled={isSubmitting}
                    className="bg-transparent border-slate-300 text-slate-900 hover:bg-slate-900/5 gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Previous
                </Button>

                {onSubmit && (
                    <Button
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary-hover font-bold gap-2 px-8 py-6 text-lg"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Creating Event...</>
                        ) : (
                            <><CheckCircle className="w-5 h-5" /> Create Event</>
                        )}
                    </Button>
                )}
            </div>
        </motion.div>
    );
}
