import { create } from 'zustand';
import { EventData, TimelineDay, VIP, Ticket, Location, NotablesData } from '@/types';

interface EventFormState {
    currentStep: number;
    eventData: Partial<EventData>;
    uploadSessionKey: string; // stable key for grouping all uploads for one event session

    // Actions
    nextStep: () => void;
    prevStep: () => void;
    setStep: (step: number) => void;

    // Update fields
    updateField: (field: keyof EventData, value: any) => void;
    updateNotableField: (category: keyof NotablesData, field: string, value: any) => void;


    // Complex updates
    updateLocation: (locationData: Location) => void;
    updateTimeline: (timeline: TimelineDay[]) => void;

    // Arrays
    addVIP: (vip: VIP) => void;
    removeVIP: (index: number) => void;
    updateVIP: (index: number, vip: VIP) => void;

    addTicket: (ticket: Ticket) => void;
    removeTicket: (index: number) => void;
    updateTicket: (index: number, ticket: Ticket) => void;

    addToList: (listName: "showcaseImages" | "contacts" | "instructions" | "prohibitedItems", item: string) => void;
    removeFromList: (listName: "showcaseImages" | "contacts" | "instructions" | "prohibitedItems", index: number) => void;
    updateInList: (listName: "showcaseImages" | "contacts" | "instructions" | "prohibitedItems", index: number, item: string) => void;

    addFaq: (faq: { question: string; answer: string }) => void;
    removeFaq: (index: number) => void;
    updateFaq: (index: number, faq: { question: string; answer: string }) => void;

    // Reset
    resetForm: () => void;
    setInitialData: (data: Partial<EventData>) => void;
}

const initialEventData: Partial<EventData> = {
    name: '',
    description: '',
    category: '',
    subcategory: '',
    organization: '',
    mainImage: '',
    showcaseImages: [],
    youtubeVideo: '',
    startDate: '',
    endDate: '',
    startTime: '',
    timeline: [],
    location: { venue: '', district: '', state: '', country: '' },
    vips: [],
    externalWebsite: '',
    contacts: [],
    tickets: [{ name: '', price: '', perks: '' }], // 1 default empty ticket 
    instructions: [],
    prohibitedItems: [],
    faqs: [],
    isLaunch: false,
    isTrending: false,
    sparkCount: 0,
    notables: {
        comfortAccessibility: {},
        entryAccess: {},
        foodAmenities: {},
        infoAboutEvent: {},
        rulesRestrictions: {},
        timingSchedule: {},
        travelParking: {}
    }
};

export const useEventFormStore = create<EventFormState>((set) => ({
    currentStep: 1,
    eventData: { ...initialEventData },
    uploadSessionKey: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,

    nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
    prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
    setStep: (step) => set({ currentStep: step }),

    updateField: (field, value) => set((state) => ({
        eventData: { ...state.eventData, [field]: value }
    })),

    updateNotableField: (category, field, value) => set((state) => {
        const currentNotables = state.eventData.notables || {};
        const currentCategory = (currentNotables[category as keyof typeof currentNotables] as Record<string, any>) || {};
        return {
            eventData: {
                ...state.eventData,
                notables: {
                    ...currentNotables,
                    [category]: {
                        ...currentCategory,
                        [field]: value
                    }
                }
            }
        };
    }),

    // Deep updates
    updateLocation: (locationData) => set((state) => ({
        eventData: { ...state.eventData, location: { ...state.eventData.location, ...locationData } }
    })),

    updateTimeline: (timeline) => set((state) => ({
        eventData: { ...state.eventData, timeline }
    })),

    // VIPs
    addVIP: (vip) => set((state) => ({
        eventData: { ...state.eventData, vips: [...(state.eventData.vips || []), vip] }
    })),
    removeVIP: (index) => set((state) => {
        const newVips = [...(state.eventData.vips || [])];
        newVips.splice(index, 1);
        return { eventData: { ...state.eventData, vips: newVips } };
    }),
    updateVIP: (index, vip) => set((state) => {
        const newVips = [...(state.eventData.vips || [])];
        newVips[index] = vip;
        return { eventData: { ...state.eventData, vips: newVips } };
    }),

    // Tickets
    addTicket: (ticket) => set((state) => ({
        eventData: { ...state.eventData, tickets: [...(state.eventData.tickets || []), ticket] }
    })),
    removeTicket: (index) => set((state) => {
        const newTickets = [...(state.eventData.tickets || [])];
        newTickets.splice(index, 1);
        return { eventData: { ...state.eventData, tickets: newTickets } };
    }),
    updateTicket: (index, ticket) => set((state) => {
        const newTickets = [...(state.eventData.tickets || [])];
        newTickets[index] = ticket;
        return { eventData: { ...state.eventData, tickets: newTickets } };
    }),

    // Generic List Methods (Strings)
    addToList: (listName, item) => set((state) => {
        const currentList = state.eventData[listName] as string[] || [];
        return { eventData: { ...state.eventData, [listName]: [...currentList, item] } };
    }),
    removeFromList: (listName, index) => set((state) => {
        const newList = [...(state.eventData[listName] as string[] || [])];
        newList.splice(index, 1);
        return { eventData: { ...state.eventData, [listName]: newList } };
    }),
    updateInList: (listName, index, item) => set((state) => {
        const newList = [...(state.eventData[listName] as string[] || [])];
        newList[index] = item;
        return { eventData: { ...state.eventData, [listName]: newList } };
    }),

    // FAQs
    addFaq: (faq) => set((state) => ({
        eventData: { ...state.eventData, faqs: [...(state.eventData.faqs || []), faq] }
    })),
    removeFaq: (index) => set((state) => {
        const newFaqs = [...(state.eventData.faqs || [])];
        newFaqs.splice(index, 1);
        return { eventData: { ...state.eventData, faqs: newFaqs } };
    }),
    updateFaq: (index, faq) => set((state) => {
        const newFaqs = [...(state.eventData.faqs || [])];
        newFaqs[index] = faq;
        return { eventData: { ...state.eventData, faqs: newFaqs } };
    }),

    resetForm: () => set({ eventData: { ...initialEventData }, currentStep: 1, uploadSessionKey: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}` }),
    setInitialData: (data) => set(() => {
        const merged: any = { ...initialEventData, ...data };
        // Firestore may have stored languages at root level (legacy). Sync it into
        // notables.infoAboutEvent.languages if not already there, then drop the root field.
        const rootLangs: string[] = merged.languages ?? [];
        if (rootLangs.length > 0 && !(merged.notables?.infoAboutEvent?.languages?.length)) {
            merged.notables = {
                ...(merged.notables || initialEventData.notables),
                infoAboutEvent: {
                    ...((merged.notables?.infoAboutEvent) || {}),
                    languages: rootLangs,
                },
            };
        }
        delete merged.languages; // remove stale root-level field
        return { eventData: merged };
    })
}));
