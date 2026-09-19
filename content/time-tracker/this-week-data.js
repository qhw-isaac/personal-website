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
    weekOf: "Sep 14 - 20, 2026",
    lastUpdated: "10:25 PM, Sep 18, 2026",
    maxHours: 20, // Maximum hours for tallest bar (round up from actual max)
    activities: [
        { 
            name: "Animal Welfare", 
            hours: 19.81, 
            color: "#5d8a5d" // Vibrant forest green - nature, earth, conservation
        },
        { 
            name: "Pedagogy", 
            hours: 18.27, 
            color: "#8ba68c" // Soft sage - chalkboards, teaching halls, worn textbooks
        },
        { 
            name: "Economics", 
            hours: 3.83, 
            color: "#c99a4d" // Bright amber/old gold - wealth, old money, leather-bound ledgers
        },
        { 
            name: "Mathematics", 
            hours: 0.33, 
            color: "#6e87a8" // Cool slate blue - logic, precision, geometric elegance
        }
    ]
};

