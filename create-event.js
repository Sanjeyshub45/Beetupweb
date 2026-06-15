// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc, GeoPoint } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { geohashForLocation } from "https://cdn.jsdelivr.net/npm/geofire-common@6.0.0/dist/geofire-common/index.esm.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDoNWsZ_atIAUeU7OumFx30hNps0jwW73s",
    authDomain: "beetuponline.firebaseapp.com",
    projectId: "beetuponline",
    storageBucket: "beetuponline.firebasestorage.app",
    messagingSenderId: "520158519722",
    appId: "1:520158519722:web:bacbd2ddfd5f443183cbd3",
    measurementId: "G-GWCD97RZVN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Categories and Subcategories Data
const categoriesData = {
    "Music & Audio": [
        "Concerts",
        "Music Festivals",
        "Live Gigs",
        "Open Mics & Jams",
        "Music Open Mics",
        "Jams",
        "Concert Screenings",
        "Music Conferences & Talks",
        "Music Workshops"
    ],
    "Comedy & Spoken Arts": [
        "Standup Comedy",
        "Improv",
        "Roast",
        "Comedy Open Mics",
        "Literary Open Mics",
        "Poetry & Literary Performances"
    ],
    "Performing Arts & Shows": [
        "Dance Performances",
        "Magic Shows",
        "Fashion Shows",
        "Entertainment & Award Shows",
        "Film & Theatre Fests"
    ],
    "Nightlife & Parties": [
        "Clubbing",
        "DJ Nights",
        "Karaoke Nights",
        "Parties",
        "Pub Crawls"
    ],
    "Sports (Watch)": [
        "Cricket Matches",
        "Football Matches",
        "Hockey Matches",
        "Basketball Matches",
        "Tennis Matches",
        "Badminton Matches",
        "Kabaddi Matches",
        "Athletics",
        "Motorsport Matches",
        "Boxing",
        "MMA",
        "Wrestling",
        "Chess Matches",
        "Baseball Matches"
    ],
    "Sports (Play)": [
        "Cricket",
        "Football",
        "Basketball",
        "Badminton",
        "Tennis",
        "Squash",
        "Padel",
        "Pickleball",
        "Swimming",
        "Golf",
        "Chess",
        "Community Runs"
    ],
    "Fitness & Wellness": [
        "Yoga",
        "Zumba",
        "Pilates",
        "Crossfit",
        "Gymnastics",
        "Wellness Workshops",
        "Marathons",
        "Triathlons",
        "Cycling",
        "Fitness & Wellness Fests"
    ],
    "Adventure & Outdoors": [
        "Treks",
        "Hiking",
        "Camping",
        "Skydiving",
        "Paragliding",
        "Scuba Diving",
        "Surfing",
        "River Rafting",
        "Ziplining",
        "Beach Activities",
        "Bike Riding",
        "Horse Riding",
        "Safaris",
        "Wildlife Experiences"
    ],
    "Games & Experiences": [
        "Escape Rooms",
        "Mystery Rooms",
        "Rage Rooms",
        "VR Rooms",
        "Laser Tag",
        "Paintball",
        "Go Karting",
        "Bowling",
        "Arcades",
        "Skating Arenas",
        "Board Games",
        "Trivia Nights",
        "Treasure Hunts",
        "Esports"
    ],
    "Kids & Family": [
        "Kids Festivals",
        "Play Areas",
        "Kids Theme Parks",
        "Summer Camps",
        "Family Events"
    ],
    "Pets": [
        "Pet Playdates",
        "Pet Carnivals",
        "Pet Shows",
        "Pet Adoption Drives",
        "Pet Wellness Camps",
        "Yoga with Pets",
        "Paint with Pets",
        "Brunch with Pets"
    ],
    "Food & Drinks": [
        "Gourmet Experiences",
        "Food & Beverage Fests",
        "Pop-Ups",
        "Beverage Tastings",
        "Community Dining",
        "Picnics"
    ],
    "Travel & Exploration": [
        "Day Trips",
        "Weekend Getaways",
        "Tours",
        "Cruises",
        "Landmarks",
        "Stargazing"
    ],
    "Attractions & Parks": [
        "Theme Parks",
        "Adventure Parks",
        "Water Parks",
        "Snow Parks",
        "Trampoline Parks",
        "Zoos",
        "Aquariums"
    ],
    "Museums & Heritage": [
        "History Museums",
        "Science Museums",
        "Art Museums",
        "Planetariums",
        "Music Museums",
        "Wax Museums",
        "Illusion Museums",
        "Archaeological Museums",
        "Forts",
        "Palaces",
        "Caves",
        "Ancient Ruins",
        "Temples & Shrines",
        "Stepwells",
        "Iconic Landmarks"
    ],
    "Walks & Trails": [
        "City Walks",
        "Food Walks",
        "Heritage Walks"
    ],
    "Workshops & Learning": [
        "Art & Craft",
        "Photography",
        "Pottery",
        "Culinary",
        "Writing",
        "Music",
        "Dance",
        "Acting",
        "Public Speaking",
        "Fashion & Beauty",
        "Finance",
        "Entrepreneurship",
        "Design",
        "DIY",
        "Languages",
        "Martial Arts",
        "Motorsport",
        "Tech",
        "Filmmaking"
    ],
    "Conferences, Expos & Networking": [
        "Tech Conferences",
        "Healthcare Conferences",
        "Business Conferences",
        "Marketing Conferences",
        "Education Conferences",
        "Career Fairs",
        "Startup Expos",
        "Trade Shows",
        "Auto Expos",
        "Community Meetups",
        "Dating Events"
    ],
    "Fests, Fairs & Celebrations": [
        "Literary Fests",
        "Art Fairs",
        "Craft Bazaars",
        "Flea Markets",
        "Carnivals",
        "Cultural Festivals",
        "Religious Festivals",
        "Seasonal Celebrations",
        "Pride Events"
    ],
    "Screenings & Watch Parties": [
        "Cricket Screenings",
        "Football Screenings",
        "F1 Screenings",
        "Movie Screenings",
        "Olympics Screenings"
    ],
    "College Events": [
        "Symposiums",
        "Academic Conferences",
        "Workshops",
        "Fests",
        "Cultural Shows",
        "Competitions",
        "Guest Lectures",
        "Panel Discussions"
    ]
};

