/* =================================
   Isaac Qi's Academic Landing Page - JavaScript
   ================================= */

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to header
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Animate statistics on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const animateStats = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                
                statNumbers.forEach(stat => {
                    const finalValue = parseInt(stat.textContent);
                    let currentValue = 0;
                    const increment = finalValue / 50; // Animate over 50 steps
                    
                    const timer = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= finalValue) {
                            stat.textContent = finalValue;
                            clearInterval(timer);
                        } else {
                            stat.textContent = Math.floor(currentValue);
                        }
                    }, 30);
                });
                
                observer.unobserve(entry.target);
            }
        });
    };

    const statsObserver = new IntersectionObserver(animateStats, observerOptions);
    const heroStats = document.querySelector('.hero-stats');
    
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    // Add hover effects to method cards
    const methodCards = document.querySelectorAll('.method-card');
    
    methodCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px) scale(1)';
        });
    });

    // Dashboard button interaction feedback
    const dashboardBtns = document.querySelectorAll('.dashboard-btn, .cta-button');
    
    dashboardBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Fade in animation for sections on scroll
    const fadeInElements = document.querySelectorAll('.about-container, .methodology-container');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeInElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        fadeInObserver.observe(element);
    });

    // Research preview card interaction
    const researchPreview = document.querySelector('.research-preview');
    
    if (researchPreview) {
        researchPreview.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.18)';
        });
        
        researchPreview.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
        });
    }

    // Add loading state for dashboard button
    const dashboardLinks = document.querySelectorAll('a[href="dashboard.html"]');
    
    dashboardLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Loading Dashboard...</span>';
            this.style.pointerEvents = 'none';
            
            // Reset after a short delay (in case navigation is cancelled)
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.pointerEvents = 'auto';
            }, 3000);
        });
    });

    // Keyboard navigation improvements
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add CSS for keyboard navigation
    const keyboardStyle = document.createElement('style');
    keyboardStyle.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid #d4af37 !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(keyboardStyle);

    // Performance optimization: Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        }, 10);
    });

    // Add subtle parallax effect to hero section
    const hero = document.querySelector('.hero');
    
    if (hero && window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }

    // Console message for developers
    console.log(`
    🎓 Isaac Qi's Academic Portfolio
    ================================
    
    Welcome to my research landing page!
    
    This site showcases my work in:
    • Agricultural Economics
    • Animal Welfare Research  
    • Behavioral Economics
    
    Built with modern web technologies and academic design principles.
    
    Explore the interactive research dashboard: dashboard.html
    `);
});

