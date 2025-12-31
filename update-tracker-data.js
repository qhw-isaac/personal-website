#!/usr/bin/env node
// ================================================
// 📊 TIME TRACKER DATA UPDATER
// ================================================
// Reads time data from CSV and updates both JS files
// ================================================

const fs = require('fs');
const path = require('path');

// Activity color mapping
const ACTIVITY_COLORS = {
    "Economics": "#c99a4d",        // Bright amber/old gold
    "Animal Welfare": "#5d8a5d",   // Vibrant forest green
    "Leadership": "#8ba68c",        // Soft sage
    "Mathematics": "#6e87a8",       // Cool slate blue
    "Philosophy": "#8b5ba8",        // Deep purple
    "Pedagogy": "#8ba68c",          // Soft sage
    "Computer Science": "#3a9d9d",  // Bright teal/terminal cyan
    "Greek": "#b07652",             // Warm terracotta
    "French": "#b07652"             // Warm terracotta
};

const ACTIVITY_COMMENTS = {
    "Economics": "Bright amber/old gold - wealth, old money, leather-bound ledgers",
    "Animal Welfare": "Vibrant forest green - nature, earth, conservation",
    "Leadership": "Soft sage - chalkboards, teaching halls, worn textbooks",
    "Mathematics": "Cool slate blue - logic, precision, geometric elegance",
    "Philosophy": "Deep purple - wisdom, contemplation, ancient scrolls",
    "Pedagogy": "Soft sage - chalkboards, teaching halls, worn textbooks",
    "Computer Science": "Bright teal/terminal cyan",
    "Greek": "Warm terracotta/burnt sienna - ancient pottery, classical scrolls, aged clay",
    "French": "Warm terracotta/burnt sienna - ancient pottery, classical scrolls, aged clay"
};

// Read CSV file
function readCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    const data = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('#')) continue; // Skip empty lines and comments
        
        const parts = line.split('\t').map(s => s.trim());
        if (parts.length >= 3) {
            const activity = parts[0];
            const thisWeek = parseFloat(parts[1]);
            const lifetime = parseFloat(parts[2]);
            
            data.push({
                name: activity,
                thisWeek: thisWeek,
                lifetime: lifetime,
                color: ACTIVITY_COLORS[activity] || "#888888"
            });
        }
    }
    
    return data;
}

// Format number to remove unnecessary decimals
function formatHours(hours) {
    // Round to 2 decimal places
    const rounded = Math.round(hours * 100) / 100;
    // If it's a whole number, return without decimals
    if (rounded === Math.floor(rounded)) {
        return rounded.toFixed(0);
    }
    // Otherwise return with minimal decimals
    return rounded.toString();
}

// Get current date string
function getCurrentDate() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