// Multi-Step Wizard Logic
let currentStep = 1;
const totalSteps = 6;

// Initialize wizard on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeWizard();
    initializeCategoryDropdowns();
});

function initializeWizard() {
    // Set up navigation
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (nextBtn) nextBtn.addEventListener('click', () => changeStep(1));
    if (prevBtn) prevBtn.addEventListener('click', () => changeStep(-1));

    // Show first step
    showStep(currentStep);
}


function showStep(step) {
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Hide all steps
    steps.forEach(s => s.classList.remove('active'));

    // Show current step
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }

    // Update progress indicator
    progressSteps.forEach((ps, index) => {
        ps.classList.remove('active', 'completed');
        if (index + 1 < step) {
            ps.classList.add('completed');
        } else if (index + 1 === step) {
            ps.classList.add('active');
        }
    });

    // Update navigation buttons
    if (prevBtn) prevBtn.style.display = step === 1 ? 'none' : 'flex';
    if (nextBtn) nextBtn.style.display = step === totalSteps ? 'none' : 'flex';
    if (submitBtn) submitBtn.style.display = step === totalSteps ? 'flex' : 'none';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function changeStep(direction) {
    const newStep = currentStep + direction;

    if (newStep < 1 || newStep > totalSteps) return;

    // Validate current step before moving forward
    if (direction > 0 && !validateStep(currentStep)) {
        return;
    }

    currentStep = newStep;
    showStep(currentStep);
}

function validateStep(step) {
    const stepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (!stepEl) return true;

    const requiredInputs = stepEl.querySelectorAll('[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;

            // Reset border color on input
            input.addEventListener('input', function () {
                this.style.borderColor = '';
            }, { once: true });
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields before proceeding.');
    }

    return isValid;
}

// Initialize Category and Subcategory Dropdowns
function initializeCategoryDropdowns() {
    const categorySelect = document.getElementById('category');
    const subcategorySelect = document.getElementById('subcategory');

    if (!categorySelect || !subcategorySelect) return;

    // Populate category dropdown
    Object.keys(categoriesData).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    // Handle category change
    categorySelect.addEventListener('change', function () {
        const selectedCategory = this.value;

        // Clear and reset subcategory dropdown
        subcategorySelect.innerHTML = '<option value="">Select a subcategory...</option>';

        if (selectedCategory && categoriesData[selectedCategory]) {
            // Enable subcategory dropdown
            subcategorySelect.disabled = false;

            // Populate subcategories
            categoriesData[selectedCategory].forEach(subcategory => {
                const option = document.createElement('option');
                option.value = subcategory;
                option.textContent = subcategory;
                subcategorySelect.appendChild(option);
            });
        } else {
            // Disable subcategory dropdown if no category selected
            subcategorySelect.disabled = true;
            subcategorySelect.innerHTML = '<option value="">Select a category first...</option>';
        }

        // Trigger save for local storage
        saveFormData();
    });

    // Also save when subcategory changes
    subcategorySelect.addEventListener('change', saveFormData);
}



