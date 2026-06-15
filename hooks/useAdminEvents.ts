import { useEffect } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { EventData } from '@/types';

export const usePendingEvents = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const eventsRef = collection(db, "events");
        const pendingQuery = query(eventsRef, where("isLaunch", "==", false));

        const unsubscribe = onSnapshot(pendingQuery, (snapshot) => {
            const pendingEvents: EventData[] = [];
            snapshot.forEach((doc) => {
                pendingEvents.push({ id: doc.id, ...doc.data() } as EventData);
            });

            queryClient.setQueryData(['pendingEvents'], pendingEvents);
        });

        return () => unsubscribe();
    }, [queryClient]);

    return useQuery({
        queryKey: ['pendingEvents'],
        queryFn: () => [] as EventData[], // Fallback, primarily populated by snapshot
        staleTime: Infinity, // Realtime updates handle staleness
    });
};

export const useLaunchedEvents = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const eventsRef = collection(db, "events");
        const launchedQuery = query(eventsRef, where("isLaunch", "==", true));

        const unsubscribe = onSnapshot(launchedQuery, (snapshot) => {
            const launchedEvents: EventData[] = [];
            snapshot.forEach((doc) => {
                launchedEvents.push({ id: doc.id, ...doc.data() } as EventData);
            });

            queryClient.setQueryData(['launchedEvents'], launchedEvents);
        });

        return () => unsubscribe();
    }, [queryClient]);

    return useQuery({
        queryKey: ['launchedEvents'],
        queryFn: () => [] as EventData[],
        staleTime: Infinity,
    });
};

/** Fetches total and launched event counts for the admin dashboard stats. */
export const useEventCounts = () => {
    return useQuery({
        queryKey: ['eventCounts'],
        queryFn: async () => {
            const allSnap = await getDocs(collection(db, 'events'));
            const launchedSnap = await getDocs(
                query(collection(db, 'events'), where('isLaunch', '==', true))
            );
            return { total: allSnap.size, launched: launchedSnap.size };
        },
        staleTime: 30 * 1000, // re-fetch every 30s
    });
};