// Get current week range
function getCurrentWeekRange() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(now);
    // Adjust so Monday = 0, Tuesday = 1, ..., Sunday = 6
    const daysFromMonday = (dayOfWeek + 6) % 7; // Sunday becomes 6, Monday becomes 0
    startOfWeek.setDate(now.getDate() - daysFromMonday); // Go to Monday
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday (6 days after Monday)
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${months[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${now.getFullYear()}`;
}

// Get current time string
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}, ${getCurrentDate()}`;
}

// Update lifetime-data.js
function updateLifetimeData(data) {
    const activities = data
        .sort((a, b) => b.lifetime - a.lifetime) // Sort by lifetime hours descending
        .map(item => ({
            name: item.name,
            hours: item.lifetime,
            color: item.color
        }));
    
    const maxHours = Math.ceil(Math.max(...activities.map(a => a.hours)) / 50) * 50;
    
    const activitiesStr = activities.map(a => {
        const comment = ACTIVITY_COMMENTS[a.name] || "";
        return `        { 
            name: "${a.name}", 
            hours: ${formatHours(a.hours)}, 
            color: "${a.color}" // ${comment}
        }`;
    }).join(',\n');
    
    const content = `// ================================================
// ⏰ LIFETIME TIME TRACKER DATA
// ================================================
// Total cumulative hours tracked since January 1, 2025
// ================================================

const LIFETIME_TRACKER_CONFIG = {
    beginDate: "January 1, 2025",
    lastUpdated: "${getCurrentDate()}",
    maxHours: ${maxHours}, // Maximum hours for tallest bar (round up from actual max)
    activities: [
${activitiesStr}
    ]
};

`;
    
    const filePath = path.join(__dirname, 'content', 'time-tracker', 'lifetime-data.js');
    fs.writeFileSync(filePath, content);
    console.log('✅ Updated lifetime-data.js');
}

// Update landing page parameters
function updateLandingPageParameters(data) {
    const landingPath = path.join(__dirname, 'index.html');
    
    if (!fs.existsSync(landingPath)) {
        console.log('⚠️  Warning: index.html not found, skipping parameter update');
        return;
    }
    
    // Filter for only the activities we want to display
    const targetActivities = ['Economics', 'Animal Welfare', 'Mathematics'];
    const filteredData = data.filter(item => targetActivities.includes(item.name));
    
    if (filteredData.length === 0) {
        console.log('⚠️  Warning: No target activities found in data');
        return;
    }
    
    // Sort by lifetime hours descending
    filteredData.sort((a, b) => b.lifetime - a.lifetime);
    
    // Read the current index.html content
    let content = fs.readFileSync(landingPath, 'utf-8');
    
    // Update Economics hours
    const economicsHours = filteredData.find(item => item.name === 'Economics')?.lifetime || 0;
    content = content.replace(
        /(<div class="metric-value">)[\d.]+(\s*<span class="hrs-unit">hrs<\/span><\/div>\s*<div class="metric-label">Economics<\/div>)/,
        `$1${formatHours(economicsHours)}$2`
    );
    
    // Update Animal Welfare hours
    const animalWelfareHours = filteredData.find(item => item.name === 'Animal Welfare')?.lifetime || 0;
    content = content.replace(
        /(<div class="metric-value">)[\d.]+(\s*<span class="hrs-unit">hrs<\/span><\/div>\s*<div class="metric-label">Animal&nbsp;Welfare<\/div>)/,
        `$1${formatHours(animalWelfareHours)}$2`
    );
    
    // Update Mathematics hours
    const mathematicsHours = filteredData.find(item => item.name === 'Mathematics')?.lifetime || 0;
    content = content.replace(
        /(<div class="metric-value">)[\d.]+(\s*<span class="hrs-unit">hrs<\/span><\/div>\s*<div class="metric-label">Mathematics<\/div>)/,
        `$1${formatHours(mathematicsHours)}$2`
    );
    
    // Update the last updated date
    content = content.replace(
        /(Last updated: )([^<]+)/,
        `$1${getCurrentDate()}`
    );
    
    fs.writeFileSync(landingPath, content);
    console.log('✅ Updated landing page horizontal bar with latest hours');
}

// Update this-week-data.js
function updateThisWeekData(data) {
    const activities = data
        .filter(item => item.thisWeek > 0) // Only include activities with hours this week
        .sort((a, b) => b.thisWeek - a.thisWeek) // Sort by this week hours descending
        .map(item => ({
            name: item.name,
            hours: item.thisWeek,
            color: item.color
        }));
    
    const maxHours = Math.ceil(Math.max(...activities.map(a => a.hours), 1));
    
    const activitiesStr = activities.map(a => {
        const comment = ACTIVITY_COMMENTS[a.name] || "";
        return `        { 
            name: "${a.name}", 
            hours: ${formatHours(a.hours)}, 
            color: "${a.color}" // ${comment}
        }`;
    }).join(',\n');
    
    // Get all unique colors from the data for the color reference
    const colorReference = Object.entries(ACTIVITY_COLORS)
        .filter(([name]) => data.some(item => item.name === name))
        .map(([name, color]) => `// - ${name}: ${color} (${ACTIVITY_COMMENTS[name]?.split(' - ')[0] || ''})`)
        .join('\n');
    
    const content = `// ================================================
// ⏰ THIS WEEK TIME TRACKER DATA
// ================================================
// Color Reference:
${colorReference}
// ================================================

const TIME_TRACKER_CONFIG = {
    weekOf: "${getCurrentWeekRange()}",
    lastUpdated: "${getCurrentTime()}",
    maxHours: ${maxHours}, // Maximum hours for tallest bar (round up from actual max)
    activities: [
${activitiesStr}
    ]
};

`;
    
    const filePath = path.join(__dirname, 'content', 'time-tracker', 'this-week-data.js');
    fs.writeFileSync(filePath, content);
    console.log('✅ Updated this-week-data.js');
}

// Main function
function main() {
    const csvPath = path.join(__dirname, 'content', 'time-tracker', 'time-tracker-data.csv');
    
    if (!fs.existsSync(csvPath)) {
        console.error('❌ Error: time-tracker-data.csv not found!');
        console.log('Please create the file with tab-separated values:');
        console.log('Activity Name    This Week Hours    Lifetime Hours');
        process.exit(1);
    }
    
    try {
        const data = readCSV(csvPath);
        
        if (data.length === 0) {
            console.error('❌ Error: No valid data found in CSV file');
            process.exit(1);
        }
        
        console.log(`📊 Processing ${data.length} activities...`);
        
        updateLifetimeData(data);
        updateThisWeekData(data);
        updateLandingPageParameters(data);
        
        console.log('\n✨ All files updated successfully!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();