// Auth Guard & Header Profile
const headerProfileImg = document.getElementById('header-profile-img');

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Authorized user:", user.uid);

        // Fetch User Profile for Header
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().profileLink) {
                if (headerProfileImg) headerProfileImg.src = docSnap.data().profileLink;
            }
        } catch (e) {
            console.error(e);
        }

    } else {
        window.location.href = "auth.html";
    }
});

// Initialize Google Places Autocomplete
function initAutocomplete() {
    const venueInput = document.getElementById('venue');
    const districtInput = document.getElementById('district');

    // Venue Autocomplete
    if (venueInput) {
        const venueAutocomplete = new google.maps.places.Autocomplete(venueInput, {
            types: ['establishment'],
            fields: ['name', 'address_components', 'formatted_address', 'geometry']
        });

        venueAutocomplete.addListener('place_changed', () => {
            const place = venueAutocomplete.getPlace();

            if (!place) {
                return;
            }

            // Store coordinates
            if (place.geometry && place.geometry.location) {
                window.selectedVenueCoordinates = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                console.log("Venue Coordinates:", window.selectedVenueCoordinates);
            }

            // Set only the place name in the venue field
            if (place.name) {
                venueInput.value = place.name;
            }

            if (!place.address_components) {
                console.log("No address details available for this place");
                return;
            }

            // Extract address components
            let state = '';
            let country = '';

            place.address_components.forEach(component => {
                const types = component.types;

                // State: administrative_area_level_1
                if (types.includes('administrative_area_level_1')) {
                    state = component.long_name;
                }

                // Country
                if (types.includes('country')) {
                    country = component.long_name;
                }
            });

            // Auto-fill only state and country (district will have its own autocomplete)
            if (state) document.getElementById('state').value = state;
            if (country) document.getElementById('country').value = country;
        });
    }

    // District Autocomplete
    if (districtInput) {
        const districtAutocomplete = new google.maps.places.Autocomplete(districtInput, {
            types: ['(cities)'],
            fields: ['name', 'address_components']
        });

        districtAutocomplete.addListener('place_changed', () => {
            const place = districtAutocomplete.getPlace();

            if (!place) {
                return;
            }

            // Set only the city/district name in the district field
            if (place.name) {
                districtInput.value = place.name;
            }

            if (!place.address_components) {
                return;
            }

            // Extract state and country from district selection
            let state = '';
            let country = '';

            place.address_components.forEach(component => {
                const types = component.types;

                // State: administrative_area_level_1
                if (types.includes('administrative_area_level_1')) {
                    state = component.long_name;
                }

                // Country
                if (types.includes('country')) {
                    country = component.long_name;
                }
            });

            // Auto-fill state and country based on district selection
            if (state) document.getElementById('state').value = state;
            if (country) document.getElementById('country').value = country;
        });
    }
}

// Wait for Google Maps API to load, then initialize autocomplete
if (typeof google !== 'undefined' && google.maps && google.maps.places) {
    initAutocomplete();
} else {
    window.addEventListener('load', () => {
        // Wait a bit for async script to load
        const checkGoogleMaps = setInterval(() => {
            if (typeof google !== 'undefined' && google.maps && google.maps.places) {
                clearInterval(checkGoogleMaps);
                initAutocomplete();
            }
        }, 100);
    });
}

// Timeline Generation Logic
let timelineDays = [];

function generateTimelineDays() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const timelineContainer = document.getElementById('timeline-container');

    if (!startDateInput.value || !endDateInput.value) {
        timelineContainer.innerHTML = `
            <p style="color: var(--text-gray); font-size: 0.85rem; font-style: italic; text-align: center; padding: 2rem;">
                Select start and end dates above to generate timeline days
            </p>
        `;
        timelineDays = [];
        return;
    }

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (endDate < startDate) {
        timelineContainer.innerHTML = `
            <p style="color: #ef4444; font-size: 0.85rem; text-align: center; padding: 2rem;">
                End date must be after start date
            </p>
        `;
        timelineDays = [];
        return;
    }

    // Calculate number of days
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    // Generate timeline days
    timelineDays = [];
    timelineContainer.innerHTML = '';

    for (let i = 0; i < daysDiff; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        const dayData = {
            dayNumber: i + 1,
            date: currentDate.toISOString().split('T')[0],
            dateFormatted: currentDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            entries: []
        };

        timelineDays.push(dayData);
        renderTimelineDay(dayData, i);
    }
}

function renderTimelineDay(dayData, dayIndex) {
    const timelineContainer = document.getElementById('timeline-container');

    const dayCard = document.createElement('div');
    dayCard.className = 'timeline-day-card';
    dayCard.dataset.dayIndex = dayIndex;

    dayCard.innerHTML = `
        <div class="timeline-day-header">
            <div>
                <div class="timeline-day-title">Day ${dayData.dayNumber}</div>
                <div class="timeline-day-date">${dayData.dateFormatted}</div>
            </div>
        </div>
        <div class="timeline-entries" id="timeline-entries-${dayIndex}">
            <!-- Timeline entries will be added here -->
        </div>
        <button type="button" class="add-timeline-entry-btn" onclick="addTimelineEntry(${dayIndex})">
            <i class="fas fa-plus"></i> Add Schedule Entry
        </button>
    `;

    timelineContainer.appendChild(dayCard);
}



