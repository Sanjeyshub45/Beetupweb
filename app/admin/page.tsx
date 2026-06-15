"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ShieldCheck, LogOut, CheckCircle, Tag, User, CalendarDays, Rocket, Eye, Flame, Edit, Clock, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { usePendingEvents, useLaunchedEvents, useEventCounts } from "@/hooks/useAdminEvents";
import { useLaunchEvent, useDeleteEvent } from "@/hooks/useEventMutations";
import { logoutUser } from "@/lib/auth";
import { EventData } from "@/types";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
    const router = useRouter();
    const { user, isAdmin, loading: authLoading } = useAuthStore();
    const { data: pendingEvents, isLoading: pendingLoading } = usePendingEvents();
    const { data: launchedEventsList, isLoading: launchedLoading } = useLaunchedEvents();
    const { data: eventCounts, isLoading: countsLoading } = useEventCounts();
    const launchEventMutation = useLaunchEvent();
    const deleteEventMutation = useDeleteEvent();

    const [viewMode, setViewMode] = useState<"pending" | "launched">("pending");
    const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

    // Guard route
    useEffect(() => {
        if (!authLoading && (!user || !isAdmin)) {
            router.push("/");
        }
    }, [user, isAdmin, authLoading, router]);

    if (authLoading || (user && pendingLoading) || (user && launchedLoading) || countsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user || !isAdmin) return null;

    const handleLaunch = async (eventId: string, eventName: string) => {
        if (!eventId || processingIds.has(eventId)) return;

        if (!confirm(`Are you sure you want to approve "${eventName}"?\n\nThis will make the event visible to all users.`)) {
            return;
        }

        const isTrending = (document.getElementById(`trending-${eventId}`) as HTMLInputElement)?.checked || false;
        setProcessingIds((prev) => new Set(prev).add(eventId));

        try {
            await launchEventMutation.mutateAsync({
                eventId,
                isTrending,
                adminEmail: user?.email || "admin",
            });
            toast.success(`Event "${eventName}" approved successfully!${isTrending ? ' 🔥 Marked as Trending' : ''}`);
            setSelectedEvent(null); // Close modal if open
            // Cache is auto-invalidated by useLaunchEvent — no manual state update needed
        } catch {
            toast.error("Failed to launch event.");
        } finally {
            setProcessingIds((prev) => { const s = new Set(prev); s.delete(eventId); return s; });
        }
    };

    const handleDelete = async (eventId: string, eventName: string) => {
        if (!eventId || processingIds.has(eventId)) return;

        if (!confirm(`Are you sure you want to delete "${eventName}"?\n\nThis action cannot be undone.`)) {
            return;
        }

        setProcessingIds((prev) => new Set(prev).add(eventId));

        try {
            await deleteEventMutation.mutateAsync({ eventId });
            toast.success(`Event "${eventName}" deleted successfully!`);
            setSelectedEvent(null); // Close modal if open
        } catch {
            toast.error("Failed to delete event.");
        } finally {
            setProcessingIds((prev) => { const s = new Set(prev); s.delete(eventId); return s; });
        }
    };

    const handleLogout = async () => {
        if (confirm('Are you sure you want to logout?')) {
            await logoutUser();
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ─── LEGACY ADMIN HEADER ─── */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <img
                            src="/beetuplogo.png"
                            alt="Beetup by Fnext"
                            className="h-12 w-auto object-contain"
                            draggable={false}
                        />
                    </div>

                    <nav className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-2 text-primary font-medium">
                            <ShieldCheck className="w-5 h-5" />
                            Admin Panel
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 bg-slate-100 flex items-center justify-center">
                            <span className="font-bold text-slate-500 text-sm">A</span>
                        </div>
                    </nav>
                </div>
            </header>

            {/* ─── MAIN CONTAINER ─── */}
            <main className="max-w-[1400px] mx-auto pt-40 px-6 pb-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
                </div>

                {/* ─── STATS GRID ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <button
                        onClick={() => setViewMode("pending")}
                        className={`text-left border rounded-2xl p-6 shadow-sm transition-all duration-200 ${viewMode === "pending"
                            ? "bg-blue-50 border-blue-200 ring-2 ring-blue-500/20"
                            : "bg-white border-slate-200 hover:border-blue-300"
                            }`}
                    >
                        <h3 className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-500" /> Pending Review
                        </h3>
                        <div className="text-4xl font-black text-slate-900">{pendingEvents?.length || 0}</div>
                    </button>
                    <button
                        onClick={() => setViewMode("launched")}
                        className={`text-left border rounded-2xl p-6 shadow-sm transition-all duration-200 ${viewMode === "launched"
                            ? "bg-green-50 border-green-200 ring-2 ring-green-500/20"
                            : "bg-white border-slate-200 hover:border-green-300"
                            }`}
                    >
                        <h3 className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2">
                            <Rocket className="w-4 h-4 text-green-500" /> Approved Events
                        </h3>
                        <div className="text-4xl font-black text-slate-900">{eventCounts?.launched ?? 0}</div>
                    </button>
                </div>

                {/* ─── EVENT LIST SECTION ─── */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">
                        {viewMode === "pending" ? "Pending Approval" : "Approved Events"}
                    </h2>

                    <div className="space-y-4">
                        {(viewMode === "pending" ? pendingEvents : launchedEventsList)?.length === 0 ? (
                            <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <CheckCircle className={`w-12 h-12 mx-auto mb-4 opacity-50 ${viewMode === 'pending' ? 'text-green-500' : 'text-slate-400'}`} />
                                <p className="font-semibold">{viewMode === "pending" ? "No pending events. You're all caught up!" : "No approved events yet."}</p>
                            </div>
                        ) : (
                            (viewMode === "pending" ? pendingEvents : launchedEventsList)?.map((event) => (
                                <div key={event.id} className="group bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
                                    {/* Image */}
                                    <img
                                        src={event.mainImage || 'https://via.placeholder.com/120'}
                                        alt={event.name}
                                        className="w-full md:w-[120px] h-[120px] object-cover rounded-lg flex-shrink-0 bg-slate-200"
                                    />

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{event.name}</h3>
                                        <p className="text-slate-500 text-sm mb-3 line-clamp-2">{event.description || 'No description'}</p>

                                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mb-3">
                                            <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {event.category || 'Uncategorized'}</span>
                                            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {event.organization || 'Unknown'}</span>
                                            <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {event.startDate ? format(new Date(event.startDate), "MMM dd, yyyy") : 'No date'}</span>
                                        </div>

                                        <div className="flex items-center gap-4 mt-2">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wider ${event.status === 'launched' || event.isLaunch
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {event.status === 'launched' || event.isLaunch ? 'Active' : 'Pending'}
                                            </span>

                                            {viewMode === "pending" && (
                                                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 select-none shadow-sm hover:bg-slate-50 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        id={`trending-${event.id}`}
                                                        className="w-4 h-4 text-primary bg-white border-slate-300 rounded focus:ring-primary accent-primary"
                                                    />
                                                    <Flame className="w-3.5 h-3.5 text-orange-500" /> Multi-city / Trending
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                                        {viewMode === "pending" && (
                                            <button
                                                onClick={() => handleLaunch(event.id!, event.name)}
                                                disabled={processingIds.has(event.id!)}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                {processingIds.has(event.id!) ? 'Approving...' : 'Approve'}
                                            </button>
                                        )}
                                        <div className="flex flex-row gap-3 w-full">
                                            <button
                                                onClick={() => router.push(`/edit-event/${event.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}--${event.id}`)}
                                                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-lg transition-all shadow-sm"
                                            >
                                                <Edit className="w-4 h-4" /> Edit
                                            </button>
                                            <button
                                                onClick={() => setSelectedEvent(event)}
                                                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 text-slate-600 font-bold rounded-lg transition-all shadow-sm"
                                            >
                                                <Eye className="w-4 h-4" /> Details
                                            </button>
                                        </div>
                                        {viewMode === "launched" && (
                                            <button
                                                onClick={() => handleDelete(event.id!, event.name)}
                                                disabled={processingIds.has(event.id!)}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 active:scale-95 font-bold rounded-lg border border-red-200 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                {processingIds.has(event.id!) ? 'Deleting...' : 'Delete'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* ─── LEGACY DETAIL MODAL ─── */}
            <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white border border-slate-200 p-8 rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-slate-900">Event Details</DialogTitle>
                    </DialogHeader>

                    {selectedEvent && (
                        <div className="mt-4 space-y-6 text-sm text-slate-700">
                            <div>
                                <img
                                    src={selectedEvent.mainImage || 'https://via.placeholder.com/800x400'}
                                    alt={selectedEvent.name}
                                    className="w-full h-auto max-h-[300px] object-cover rounded-xl mb-4 bg-slate-100"
                                />
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedEvent.name}</h2>
                                <p className="text-slate-600 leading-relaxed">{selectedEvent.description || 'No description'}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <strong className="text-slate-900 block mb-1">Category:</strong>
                                    {selectedEvent.category || 'N/A'}
                                </div>
                                <div>
                                    <strong className="text-slate-900 block mb-1">Organizer:</strong>
                                    {selectedEvent.organizer || 'N/A'}
                                </div>
                                <div>
                                    <strong className="text-slate-900 block mb-1">Organization:</strong>
                                    {selectedEvent.organization || 'N/A'}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <strong className="text-slate-900 block mb-1">Start Date:</strong>
                                    {selectedEvent.startDate ? format(new Date(selectedEvent.startDate), "MMM dd, yyyy") : 'No date'}
                                </div>
                                <div>
                                    <strong className="text-slate-900 block mb-1">End Date:</strong>
                                    {selectedEvent.endDate ? format(new Date(selectedEvent.endDate), "MMM dd, yyyy") : 'No date'}
                                </div>
                                <div>
                                    <strong className="text-slate-900 block mb-1">Start Time:</strong>
                                    {selectedEvent.startTime || 'N/A'}
                                </div>
                            </div>

                            <div>
                                <strong className="text-slate-900 block mb-1">Location:</strong>
                                {[selectedEvent.location?.venue, selectedEvent.location?.district, selectedEvent.location?.state, selectedEvent.location?.country].filter(Boolean).join(", ") || 'N/A'}
                            </div>

                            {selectedEvent.tickets && selectedEvent.tickets.length > 0 && (
                                <div>
                                    <strong className="text-slate-900 block mb-2">Tickets:</strong>
                                    <div className="space-y-2">
                                        {selectedEvent.tickets.map((t, i) => (
                                            <div key={i} className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                                                <strong className="text-slate-900">{t.name}</strong> — ₹{t.price}
                                                {t.perks && <div className="text-slate-500 text-xs mt-1">{t.perks}</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedEvent.contacts && selectedEvent.contacts.length > 0 && (
                                <div>
                                    <strong className="text-slate-900 block mb-1">Contacts:</strong>
                                    {selectedEvent.contacts.join(', ')}
                                </div>
                            )}

                            <div className="pt-6 border-t border-slate-200 space-y-4">
                                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer bg-slate-50 px-4 py-3 rounded-lg border border-slate-200 select-none w-fit">
                                    <input
                                        type="checkbox"
                                        id={`trending-modal-${selectedEvent.id}`}
                                        className="w-4 h-4 text-primary bg-white border-slate-300 rounded focus:ring-primary accent-primary"
                                    />
                                    <Flame className="w-4 h-4 text-orange-500" /> Mark as Trending
                                </label>

                                <button
                                    onClick={() => handleLaunch(selectedEvent.id!, selectedEvent.name)}
                                    disabled={processingIds.has(selectedEvent.id!)}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Rocket className="w-5 h-5" />
                                    {processingIds.has(selectedEvent.id!) ? 'Launching...' : 'Launch This Event'}
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
