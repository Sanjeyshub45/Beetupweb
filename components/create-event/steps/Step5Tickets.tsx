"use client";

import { useState } from "react";
import { useEventFormStore } from "@/store/eventFormStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Plus, Trash2, Ticket as TicketIcon } from "lucide-react";
import { toast } from "sonner";

const SUGGESTED_PROHIBITED_ITEMS = [
    "Umbrellas", "Wooden sticks", "Selfie stick", "Metal Container", "Power bank",
    "Helmets", "Glass containers", "Laptop", "Laser pointer/flashlight",
    "Sharp items:knife/syringe", "Bags", "Banners", "Outside food", "Alcohol",
    "Bottles", "Lighter and Matchbox", "Tins", "Cans", "Flammable",
    "Musical Instrument", "Toxic", "Camera", "Audio Recorders"
];

export function Step5Tickets() {
    const { eventData, addTicket, updateTicket, removeTicket, addToList, removeFromList, updateInList, addFaq, updateFaq, removeFaq, updateField, nextStep, prevStep } = useEventFormStore();
    const [prohibitedInput, setProhibitedInput] = useState("");

    const handleNext = () => {
        const hasEmptyTicketName = eventData.tickets?.some(t => !t.name.trim());
        const hasEmptyTicketPrice = eventData.tickets?.some(t => t.price === "");

        if (!eventData.tickets || eventData.tickets.length === 0) {
            toast.error("Please add at least one ticket type.");
            return;
        }
        if (hasEmptyTicketName || hasEmptyTicketPrice) {
            toast.error("Please fill out Name and Price for all tickets. Use '0' for free tickets.");
            return;
        }
        nextStep();
    };

    const addProhibitedItem = (item: string) => {
        const trimmed = item.trim();
        if (!trimmed) return;
        if ((eventData.prohibitedItems || []).includes(trimmed)) return;
        addToList("prohibitedItems", trimmed);
    };

    const handleProhibitedInputKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addProhibitedItem(prohibitedInput);
            setProhibitedInput("");
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
                <h2 className="text-2xl font-bold mb-2">Tickets & Instructions</h2>
                <p className="text-slate-500">Define ticket tiers, event instructions, prohibited items, and FAQs.</p>
            </div>

            <div className="space-y-8">

                {/* ===== TICKETS ===== */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Tickets / Passes</h3>
                    <div className="space-y-4">
                        <AnimatePresence>
                            {eventData.tickets?.map((ticket, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 relative"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <Label className="font-bold text-slate-900 flex items-center gap-2">
                                            <TicketIcon className="w-4 h-4 text-primary" /> Tier {i + 1}
                                        </Label>
                                        {(eventData.tickets?.length || 0) > 1 && (
                                            <Button
                                                variant="ghost" size="sm"
                                                onClick={() => removeTicket(i)}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-slate-500">Pass Name *</Label>
                                            <Input
                                                placeholder="e.g., General"
                                                value={ticket.name}
                                                onChange={(e) => updateTicket(i, { ...ticket, name: e.target.value })}
                                                className="bg-white border-slate-200"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-slate-500">Price (₹) *</Label>
                                            <Input
                                                type="number" min="0"
                                                placeholder="Price"
                                                value={ticket.price === "" ? "" : ticket.price}
                                                onChange={(e) => updateTicket(i, { ...ticket, price: e.target.value === "" ? "" : parseFloat(e.target.value) || 0 })}
                                                className="bg-white border-slate-200"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-slate-500">Perks (comma separated)</Label>
                                            <Input
                                                placeholder="Perks (comma separated)"
                                                value={ticket.perks}
                                                onChange={(e) => updateTicket(i, { ...ticket, perks: e.target.value })}
                                                className="bg-white border-slate-200"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <Button
                            variant="outline"
                            onClick={() => addTicket({ name: "", price: "", perks: "" })}
                            className="w-full bg-transparent border-dashed border-slate-300 hover:bg-slate-900/5 hover:border-primary text-slate-500"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Ticket Type
                        </Button>
                    </div>
                </div>

                {/* ===== EVENT INSTRUCTIONS ===== */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Event Instructions</h3>
                    <p className="text-sm text-slate-500 mb-4">
                        This information will be shown on the event page. Use this section to convey key pointers for the event i.e. pick up points, venue rules, age limit
                    </p>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {(eventData.instructions || []).map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex gap-2"
                                >
                                    <Textarea
                                        rows={2}
                                        placeholder="Enter instruction (e.g., Pick up point: Main Entrance at 9 AM)"
                                        value={item}
                                        onChange={(e) => updateInList("instructions", i, e.target.value)}
                                        className="bg-slate-50 border-slate-200 flex-1 resize-none"
                                    />
                                    <Button
                                        variant="ghost" size="icon"
                                        onClick={() => removeFromList("instructions", i)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0 self-start mt-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <Button
                            variant="outline" size="sm"
                            onClick={() => addToList("instructions", "")}
                            className="bg-transparent border-dashed border-slate-300 hover:bg-slate-900/5 hover:border-primary text-slate-500"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add event instruction
                        </Button>
                    </div>
                </div>

                {/* ===== YOUTUBE VIDEO ===== */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">YouTube Video (Optional)</h3>
                    <div className="space-y-1">
                        <Label className="text-slate-700">YouTube Video URL</Label>
                        <Input
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={eventData.youtubeVideo || ""}
                            onChange={(e) => updateField("youtubeVideo", e.target.value)}
                            className="bg-slate-50 border-slate-200"
                        />
                        <p className="text-xs text-slate-500">Add a promotional or informational video for your event</p>
                    </div>
                </div>

                {/* ===== PROHIBITED ITEMS ===== */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Prohibited Items</h3>
                    <div className="space-y-4">
                        <div>
                            <Label className="text-xs text-slate-500 mb-2 block">Add prohibited items (max 25 characters each)</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter item name"
                                    maxLength={25}
                                    value={prohibitedInput}
                                    onChange={(e) => setProhibitedInput(e.target.value)}
                                    onKeyDown={handleProhibitedInputKeyPress}
                                    className="bg-slate-50 border-slate-200 flex-1"
                                />
                                <Button
                                    variant="outline" size="icon"
                                    onClick={() => { addProhibitedItem(prohibitedInput); setProhibitedInput(""); }}
                                    className="border-slate-300 hover:border-primary hover:bg-slate-900/5 shrink-0"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Tags display */}
                        <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-50 border border-slate-200 rounded-xl">
                            <AnimatePresence>
                                {(eventData.prohibitedItems || []).map((item, i) => (
                                    <motion.span
                                        key={item}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-full text-sm font-medium"
                                    >
                                        {item}
                                        <button
                                            onClick={() => removeFromList("prohibitedItems", i)}
                                            className="ml-1 text-red-400 hover:text-red-600 w-4 h-4 flex items-center justify-center"
                                        >×</button>
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Suggested items */}
                        <div>
                            <p className="text-sm text-slate-600 font-semibold mb-2">Suggested items</p>
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTED_PROHIBITED_ITEMS.map(item => {
                                    const added = (eventData.prohibitedItems || []).includes(item);
                                    return (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => !added && addProhibitedItem(item)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${added
                                                ? "opacity-40 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400"
                                                : "bg-white border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 cursor-pointer"
                                                }`}
                                        >
                                            + {item}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== FAQs ===== */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">FAQs (Optional)</h3>
                    <p className="text-sm text-slate-500 mb-4">
                        Add some functional details about the event to help customers understand the event offering. This will help increase their likelihood to get tickets without any doubts or concerns.
                    </p>
                    <div className="space-y-4">
                        <AnimatePresence>
                            {eventData.faqs?.map((faq, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, height: 0 }}
                                    className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 relative"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs text-slate-500">Question</Label>
                                                <Input
                                                    placeholder="What is the dress code for the event?"
                                                    value={faq.question}
                                                    onChange={(e) => updateFaq(i, { ...faq, question: e.target.value })}
                                                    className="bg-white border-slate-200"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-slate-500">Answer</Label>
                                                <Textarea
                                                    rows={3}
                                                    placeholder="Inform attendees about the dress expectations, especially for formal or themed events."
                                                    value={faq.answer}
                                                    onChange={(e) => updateFaq(i, { ...faq, answer: e.target.value })}
                                                    className="bg-white border-slate-200 resize-none"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost" size="icon"
                                            onClick={() => removeFaq(i)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0 mt-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <Button
                            variant="outline"
                            onClick={() => addFaq({ question: "", answer: "" })}
                            className="w-full bg-transparent border-dashed border-slate-300 hover:bg-slate-900/5 hover:border-primary text-slate-500"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add custom question
                        </Button>
                    </div>
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