// Listen for date changes
document.getElementById('startDate').addEventListener('change', generateTimelineDays);
document.getElementById('endDate').addEventListener('change', generateTimelineDays);


// Dynamic Fields Logic
const createRemoveButton = () => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'remove-btn';
    btn.innerHTML = '<i class="fas fa-times"></i>';
    btn.onclick = function () {
        this.parentElement.remove();
        saveFormData(); // Save on removal
    };
    return btn;
};

// Helper function to handle file input change and preview
function handleFileInputChange(input, previewImg) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Main Image Preview
const mainImageInput = document.getElementById('mainImage');
const mainImagePreview = document.getElementById('mainImagePreview');
const mainImagePreviewContainer = document.getElementById('mainImagePreviewContainer');

if (mainImageInput && mainImagePreview) {
    mainImageInput.addEventListener('change', function () {
        handleFileInputChange(this, mainImagePreview);
        mainImagePreviewContainer.style.display = 'block';
    });
}

// Upload Image Helper
async function uploadImage(file, path) {
    if (!file) return null;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}


// Add Showcase Image
function addShowcaseImage(url = '') {
    const container = document.getElementById('showcase-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item';

    // Unique ID for preview
    const uniqueId = Date.now() + Math.random().toString(36).substr(2, 9);

    div.innerHTML = `
        <input type="file" class="auth-input showcase-file" accept="image/*" required>
        <div style="margin-top: 5px;">
             <img id="preview-${uniqueId}" src="" style="width: 100px; border-radius: 5px; display: none;">
        </div>
    `;
    div.appendChild(createRemoveButton());
    container.appendChild(div);

    const input = div.querySelector('.showcase-file');
    const preview = div.querySelector(`#preview-${uniqueId}`);

    input.addEventListener('change', function () {
        handleFileInputChange(this, preview);
    });
}

document.getElementById('add-showcase').addEventListener('click', () => {
    addShowcaseImage();
    saveFormData();
});

// Add VIP
function addVip(name = '', designation = '', image = '') {
    const container = document.getElementById('vip-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item';

    const uniqueId = Date.now() + Math.random().toString(36).substr(2, 9);

    div.innerHTML = `
        <input type="text" class="auth-input vip-name" placeholder="VIP Name" value="${name}" required>
        <input type="text" class="auth-input vip-designation" placeholder="Designation" value="${designation}" required>
        <label>VIP Image</label>
        <input type="file" class="auth-input vip-file" accept="image/*">
        <div style="margin-top: 5px;">
             <img id="preview-${uniqueId}" src="" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; display: none;">
        </div>
    `;
    div.appendChild(createRemoveButton());
    container.appendChild(div);

    const input = div.querySelector('.vip-file');
    const preview = div.querySelector(`#preview-${uniqueId}`);

    input.addEventListener('change', function () {
        handleFileInputChange(this, preview);
    });
}

document.getElementById('add-vip').addEventListener('click', () => {
    addVip();
    saveFormData();
});

// Add Contact
function addContact(detail = '') {
    const container = document.getElementById('contact-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item';

    div.innerHTML = `<input type="text" class="auth-input contact-detail" placeholder="Phone / Email" value="${detail}" required>`;
    div.appendChild(createRemoveButton());
    container.appendChild(div);
}

document.getElementById('add-contact').addEventListener('click', () => {
    addContact();
    saveFormData();
});

// Add Ticket
function addTicket(name = '', price = '', perks = '') {
    const container = document.getElementById('ticket-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item';

    div.innerHTML = `
        <input type="text" class="auth-input ticket-name" placeholder="Pass Name" value="${name}" required>
        <input type="number" class="auth-input ticket-price" placeholder="Price" value="${price}" required>
        <input type="text" class="auth-input ticket-perks" placeholder="Perks (comma separated)" value="${perks}" required>
    `;
    div.appendChild(createRemoveButton());
    container.appendChild(div);
}

document.getElementById('add-ticket').addEventListener('click', () => {
    addTicket();
    saveFormData();
});

// Add Event Instruction
function addInstruction(text = '') {
    const container = document.getElementById('instructions-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item';

    div.innerHTML = `<textarea class="auth-input instruction-text" rows="2" placeholder="Enter instruction (e.g., Pick up point: Main Entrance at 9 AM)" required>${text}</textarea>`;
    div.appendChild(createRemoveButton());
    container.appendChild(div);
}

document.getElementById('add-instruction').addEventListener('click', () => {
    addInstruction();
    saveFormData();
});

// Prohibited Items Management
let prohibitedItems = [];

function addProhibitedItem(itemName) {
    if (itemName && itemName.trim() && prohibitedItems.length < 50) {
        const trimmedItem = itemName.trim();
        if (!prohibitedItems.includes(trimmedItem)) {
            prohibitedItems.push(trimmedItem);
            renderProhibitedItems();
            saveFormData();
        }
    }
}

function removeProhibitedItem(itemName) {
    prohibitedItems = prohibitedItems.filter(item => item !== itemName);
    renderProhibitedItems();
    saveFormData();
}

function renderProhibitedItems() {
    const container = document.getElementById('prohibited-items-list');
    container.innerHTML = prohibitedItems.map(item => `
        <span class="prohibited-item-tag">
            ${item}
            <button type="button" onclick="removeProhibitedItem('${item.replace(/'/g, "\\'")}')">
                <i class="fas fa-times"></i>
            </button>
        </span>
    `).join('');

    // Update suggested items state
    document.querySelectorAll('.suggested-item').forEach(btn => {
        if (prohibitedItems.includes(btn.dataset.item)) {
            btn.classList.add('added');
            btn.disabled = true;
        } else {
            btn.classList.remove('added');
            btn.disabled = false;
        }
    });
}

// Make removeProhibitedItem accessible globally
window.removeProhibitedItem = removeProhibitedItem;

// Add prohibited item from input
document.getElementById('add-prohibited-item').addEventListener('click', () => {
    const input = document.getElementById('prohibited-item-input');
    const itemName = input.value.trim();
    if (itemName) {
        addProhibitedItem(itemName);
        input.value = '';
    }
});

// Add from input on Enter key
document.getElementById('prohibited-item-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('add-prohibited-item').click();
    }
});

// Add suggested items
document.querySelectorAll('.suggested-item').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!btn.classList.contains('added')) {
            addProhibitedItem(btn.dataset.item);
        }
    });
});

