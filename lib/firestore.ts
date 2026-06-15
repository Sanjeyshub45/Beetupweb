import { db } from "./firebase";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
    addDoc,
    serverTimestamp,
    getCountFromServer,
    Timestamp,
    GeoPoint,
    deleteDoc
} from "firebase/firestore";
import { EventData, UserProfile } from "@/types";

// User Profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as UserProfile;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    try {
        const docRef = doc(db, "users", uid);
        await setDoc(docRef, data, { merge: true });
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

export const getUserEventsCount = async (uid: string): Promise<number> => {
    try {
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("userId", "==", uid));
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
    } catch (error) {
        console.error("Error fetching event count:", error);
        return 0;
    }
}

// Events
export const getUserEvents = async (userId: string): Promise<EventData[]> => {
    try {
        const eventsRef = collection(db, "events");
        const userEventsQuery = query(eventsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(userEventsQuery);

        const events: EventData[] = [];
        querySnapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() } as EventData);
        });

        // Sort client-side by createdAt (descending)
        return events.sort((a, b) => {
            const dateA = a.createdAt?.toMillis?.() || 0;
            const dateB = b.createdAt?.toMillis?.() || 0;
            return dateB - dateA;
        });
    } catch (error) {
        console.error("Error loading events:", error);
        throw error;
    }
};

export const getEvent = async (eventId: string): Promise<EventData | null> => {
    try {
        const docRef = doc(db, "events", eventId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return { id: docSnap.id, ...data } as EventData;
        }
        return null;
    } catch (error) {
        console.error("Error fetching event:", error);
        throw error;
    }
};

export const createEvent = async (eventData: EventData, userId: string, isAdmin: boolean = false) => {
    try {
        const { notables, tickets, isLaunch, isTrending, status, ...restEventData } = eventData as any;

        // Coerce ticket prices to numbers
        const normalizedTickets = (tickets || []).map((t: any) => ({
            ...t,
            price: typeof t.price === 'string' ? parseFloat(t.price) || 0 : t.price,
        }));

        // Build notables — languages live in notables.infoAboutEvent.languages; strip any stale top-level key
        const { languages: _staleNotablesLang, ...restNotables } = (notables || {}) as any;
        const cleanNotables = {
            ...restNotables,
            infoAboutEvent: {
                ...(restNotables.infoAboutEvent || {}),
            }
        };

        const newEvent: any = {
            ...restEventData,
            tickets: normalizedTickets,
            notables: cleanNotables,
            userId,
            createdAt: serverTimestamp(),
            isLaunch: false,                          // always false on create; use approve action to launch
            isTrending: isAdmin ? !!isTrending : false, // only admin can mark trending at create time
            status: "pending"
        };

        // Handle GeoPoint — write both coordinates and geopoint for geo-queries
        if (eventData.location?.coordinates) {
            const { lat, lng } = eventData.location.coordinates;
            newEvent.location = {
                ...newEvent.location,
                geopoint: new GeoPoint(lat, lng),
            };
        }

        const docRef = await addDoc(collection(db, "events"), newEvent);
        return docRef.id;
    } catch (error) {
        console.error("Error creating event:", error);
        throw error;
    }
};

export const updateEvent = async (eventId: string, eventData: Partial<EventData>, isAdmin: boolean = false) => {
    try {
        const docRef = doc(db, "events", eventId);
        const { notables, tickets, isLaunch, isTrending, status, ...restEventData } = eventData as any;

        const updatePayload: any = {
            ...restEventData,
            updatedAt: serverTimestamp()
        };

        if (isAdmin) {
            // isTrending is freely togglable by admin via the edit form
            if (isTrending !== undefined) {
                updatePayload.isTrending = isTrending;
            }
            // NOTE: isLaunch is intentionally NOT updated here.
            // It is exclusively managed by launchEvent() / rejectEvent() on the admin dashboard.
        }

        // Coerce ticket prices to numbers if tickets are being updated
        if (tickets !== undefined) {
            updatePayload.tickets = tickets.map((t: any) => ({
                ...t,
                price: typeof t.price === 'string' ? parseFloat(t.price as string) || 0 : t.price,
            }));
        }

        // Handle notables update — always clean up stale notables.languages
        if (notables !== undefined) {
            const { languages: _stale, ...restNotables } = (notables || {}) as any;
            updatePayload.notables = {
                ...restNotables,
                infoAboutEvent: {
                    ...(restNotables.infoAboutEvent || {}),
                }
            };
        }

        // Re-write geopoint if location/coordinates are being updated
        if (eventData.location?.coordinates) {
            const { lat, lng } = eventData.location.coordinates;
            updatePayload.location = {
                ...(updatePayload.location || eventData.location),
                geopoint: new GeoPoint(lat, lng),
            };
        }

        await updateDoc(docRef, updatePayload);
    } catch (error) {
        console.error("Error updating event:", error);
        throw error;
    }
};

// Admin Functions
export const rejectEvent = async (eventId: string, adminEmail: string | null) => {
    try {
        const eventRef = doc(db, "events", eventId);
        await updateDoc(eventRef, {
            isLaunch: false,
            status: "rejected",
            rejectedAt: serverTimestamp(),
            rejectedBy: adminEmail || 'unknown'
        });
    } catch (error) {
        console.error("Error rejecting event:", error);
        throw error;
    }
};

export const launchEvent = async (eventId: string, isTrending: boolean, adminEmail: string | null) => {
    try {
        const eventRef = doc(db, "events", eventId);
        await updateDoc(eventRef, {
            isLaunch: true,
            isTrending: isTrending,
            status: "launched",
            launchedAt: serverTimestamp(),
            launchedBy: adminEmail || 'unknown'
        });
    } catch (error) {
        console.error("Error launching event:", error);
        throw error;
    }
};

export const deleteEvent = async (eventId: string) => {
    try {
        const eventRef = doc(db, "events", eventId);
        await deleteDoc(eventRef);
    } catch (error) {
        console.error("Error deleting event:", error);
        throw error;
    }
};
