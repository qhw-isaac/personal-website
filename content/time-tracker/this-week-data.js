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
    weekOf: "Jan 5 - 11, 2026",
    lastUpdated: "11:55 PM, Jan 11, 2026",
    maxHours: 27, // Maximum hours for tallest bar (round up from actual max)
    activities: [
        { 
            name: "Economics", 
            hours: 26.72, 
            color: "#c99a4d" // Bright amber/old gold - wealth, old money, leather-bound ledgers
        },
        { 
            name: "Leadership", 
            hours: 12.35, 
            color: "#8ba68c" // Soft sage - chalkboards, teaching halls, worn textbooks
        },
        { 
            name: "Pedagogy", 
            hours: 9.3, 
            color: "#8ba68c" // Soft sage - chalkboards, teaching halls, worn textbooks
        },
        { 
            name: "Animal Welfare", 
            hours: 7.45, 
            color: "#5d8a5d" // Vibrant forest green - nature, earth, conservation
        },
        { 
            name: "Computer Science", 
            hours: 1.83, 
            color: "#3a9d9d" // Bright teal/terminal cyan
        },
        { 
            name: "Mathematics", 
            hours: 0.52, 
            color: "#6e87a8" // Cool slate blue - logic, precision, geometric elegance
        },
        { 
            name: "French", 
            hours: 0.13, 
            color: "#b07652" // Warm terracotta/burnt sienna - ancient pottery, classical scrolls, aged clay
        }
    ]
};

