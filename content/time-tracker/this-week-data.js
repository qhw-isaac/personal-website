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
    weekOf: "May 18 - 24, 2026",
    lastUpdated: "11:17 AM, May 23, 2026",
    maxHours: 14, // Maximum hours for tallest bar (round up from actual max)
    activities: [
        { 
            name: "Economics", 
            hours: 13.6, 
            color: "#c99a4d" // Bright amber/old gold - wealth, old money, leather-bound ledgers
        },
        { 
            name: "Animal Welfare", 
            hours: 5.02, 
            color: "#5d8a5d" // Vibrant forest green - nature, earth, conservation
        },
        { 
            name: "Computer Science", 
            hours: 1.73, 
            color: "#3a9d9d" // Bright teal/terminal cyan
        },
        { 
            name: "Mathematics", 
            hours: 0.85, 
            color: "#6e87a8" // Cool slate blue - logic, precision, geometric elegance
        },
        { 
            name: "Pedagogy", 
            hours: 0.65, 
            color: "#8ba68c" // Soft sage - chalkboards, teaching halls, worn textbooks
        },
        { 
            name: "Leadership", 
            hours: 0.37, 
            color: "#8ba68c" // Soft sage - chalkboards, teaching halls, worn textbooks
        },
        { 
            name: "French", 
            hours: 0.12, 
            color: "#b07652" // Warm terracotta/burnt sienna - ancient pottery, classical scrolls, aged clay
        }
    ]
};

