// ================================================
// 📚 BOOKSHELF READING LOG DATA
// ================================================
// Mirror of content/books/reading-log.csv (title,status,hours,page).
// Loaded via <script> so the shelf's stats work over file:// too.
// Regenerate this from the CSV with your tracker updater.
//   title  → must match the cover filename (without extension)
//   status → In Progress | Pause | Idle | Complete
//   hours  → total hours spent reading
//   page   → current page (null if not started / finished / untracked)
// ================================================

const BOOKSHELF_READING_LOG_DATA = [
    { title: "Nicomachean Ethics",                                            status: "Pause",       hours: 0.766666666667, page: null },
    { title: "The Philosophy of Kant",                                        status: "Pause",       hours: 1.483333333333, page: 33 },
    { title: "Economic Philosophy",                                           status: "Idle",        hours: 0,              page: null },
    { title: "The Theory of Incentives",                                      status: "Idle",        hours: 0,              page: null },
    { title: "The Handbook of Experimental Economics",                        status: "Idle",        hours: 0,              page: null },
    { title: "A Life of Experimental Economics - Volume II - The Next Fifty Years", status: "Pause", hours: 0.616666666667, page: 22 },
    { title: "The Universal Book of Mathematics",                             status: "Idle",        hours: 0,              page: null },
    { title: "The Data Detective",                                            status: "Pause",       hours: 4.933333333333, page: 90 },
    { title: "The Pattern Seekers",                                           status: "Idle",        hours: 0,              page: null },
    { title: "Hidden Potential",                                              status: "In Progress", hours: 1.25,           page: 72 },
    { title: "Animal Welfare",                                                status: "Pause",       hours: 1.283333333333, page: null },
    { title: "The Humane Economy",                                            status: "Pause",       hours: 3.7,            page: 108 },
    { title: "Animal Farm",                                                   status: "Complete",    hours: 1.6,            page: null },
    { title: "The Murder of Roger Ackroyd",                                   status: "In Progress", hours: 4.216666666667, page: null }
];
