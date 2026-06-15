'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthStore } from '@/store/authStore';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,       // data stays fresh for 1 min
                gcTime: 10 * 60 * 1000,     // unused cache lives for 10 min
                retry: 1,                    // one retry on transient errors
                refetchOnWindowFocus: false, // Firebase realtime handles freshness
            },
        },
    }));

    const setUser = useAuthStore((state) => state.setUser);
    const setIsAdmin = useAuthStore((state) => state.setIsAdmin);
    const setLoading = useAuthStore((state) => state.setLoading);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            if (user) {
                try {
                    // Check admin status from Firestore users document
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);
                    const isFirestoreAdmin = userDoc.exists() && userDoc.data()?.isAdmin === true;

                    // Legacy fallback: check specific admin email
                    const isLegacyAdmin = user.email === "sanjudote45@gmail.com";

                    setIsAdmin(isFirestoreAdmin || isLegacyAdmin);
                } catch (err) {
                    console.error('Failed to fetch admin status:', err);
                    setIsAdmin(user.email === "sanjudote45@gmail.com");
                }
            } else {
                setIsAdmin(false);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [setUser, setIsAdmin, setLoading]);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