// Add FAQ
function addFaq(question = '', answer = '') {
    const container = document.getElementById('faq-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item faq-item';

    div.innerHTML = `
        <label>Question</label>
        <input type="text" class="auth-input faq-question" placeholder="What is the dress code for the event?" value="${question}" required>
        <label>Answer</label>
        <textarea class="auth-input faq-answer" rows="3" placeholder="Inform attendees about the dress expectations, especially for formal or themed events." required>${answer}</textarea>
    `;
    div.appendChild(createRemoveButton());
    container.appendChild(div);
}

document.getElementById('add-faq').addEventListener('click', () => {
    addFaq();
    saveFormData();
});


// ==========================================
// Local Storage Persistence Logic
// ==========================================
const FORM_STORAGE_KEY = 'beetup_event_draft';

// Debounce function to limit excessive writes
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Function to gather all form data object
function getFormDataObject() {
    // 1. Static Inputs
    const staticData = {};
    const inputs = document.querySelectorAll('input:not(.dynamic-item input):not([type="checkbox"]), textarea:not(.dynamic-item textarea), select');
    inputs.forEach(input => {
        if (input.id) {
            staticData[input.id] = input.value;
        }
    });

    // 2. Checkboxes (Languages)
    const languages = Array.from(document.querySelectorAll('input[name="languages"]:checked')).map(cb => cb.value);

    // 3. Dynamic Lists
    // Skip file inputs for local storage
    const showcaseImages = []; // Cannot save file objects to local storage


    const vips = Array.from(document.querySelectorAll('#vip-list .dynamic-item')).map(item => ({
        name: item.querySelector('.vip-name').value,
        designation: item.querySelector('.vip-designation').value,
        image: '' // Cannot save file objects
    }));

    const contacts = Array.from(document.querySelectorAll('.contact-detail')).map(i => i.value);

    const tickets = Array.from(document.querySelectorAll('#ticket-list .dynamic-item')).map(item => ({
        name: item.querySelector('.ticket-name').value,
        price: item.querySelector('.ticket-price').value,
        perks: item.querySelector('.ticket-perks').value
    }));

    const instructions = Array.from(document.querySelectorAll('.instruction-text')).map(i => i.value);

    const faqs = Array.from(document.querySelectorAll('#faq-list .faq-item')).map(item => ({
        question: item.querySelector('.faq-question').value,
        answer: item.querySelector('.faq-answer').value
    }));

    // 4. Timeline
    const timelineData = {
        days: timelineDays, // Using the global variable state
        entries: {}
    };

    // Capture entries for each day
    document.querySelectorAll('.timeline-day-card').forEach((dayCard, dayIndex) => {
        const dayEntries = [];
        const dayEntriesContainer = document.getElementById(`timeline-entries-${dayIndex}`);
        if (dayEntriesContainer) {
            dayEntriesContainer.querySelectorAll('.timeline-entry').forEach(entry => {
                const time = entry.querySelector('.timeline-time').value;
                const action = entry.querySelector('.timeline-action').value;
                dayEntries.push({ time, action });
            });
        }
        timelineData.entries[dayIndex] = dayEntries;
    });

    return {
        staticData,
        languages,
        showcaseImages,
        vips,
        contacts,
        tickets,
        instructions,
        prohibitedItems,
        faqs,
        timelineData
    };
}

// Save function
const saveFormData = debounce(() => {
    const data = getFormDataObject();
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
}, 500);

// Load function
function loadFormData() {
    const storedData = localStorage.getItem(FORM_STORAGE_KEY);
    if (!storedData) return;

    try {
        const data = JSON.parse(storedData);

        // 1. Static Inputs
        if (data.staticData) {
            Object.keys(data.staticData).forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    // Special handling for category - need to trigger change event
                    if (id === 'category' && el.value !== data.staticData[id]) {
                        el.value = data.staticData[id];
                        // Trigger change event to populate subcategories
                        el.dispatchEvent(new Event('change'));

                        // Set subcategory after a brief delay to ensure subcategories are populated
                        setTimeout(() => {
                            const subcategoryEl = document.getElementById('subcategory');
                            if (subcategoryEl && data.staticData.subcategory) {
                                subcategoryEl.value = data.staticData.subcategory;
                            }
                        }, 50);
                    } else if (id !== 'subcategory') {
                        // Skip subcategory here as it's handled above
                        el.value = data.staticData[id];
                    }
                }
            });
        }

        // 2. Checkboxes
        if (data.languages) {
            data.languages.forEach(val => {
                const cb = document.querySelector(`input[name="languages"][value="${val}"]`);
                if (cb) cb.checked = true;
            });
        }

        // 3. Dynamic Lists - Clear and Re-populate

        // Showcase
        const showcaseContainer = document.getElementById('showcase-list');
        showcaseContainer.innerHTML = ''; // Clear default or empty state
        if (data.showcaseImages && data.showcaseImages.length > 0) {
            data.showcaseImages.forEach(url => addShowcaseImage(url));
        }

        // VIPs
        const vipContainer = document.getElementById('vip-list');
        vipContainer.innerHTML = '';
        if (data.vips && data.vips.length > 0) {
            data.vips.forEach(vip => addVip(vip.name, vip.designation, vip.image));
        }

        // Contacts
        const contactContainer = document.getElementById('contact-list');
        contactContainer.innerHTML = '';
        if (data.contacts && data.contacts.length > 0) {
            data.contacts.forEach(c => addContact(c));
        }

        // Tickets
        // Note: HTML might have one default ticket item. Clear it first if we have saved data.
        const ticketContainer = document.getElementById('ticket-list');
        if (data.tickets && data.tickets.length > 0) {
            ticketContainer.innerHTML = '';
            data.tickets.forEach(t => addTicket(t.name, t.price, t.perks));
        }

        // Instructions
        const instructionsContainer = document.getElementById('instructions-list');
        instructionsContainer.innerHTML = '';
        if (data.instructions && data.instructions.length > 0) {
            data.instructions.forEach(i => addInstruction(i));
        }

        // FAQs
        const faqContainer = document.getElementById('faq-list');
        faqContainer.innerHTML = '';
        if (data.faqs && data.faqs.length > 0) {
            data.faqs.forEach(f => addFaq(f.question, f.answer));
        }

        // Prohibited Items
        if (data.prohibitedItems) {
            prohibitedItems = data.prohibitedItems;
            renderProhibitedItems();
        }

        // 4. Timeline
        // If start and end dates are set, regenerate days
        if (data.staticData && data.staticData.startDate && data.staticData.endDate) {
            generateTimelineDays(); // This builds the day cards

            // Restore entries
            if (data.timelineData && data.timelineData.entries) {
                Object.keys(data.timelineData.entries).forEach(dayIndex => {
                    const entries = data.timelineData.entries[dayIndex];
                    entries.forEach(entry => {
                        addTimelineEntry(dayIndex, entry.time, entry.action);
                    });
                });
            }
        }

    } catch (e) {
        console.error("Error loading form data:", e);
    }
}

