import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEvent, updateEvent, launchEvent, rejectEvent, deleteEvent } from '@/lib/firestore';
import { EventData } from '@/types';

// ─── Create Event ────────────────────────────────────────────────────────────

export const useCreateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ eventData, userId, isAdmin }: { eventData: EventData; userId: string; isAdmin: boolean }) =>
            createEvent(eventData, userId, isAdmin),
        onSuccess: () => {
            // New event is pending review — invalidate the user's event list
            queryClient.invalidateQueries({ queryKey: ['userEvents'] });
        },
    });
};

// ─── Update Event ────────────────────────────────────────────────────────────

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ eventId, eventData, isAdmin }: { eventId: string; eventData: Partial<EventData>; isAdmin: boolean }) =>
            updateEvent(eventId, eventData, isAdmin),
        onSuccess: (_, variables) => {
            // Invalidate the specific event and the user's event list
            queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
            queryClient.invalidateQueries({ queryKey: ['userEvents'] });
        },
    });
};

// ─── Launch Event ─────────────────────────────────────────────────────────────

export const useLaunchEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            eventId,
            isTrending,
            adminEmail,
        }: {
            eventId: string;
            isTrending: boolean;
            adminEmail: string | null;
        }) => launchEvent(eventId, isTrending, adminEmail),
        onSuccess: () => {
            // The realtime snapshots will update the lists automatically,
            // but we invalidate counts here to keep the stats cards accurate.
            queryClient.invalidateQueries({ queryKey: ['eventCounts'] });
            // Also invalidate specific event in case it's cached
            queryClient.invalidateQueries({ queryKey: ['event'] });
        },
    });
};

// ─── Reject Event ─────────────────────────────────────────────────────────────

export const useRejectEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            eventId,
            adminEmail,
        }: {
            eventId: string;
            adminEmail: string | null;
        }) => rejectEvent(eventId, adminEmail),
        onSuccess: () => {
            // Pending list is realtime; just keep counts fresh
            queryClient.invalidateQueries({ queryKey: ['eventCounts'] });
        },
    });
};

// ─── Delete Event ─────────────────────────────────────────────────────────────

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ eventId }: { eventId: string }) => deleteEvent(eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['eventCounts'] });
            queryClient.invalidateQueries({ queryKey: ['launchedEvents'] });
            queryClient.invalidateQueries({ queryKey: ['pendingEvents'] });
        },
    });
};
