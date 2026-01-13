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
    weekOf: "Jan 12 - 18, 2026",
    lastUpdated: "4:20 AM, Jan 13, 2026",
    maxHours: 5, // Maximum hours for tallest bar (round up from actual max)
    activities: [
        { 
            name: "Computer Science", 
            hours: 4.47, 
            color: "#3a9d9d" // Bright teal/terminal cyan
        },
        { 
            name: "Economics", 
            hours: 3.23, 
            color: "#c99a4d" // Bright amber/old gold - wealth, old money, leather-bound ledgers
        },
        { 
            name: "Pedagogy", 
            hours: 2.68, 
            color: "#8ba68c" // Soft sage - chalkboards, teaching halls, worn textbooks
        },
        { 
            name: "Animal Welfare", 
            hours: 1.17, 
            color: "#5d8a5d" // Vibrant forest green - nature, earth, conservation
        },
        { 
            name: "Leadership", 
            hours: 0.62, 
            color: "#8ba68c" // Soft sage - chalkboards, teaching halls, worn textbooks
        },
        { 
            name: "Mathematics", 
            hours: 0.25, 
            color: "#6e87a8" // Cool slate blue - logic, precision, geometric elegance
        },
        { 
            name: "French", 
            hours: 0.03, 
            color: "#b07652" // Warm terracotta/burnt sienna - ancient pottery, classical scrolls, aged clay
        }
    ]
};

