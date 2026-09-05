// ================================================
// ⏰ THIS WEEK TIME TRACKER DATA
// ================================================
// Color Reference:
// - Economics: #c99a4d (Bright amber/old gold)
// - Animal Welfare: #5d8a5d (Vibrant forest green)
// - Mathematics: #6e87a8 (Cool slate blue)
// - Philosophy: #8b5ba8 (Deep purple)
// - Pedagogy: #8ba68c (Soft sage)
// ================================================

const TIME_TRACKER_CONFIG = {
    weekOf: "Aug 31 - 6, 2026",
    lastUpdated: "3:09 AM, Sep 5, 2026",
    maxHours: 19, // Maximum hours for tallest bar (round up from actual max)
    activities: [
        { 
            name: "Animal Welfare", 
            hours: 18.53, 
            color: "#5d8a5d" // Vibrant forest green - nature, earth, conservation
        },
        { 
            name: "Economics", 
            hours: 8.95, 
            color: "#c99a4d" // Bright amber/old gold - wealth, old money, leather-bound ledgers
        },
        { 
            name: "Pedagogy", 
            hours: 8.44, 
            color: "#8ba68c" // Soft sage - chalkboards, teaching halls, worn textbooks
        },
        { 
            name: "Mathematics", 
            hours: 0.5, 
            color: "#6e87a8" // Cool slate blue - logic, precision, geometric elegance
        }
    ]
};

