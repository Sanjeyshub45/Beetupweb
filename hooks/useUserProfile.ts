import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile, getUserEventsCount } from '@/lib/firestore';

export const useUserProfile = (uid: string | undefined) => {
    return useQuery({
        queryKey: ['userProfile', uid],
        queryFn: () => uid ? getUserProfile(uid) : null,
        enabled: !!uid,
    });
};

export const useUserEventsCount = (uid: string | undefined) => {
    return useQuery({
        queryKey: ['userEventsCount', uid],
        queryFn: () => uid ? getUserEventsCount(uid) : 0,
        enabled: !!uid,
    });
};

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ uid, data }: { uid: string, data: any }) => updateUserProfile(uid, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', variables.uid] });
        },
    });
};
