// Isaac Qi - Main JavaScript
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize page functionality
    initializePageFeatures();
    
    // Set up navigation highlighting
    highlightCurrentPage();
    
    // Add smooth scrolling for internal links
    setupSmoothScrolling();
    
    // Initialize timeline animations if present
    initializeTimelineAnimations();
    
    // Setup scroll-based animations
    setupScrollAnimations();
});

/**
 * Initialize general page features
 */
function initializePageFeatures() {
    // Add fade-in animation to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            mainContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }, 150);
    }
    
    // Add hover effects to cards
    setupCardHoverEffects();
    
    // Add hover effects to timeline items
    setupTimelineHoverEffects();
    
    // Setup any time-based content updates
    setupTimeBasedUpdates();
}

/**
 * Highlight current page in navigation
 */
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Setup smooth scrolling for internal links
 */
function setupSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Setup card hover effects
 */
function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.focus-card, .nav-card, .resource-item, .goal-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Setup time-based content updates
 */
function setupTimeBasedUpdates() {
    // Update any relative timestamps
    updateRelativeTimestamps();
    
    // Set up interval for periodic updates (every 5 minutes)
    setInterval(updateRelativeTimestamps, 5 * 60 * 1000);
}

/**
 * Update relative timestamps on the page
 */
function updateRelativeTimestamps() {
    const timestampElements = document.querySelectorAll('[data-timestamp]');
    
    timestampElements.forEach(element => {
        const timestamp = parseInt(element.getAttribute('data-timestamp'));
        const relativeTime = getRelativeTime(timestamp);
        element.textContent = relativeTime;
    });
}

/**
 * Get relative time string
 */
function getRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
}

/**
 * Initialize timeline animations for progress page
 */
function initializeTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length > 0) {
        // Add staggered fade-in animation to timeline items
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 200 + (index * 100));
        });
    }
}

/**
 * Setup card hover effects for timeline items
 */
function setupTimelineHoverEffects() {
    const timelineCards = document.querySelectorAll('.timeline-content');
    
    timelineCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Progress bar animation
 */
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-out';
            bar.style.width = targetWidth;
        }, 500);
    });
}

// Initialize progress bar animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(animateProgressBars, 1000);
});

/**
 * Local storage utilities for user preferences
 */
const UserPreferences = {
    set: function(key, value) {
        localStorage.setItem(`isaac-qi-${key}`, JSON.stringify(value));
    },
    
    get: function(key, defaultValue = null) {
        const stored = localStorage.getItem(`isaac-qi-${key}`);
        return stored ? JSON.parse(stored) : defaultValue;
    },
    
    remove: function(key) {
        localStorage.removeItem(`isaac-qi-${key}`);
    }
};

/**
 * Intersection Observer for timeline animations
 */
function setupScrollAnimations() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe timeline items for scroll animations
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }
}

// Export for potential module usage
window.IsaacQi = {
    UserPreferences,
    animateProgressBars,
    setupScrollAnimations
};
