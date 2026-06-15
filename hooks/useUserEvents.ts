import { useQuery } from '@tanstack/react-query';
import { getUserEvents, getEvent } from '@/lib/firestore';

export const useUserEvents = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['userEvents', userId],
        queryFn: () => userId ? getUserEvents(userId) : [],
        enabled: !!userId,
    });
};

export const useEvent = (eventId: string | undefined) => {
    return useQuery({
        queryKey: ['event', eventId],
        queryFn: () => eventId ? getEvent(eventId) : null,
        enabled: !!eventId,
    });
};