// Clear function
function clearFormData() {
    localStorage.removeItem(FORM_STORAGE_KEY);
}

// Attach listeners to form
document.getElementById('create-event-form').addEventListener('input', saveFormData);
document.getElementById('create-event-form').addEventListener('change', saveFormData);

// Load data on start
document.addEventListener('DOMContentLoaded', () => {
    // Wait slightly for any other initializations
    setTimeout(loadFormData, 100);
});

// Update addTimelineEntry to support values
function addTimelineEntry(dayIndex, time = '', action = '') {
    const entriesContainer = document.getElementById(`timeline-entries-${dayIndex}`);
    const entryIndex = entriesContainer.children.length;

    const entryDiv = document.createElement('div');
    entryDiv.className = 'timeline-entry';

    entryDiv.innerHTML = `
        <input type="time" class="auth-input timeline-time" name="timeline-time-${dayIndex}-${entryIndex}" placeholder="Time" data-day="${dayIndex}" data-entry="${entryIndex}" value="${time}">
        <input type="text" class="auth-input timeline-action" name="timeline-action-${dayIndex}-${entryIndex}" placeholder="What's happening? (e.g., Registration opens, Main performance, Dinner break)" data-day="${dayIndex}" data-entry="${entryIndex}" value="${action}">
        <button type="button" class="remove-btn" onclick="this.parentElement.remove(); saveFormData();">
            <i class="fas fa-times"></i>
        </button>
    `;

    entriesContainer.appendChild(entryDiv);
    saveFormData();
}
// Make accessible
window.addTimelineEntry = addTimelineEntry;


