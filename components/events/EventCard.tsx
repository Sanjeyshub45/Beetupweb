import { EventData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarDays, MapPin, Eye, Link2, Globe, Ticket, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface EventCardProps {
    event: EventData;
    isAdminView?: boolean;
}

export function EventStatusBadge({ isLaunch, status, isTrending }: { isLaunch?: boolean; status?: string; isTrending?: boolean }) {
    if (isTrending) {
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1 text-xs uppercase tracking-wider">Trending</Badge>;
    }
    if (isLaunch || status === "launched") {
        return <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 font-bold px-3 py-1 text-xs uppercase tracking-wider">Launched</Badge>;
    }
    if (status === "rejected") {
        return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-3 py-1 text-xs uppercase tracking-wider">Rejected</Badge>;
    }
    return <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 font-bold px-3 py-1 text-xs uppercase tracking-wider">Pending</Badge>;
}

function AdminDetailView({ event }: { event: EventData }) {
    return (
        <div className="space-y-5 text-sm max-h-[70vh] overflow-y-auto pr-1">
            {/* Hero image */}
            {event.mainImage && (
                <div className="rounded-xl overflow-hidden h-48 w-full bg-slate-100">
                    <img src={event.mainImage} alt={event.name} className="w-full h-full object-cover" />
                </div>
            )}

            {/* Status + category */}
            <div className="flex items-center gap-2 flex-wrap">
                <EventStatusBadge isLaunch={event.isLaunch} status={event.status} isTrending={event.isTrending} />
                {event.category && (
                    <Badge variant="outline" className="border-slate-300 text-slate-600">{event.category}</Badge>
                )}
                {event.subcategory && (
                    <Badge variant="outline" className="border-slate-200 text-slate-500 text-xs">{event.subcategory}</Badge>
                )}
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 text-slate-500">
                <div className="space-y-1">
                    <p className="text-slate-500 text-xs uppercase tracking-wide">Organizer</p>
                    <p className="text-slate-900 font-medium">{event.organization || "N/A"}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-slate-500 text-xs uppercase tracking-wide">Contact</p>
                    <p className="text-slate-900 font-medium">{event.contacts?.[0] || "N/A"}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-slate-500 text-xs uppercase tracking-wide">Start Date</p>
                    <p className="text-slate-900 font-medium flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5 text-primary" />
                        {event.startDate ? format(new Date(event.startDate), "MMM dd, yyyy") : "TBA"}
                        {event.startTime && <span className="text-slate-500 ml-1">· {event.startTime}</span>}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-slate-500 text-xs uppercase tracking-wide">End Date</p>
                    <p className="text-slate-900 font-medium">
                        {event.endDate ? format(new Date(event.endDate), "MMM dd, yyyy") : "TBA"}
                    </p>
                </div>
                <div className="col-span-2 space-y-1">
                    <p className="text-slate-500 text-xs uppercase tracking-wide">Location</p>
                    <p className="text-slate-900 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {[event.location?.venue, event.location?.district, event.location?.state].filter(Boolean).join(", ") || "TBA"}
                    </p>
                </div>
            </div>

            {/* Description */}
            {event.description && (
                <div className="space-y-1">
                    <p className="text-slate-500 text-xs uppercase tracking-wide">Description</p>
                    <p className="text-slate-500 leading-relaxed">{event.description}</p>
                </div>
            )}

            {/* Tickets */}
            {event.tickets?.length > 0 && (
                <div className="space-y-2">
                    <p className="text-slate-500 text-xs uppercase tracking-wide flex items-center gap-1">
                        <Ticket className="w-3 h-3" /> Tickets
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {event.tickets.map((t, i) => (
                            <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-900/5 border border-slate-200 text-xs">
                                <span className="font-semibold text-slate-900">{t.name}</span>
                                <span className="text-slate-500 ml-2">₹{t.price}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* VIPs */}
            {event.vips?.length > 0 && (
                <div className="space-y-2">
                    <p className="text-slate-500 text-xs uppercase tracking-wide flex items-center gap-1">
                        <Users className="w-3 h-3" /> VIPs
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {event.vips.map((v, i) => (
                            <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-900/5 border border-slate-200 text-xs">
                                <span className="font-semibold text-slate-900">{v.name}</span>
                                <span className="text-slate-500 ml-1">· {v.designation}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* External link */}
            {event.externalWebsite && (
                <a href={event.externalWebsite} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline text-xs">
                    <Globe className="w-3.5 h-3.5" />
                    {event.externalWebsite}
                </a>
            )}
        </div>
    );
}

export function EventCard({ event, isAdminView = false }: EventCardProps) {
    const formattedDate = event.startDate ? format(new Date(event.startDate), "MMM dd, yyyy") : "TBA";

    const card = (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white glass rounded-2xl overflow-hidden border border-slate-200 flex flex-col h-full group"
        >
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                {event.mainImage ? (
                    <img
                        src={event.mainImage}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500/50">
                        No image
                    </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                    <EventStatusBadge isLaunch={event.isLaunch} status={event.status} isTrending={event.isTrending} />
                </div>
                <div className="absolute top-4 left-4">
                    <Badge variant="outline" className="bg-slate-200 backdrop-blur-md border-slate-300 text-slate-900">
                        {event.category}
                    </Badge>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {event.name || "Untitled Event"}
                </h3>

                <div className="flex flex-col gap-2 mb-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        <span>{formattedDate} • {event.startTime || "TBA"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="line-clamp-1">{event.location?.venue || "TBA"}, {event.location?.district}</span>
                    </div>
                </div>

                <p className="text-slate-500/80 text-sm line-clamp-2 mb-6 flex-grow">
                    {event.description || "No description provided."}
                </p>

                <div className="pt-4 border-t border-slate-200 mt-auto flex justify-between items-center">
                    <div className="text-sm font-medium text-slate-900">
                        <span className="text-slate-500 mr-2">By</span>
                        {event.organization || "Organizer"}
                    </div>

                    {isAdminView ? (
                        /* Eye button wrapped in DialogTrigger — handled by parent Dialog */
                        <div className="w-10 h-10 rounded-full bg-slate-900/5 border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-primary hover:border-primary transition-all">
                            <Eye className="w-5 h-5" />
                        </div>
                    ) : (
                        <Link
                            href={`/edit-event/${event.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}--${event.id}`}
                            className="w-10 h-10 rounded-full bg-slate-900/5 border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-primary hover:border-primary transition-all group-hover:animate-pulse"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );

    if (isAdminView) {
        return (
            <Dialog>
                <DialogTrigger className="block w-full text-left h-full">
                    {card}
                </DialogTrigger>
                <DialogContent className="max-w-lg bg-white border-slate-200 text-slate-900 p-6 rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900">{event.name}</DialogTitle>
                    </DialogHeader>
                    <AdminDetailView event={event} />
                </DialogContent>
            </Dialog>
        );
    }

    return card;
}
