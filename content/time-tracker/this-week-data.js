// ================================================
// ⏰ THIS WEEK TIME TRACKER DATA
// ================================================
// Color Reference:
// - Economics: #c99a4d (Bright amber/old gold)
// - Animal Welfare: #5d8a5d (Vibrant forest green)
// - Leadership: #8ba68c (Soft sage)
// - Mathematics: #6e87a8 (Cool slate blue)
// - Philosophy: #8b5ba8 (Deep purple)
// - Pedagogy: #8ba68c (Soft sage)
// - Computer Science: #3a9d9d (Bright teal/terminal cyan)
// - French: #b07652 (Warm terracotta/burnt sienna)
// ================================================

const TIME_TRACKER_CONFIG = {
    weekOf: "Dec 29 - 4, 2025",
    lastUpdated: "12:39 AM, Dec 30, 2025",
    maxHours: 1, // Maximum hours for tallest bar (round up from actual max)
    activities: [
        { 
            name: "Economics", 
            hours: 0.63, 
            color: "#c99a4d" // Bright amber/old gold - wealth, old money, leather-bound ledgers
        },
        { 
            name: "Leadership", 
            hours: 0.55, 
            color: "#8ba68c" // Soft sage - chalkboards, teaching halls, worn textbooks
        },
        { 
            name: "Pedagogy", 
            hours: 0.27, 
            color: "#8ba68c" // Soft sage - chalkboards, teaching halls, worn textbooks
        },
        { 
            name: "Mathematics", 
            hours: 0.07, 
            color: "#6e87a8" // Cool slate blue - logic, precision, geometric elegance
        },
        { 
            name: "French", 
            hours: 0.02, 
            color: "#b07652" // Warm terracotta/burnt sienna - ancient pottery, classical scrolls, aged clay
        }
    ]
};

