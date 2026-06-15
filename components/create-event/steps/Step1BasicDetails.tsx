"use client";

import { useEventFormStore } from "@/store/eventFormStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export function Step1BasicDetails() {
    const { eventData, updateField, nextStep, prevStep } = useEventFormStore();

    const handleNext = () => {
        // Basic Validation
        if (!eventData.name || !eventData.description || !eventData.category || !eventData.organization) {
            toast.error("Please fill in all required fields.");
            return;
        }
        nextStep();
    };

    const categories: Record<string, string[]> = {
        "Music & Audio": ["Concerts", "Music Festivals", "Live Gigs", "Open Mics & Jams", "Music Open Mics", "Jams", "Concert Screenings", "Music Conferences & Talks", "Music Workshops"],
        "Comedy & Spoken Arts": ["Standup Comedy", "Improv", "Roast", "Comedy Open Mics", "Literary Open Mics", "Poetry & Literary Performances"],
        "Performing Arts & Shows": ["Dance Performances", "Magic Shows", "Fashion Shows", "Entertainment & Award Shows", "Film & Theatre Fests"],
        "Nightlife & Parties": ["Clubbing", "DJ Nights", "Karaoke Nights", "Parties", "Pub Crawls"],
        "Sports (Watch)": ["Cricket Matches", "Football Matches", "Hockey Matches", "Basketball Matches", "Tennis Matches", "Badminton Matches", "Kabaddi Matches", "Athletics", "Motorsport Matches", "Boxing", "MMA", "Wrestling", "Chess Matches", "Baseball Matches"],
        "Sports (Play)": ["Cricket", "Football", "Basketball", "Badminton", "Tennis", "Squash", "Padel", "Pickleball", "Swimming", "Golf", "Chess", "Community Runs"],
        "Fitness & Wellness": ["Yoga", "Zumba", "Pilates", "Crossfit", "Gymnastics", "Wellness Workshops", "Marathons", "Triathlons", "Cycling", "Fitness & Wellness Fests"],
        "Adventure & Outdoors": ["Treks", "Hiking", "Camping", "Skydiving", "Paragliding", "Scuba Diving", "Surfing", "River Rafting", "Ziplining", "Beach Activities", "Bike Riding", "Horse Riding", "Safaris", "Wildlife Experiences"],
        "Games & Experiences": ["Escape Rooms", "Mystery Rooms", "Rage Rooms", "VR Rooms", "Laser Tag", "Paintball", "Go Karting", "Bowling", "Arcades", "Skating Arenas", "Board Games", "Trivia Nights", "Treasure Hunts", "Esports"],
        "Kids & Family": ["Kids Festivals", "Play Areas", "Kids Theme Parks", "Summer Camps", "Family Events"],
        "Pets": ["Pet Playdates", "Pet Carnivals", "Pet Shows", "Pet Adoption Drives", "Pet Wellness Camps", "Yoga with Pets", "Paint with Pets", "Brunch with Pets"],
        "Food & Drinks": ["Gourmet Experiences", "Food & Beverage Fests", "Pop-Ups", "Beverage Tastings", "Community Dining", "Picnics"],
        "Travel & Exploration": ["Day Trips", "Weekend Getaways", "Tours", "Cruises", "Landmarks", "Stargazing"],
        "Attractions & Parks": ["Theme Parks", "Adventure Parks", "Water Parks", "Snow Parks", "Trampoline Parks", "Zoos", "Aquariums"],
        "Museums & Heritage": ["History Museums", "Science Museums", "Art Museums", "Planetariums", "Music Museums", "Wax Museums", "Illusion Museums", "Archaeological Museums", "Forts", "Palaces", "Caves", "Ancient Ruins", "Temples & Shrines", "Stepwells", "Iconic Landmarks"],
        "Walks & Trails": ["City Walks", "Food Walks", "Heritage Walks"],
        "Workshops & Learning": ["Art & Craft", "Photography", "Pottery", "Culinary", "Writing", "Music", "Dance", "Acting", "Public Speaking", "Fashion & Beauty", "Finance", "Entrepreneurship", "Design", "DIY", "Languages", "Martial Arts", "Motorsport", "Tech", "Filmmaking"],
        "Conferences, Expos & Networking": ["Tech Conferences", "Healthcare Conferences", "Business Conferences", "Marketing Conferences", "Education Conferences", "Career Fairs", "Startup Expos", "Trade Shows", "Auto Expos", "Community Meetups", "Dating Events"],
        "Fests, Fairs & Celebrations": ["Literary Fests", "Art Fairs", "Craft Bazaars", "Flea Markets", "Carnivals", "Cultural Festivals", "Religious Festivals", "Seasonal Celebrations", "Pride Events"],
        "Screenings & Watch Parties": ["Cricket Screenings", "Football Screenings", "F1 Screenings", "Movie Screenings", "Olympics Screenings"],
        "College Events": ["Symposiums", "Academic Conferences", "Workshops", "Fests", "Cultural Shows", "Competitions", "Guest Lectures", "Panel Discussions"]
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white glass p-8 rounded-3xl border border-slate-200 space-y-8"
        >
            <div>
                <h2 className="text-2xl font-bold mb-2">Basic Details</h2>
                <p className="text-slate-500">Let's start with the fundamental information about your event.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700">Event Name <span className="text-red-500">*</span></Label>
                    <Input
                        id="name"
                        placeholder="e.g., Global Tech Summit 2024"
                        value={eventData.name || ""}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="bg-slate-50 border-slate-200"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-700">Description <span className="text-red-500">*</span></Label>
                    <Textarea
                        id="description"
                        placeholder="Describe what your event is about, what attendees can expect..."
                        value={eventData.description || ""}
                        onChange={(e) => updateField("description", e.target.value)}
                        className="bg-slate-50 border-slate-200 min-h-[120px]"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-slate-700">Category <span className="text-red-500">*</span></Label>
                        <Select
                            value={eventData.category || ""}
                            onValueChange={(val) => {
                                updateField("category", val);
                                updateField("subcategory", ""); // Reset subcategory when category changes
                            }}
                        >
                            <SelectTrigger className="bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200">
                                {Object.keys(categories).map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-700">Subcategory <span className="text-red-500">*</span></Label>
                        <Select
                            value={eventData.subcategory || ""}
                            onValueChange={(val) => updateField("subcategory", val)}
                            disabled={!eventData.category}
                        >
                            <SelectTrigger className="bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Select Subcategory" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200">
                                {eventData.category && categories[eventData.category]?.map((sub: string) => (
                                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="organization" className="text-slate-700">Organization <span className="text-red-500">*</span></Label>
                        <Input
                            id="organization"
                            placeholder="Who is organizing this?"
                            value={eventData.organization || ""}
                            onChange={(e) => updateField("organization", e.target.value)}
                            className="bg-slate-50 border-slate-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="organizer" className="text-slate-700">Organizer Name (Optional)</Label>
                        <Input
                            id="organizer"
                            placeholder="e.g., John Doe"
                            value={eventData.organizer || ""}
                            onChange={(e) => updateField("organizer", e.target.value)}
                            className="bg-slate-50 border-slate-200"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-between">
                {/* Empty div for spacing on step 1 since there is no prev button */}
                <div />
                <Button onClick={handleNext} className="bg-primary hover:bg-primary-hover font-bold gap-2">
                    Next Step <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}
