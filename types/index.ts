export interface AuthState {
    user: any | null; // Firebase User
    isAdmin: boolean;
    loading: boolean;
    setUser: (user: any | null) => void;
    setIsAdmin: (isAdmin: boolean) => void;
    setLoading: (loading: boolean) => void;
}

export interface UserProfile {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    organizationName?: string;
    city?: string;
    profileLink?: string;
    eventsCreated?: number;
}

export interface Ticket {
    id?: string;
    name: string;
    price: number | string;
    perks: string;
}

export interface VIP {
    id?: string;
    name: string;
    designation: string;
    image?: string;
}

export interface TimelineEntry {
    id?: string;
    time: string;
    action: string;
}

export interface TimelineDay {
    day: number;
    date: string;
    dateFormatted?: string;
    entries: TimelineEntry[];
}

export interface Location {
    venue: string;
    district: string;
    state: string;
    country: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    geohash?: string;
    geopoint?: {
        latitude: number;
        longitude: number;
    };
}
export interface NotablesData {
    comfortAccessibility?: {
        restroomsAvailable?: string;
        wheelchairAccessible?: string;
    };
    entryAccess?: {
        onSpotPurchase?: string;
        reEntryAllowed?: string;
        ticketCheck?: string;
        ticketsTransferable?: string;
    };
    foodAmenities?: {
        foodAvailable?: string;
        freeWater?: string;
        vegOptions?: string;
    };
    infoAboutEvent?: {
        childFriendly?: string;
        languages?: string[];
        minAge?: string;
        ticketAge?: string;
        petsAllowed?: string;
        venueType?: string;
    };
    rulesRestrictions?: {
        bagsAllowed?: string;
        camerasAllowed?: string;
        smokingAlcoholPermitted?: string;
    };
    timingSchedule?: {
        eventEndTime?: string;
        eventStartTime?: string;
        gateOpeningTime?: string;
        lateEntryPermitted?: string;
    };
    travelParking?: {
        parkingAvailable?: string;
        publicTransportAccess?: string;
    };
    [key: string]: any;
}

export interface EventData {
    id?: string;
    name: string;
    description: string;
    category: string;
    subcategory: string;
    organization: string;
    organizer: string;
    mainImage: string;
    showcaseImages: string[];
    youtubeVideo?: string;
    startDate: string;
    endDate: string;
    startTime: string;
    timeline: TimelineDay[];
    location: Location;
    vips: VIP[];
    externalWebsite?: string;
    contacts: string[];
    tickets: Ticket[];
    instructions: string[];
    prohibitedItems: string[];
    faqs: { question: string; answer: string }[];
    userId?: string;
    isLaunch?: boolean;
    isTrending?: boolean;
    status?: string;
    sparkCount?: number;
    notables?: NotablesData;
    createdAt?: any; // Firestore Timestamp
    launchedAt?: any;
    launchedBy?: string;
}