// Form Submission
document.getElementById('create-event-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate the current step (final step) before submitting
    if (!validateStep(currentStep)) {
        return;
    }

    const submitBtn = e.target.querySelector('.btn-submit');
    submitBtn.textContent = 'Uploading Images...';
    submitBtn.disabled = true;

    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Not authenticated");

        // Generate a unique ID for the event to use in storage paths
        // We'll use a temporary ID or just use timestamp-random for folder
        const eventUniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // 1. Upload Main Image
        const mainImageFile = document.getElementById('mainImage').files[0];
        let mainImageUrl = '';
        if (mainImageFile) {
            mainImageUrl = await uploadImage(mainImageFile, `events/${user.uid}/${eventUniqueId}/main.jpg`);
        } else {
            throw new Error("Main image is required");
        }

        // 2. Upload Showcase Images
        const showcaseFiles = Array.from(document.querySelectorAll('.showcase-file')).map(input => input.files[0]);
        const showcaseImageUrls = [];

        for (let i = 0; i < showcaseFiles.length; i++) {
            if (showcaseFiles[i]) {
                const url = await uploadImage(showcaseFiles[i], `events/${user.uid}/${eventUniqueId}/showcase_${i}.jpg`);
                showcaseImageUrls.push(url);
            }
        }

        // 3. Upload VIP Images
        const vipItems = document.querySelectorAll('#vip-list .dynamic-item');
        const vips = [];

        for (let i = 0; i < vipItems.length; i++) {
            const item = vipItems[i];
            const name = item.querySelector('.vip-name').value;
            const designation = item.querySelector('.vip-designation').value;
            const fileInput = item.querySelector('.vip-file');

            let imageUrl = '';
            if (fileInput.files[0]) {
                imageUrl = await uploadImage(fileInput.files[0], `events/${user.uid}/${eventUniqueId}/vip_${i}.jpg`);
            }

            vips.push({
                name,
                designation,
                image: imageUrl
            });
        }

        submitBtn.textContent = 'Creating Event...';

        const contacts = Array.from(document.querySelectorAll('.contact-detail')).map(i => i.value);

        const tickets = Array.from(document.querySelectorAll('#ticket-list .dynamic-item')).map(item => ({
            name: item.querySelector('.ticket-name').value,
            price: Number(item.querySelector('.ticket-price').value),
            perks: item.querySelector('.ticket-perks').value
        }));

        // Fetch User Profile Data for Organizer Details
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        let organizerName = "Unknown";
        let organizationName = document.getElementById('organization').value; // Default to form input

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            organizerName = userData.name || "Unknown";
            // Use profile organization if available, otherwise keep form input
            if (userData.organizationName) {
                organizationName = userData.organizationName;
            }
        }

        // Collect selected languages from checkboxes
        const selectedLanguages = Array.from(document.querySelectorAll('input[name="languages"]:checked')).map(cb => cb.value);

        // Collect Event Instructions
        const instructions = Array.from(document.querySelectorAll('.instruction-text')).map(i => i.value);

        // Collect FAQs
        const faqs = Array.from(document.querySelectorAll('#faq-list .faq-item')).map(item => ({
            question: item.querySelector('.faq-question').value,
            answer: item.querySelector('.faq-answer').value
        }));

        // Collect Timeline Data
        const timeline = [];
        document.querySelectorAll('.timeline-day-card').forEach((dayCard, dayIndex) => {
            const entries = [];
            const dayEntriesContainer = document.getElementById(`timeline-entries-${dayIndex}`);

            if (dayEntriesContainer) {
                dayEntriesContainer.querySelectorAll('.timeline-entry').forEach(entry => {
                    const time = entry.querySelector('.timeline-time').value;
                    const action = entry.querySelector('.timeline-action').value;

                    if (time && action) {
                        entries.push({ time, action });
                    }
                });
            }

            if (entries.length > 0) {
                timeline.push({
                    day: dayIndex + 1,
                    date: timelineDays[dayIndex]?.date || '',
                    entries: entries
                });
            }
        });

        // Construct Event Data
        const eventData = {
            userId: user.uid,
            organizer: organizerName, // Add Organizer Name
            name: document.getElementById('eventName').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            subcategory: document.getElementById('subcategory').value,
            organization: organizationName, // Use verified organization name


            mainImage: mainImageUrl, // Use the uploaded URL
            showcaseImages: showcaseImageUrls, // Use the uploaded URLs

            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            startTime: document.getElementById('startTime').value,

            location: {
                venue: document.getElementById('venue').value,
                district: document.getElementById('district').value,
                state: document.getElementById('state').value,
                country: document.getElementById('country').value,
                coordinates: window.selectedVenueCoordinates || null,
                // Add geohash and geopoint if coordinates exist
                ...(window.selectedVenueCoordinates && {
                    geohash: geohashForLocation([
                        window.selectedVenueCoordinates.lat,
                        window.selectedVenueCoordinates.lng
                    ]),
                    geopoint: new GeoPoint(
                        window.selectedVenueCoordinates.lat,
                        window.selectedVenueCoordinates.lng
                    )
                })
            },

            vips: vips,

            externalWebsite: document.getElementById('externalWebsite').value,
            contacts: contacts,
            tickets: tickets,
            timeline: timeline, // Add timeline data

            // New Sections
            instructions: instructions,
            youtubeVideo: document.getElementById('youtubeVideo').value,
            prohibitedItems: prohibitedItems,
            faqs: faqs,

            // Notables Section
            notables: {
                // A) Info About Event
                infoAboutEvent: {
                    minAge: document.getElementById('minAge').value,
                    ticketAge: document.getElementById('ticketAge').value,
                    petsAllowed: document.getElementById('petsAllowed').value,
                    venueType: document.getElementById('venueType').value,
                    childFriendly: document.getElementById('childFriendly').value,
                    languages: selectedLanguages
                },
                // B) Entry & Access
                entryAccess: {
                    reEntryAllowed: document.getElementById('reEntryAllowed').value,
                    ticketsTransferable: document.getElementById('ticketsTransferable').value,
                    ticketCheck: document.getElementById('ticketCheck').value,
                    onSpotPurchase: document.getElementById('onSpotPurchase').value
                },
                // C) Timing & Schedule
                timingSchedule: {
                    gateOpeningTime: document.getElementById('gateOpeningTime').value,
                    lateEntryPermitted: document.getElementById('lateEntryPermitted').value,
                    eventStartTime: document.getElementById('eventStartTime').value,
                    eventEndTime: document.getElementById('eventEndTime').value
                },
                // D) Comfort & Accessibility
                comfortAccessibility: {
                    restroomsAvailable: document.getElementById('restroomsAvailable').value,
                    wheelchairAccessible: document.getElementById('wheelchairAccessible').value
                },
                // E) Rules & Restrictions
                rulesRestrictions: {
                    bagsAllowed: document.getElementById('bagsAllowed').value,
                    camerasAllowed: document.getElementById('camerasAllowed').value,
                    smokingAlcoholPermitted: document.getElementById('smokingAlcoholPermitted').value
                },
                // F) Food & Amenities
                foodAmenities: {
                    foodAvailable: document.getElementById('foodAvailable').value,
                    vegOptions: document.getElementById('vegOptions').value,
                    freeWater: document.getElementById('freeWater').value
                },
                // G) Travel & Parking
                travelParking: {
                    parkingAvailable: document.getElementById('parkingAvailable').value,
                    publicTransportAccess: document.getElementById('publicTransportAccess').value
                }
            },

            isLaunch: false, // Event needs admin approval before launch
            status: "pending", // Status: pending, launched, rejected

            createdAt: serverTimestamp()
        };

        // Write to Firestore
        const docRef = await addDoc(collection(db, "events"), eventData);
        console.log("Event created with ID: ", docRef.id);

        // Clear local storage draft
        clearFormData();

        alert("Event Submitted for Review!\n\nYour event has been submitted successfully and is now pending admin approval. You'll be notified once it's launched.");
        window.location.href = "index.html"; // Redirect to home (or event details later)

    } catch (error) {
        console.error("Error adding event: ", error);
        alert("Error creating event: " + error.message);



        submitBtn.textContent = 'Create Event';
        submitBtn.disabled = false;
    }
});
