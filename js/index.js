/**
 * Index JavaScript File for Brew Café Coffee Shop Website
 * Handles navigation, animations, and common functionality across all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MOBILE NAVIGATION FUNCTIONALITY =====
    
    /**
     * Initialize mobile navigation toggle functionality
     * Handles hamburger menu opening/closing and responsive navigation
     */
    function initMobileNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            // Toggle mobile menu
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
            
            // Close menu when clicking on nav links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
            
            // Handle window resize
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        }
    }
    
    // ===== SMOOTH SCROLLING =====
    
    /**
     * Initialize smooth scrolling for internal anchor links
     */
    function initSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 80; // Account for fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ===== SCROLL ANIMATIONS =====
    
    /**
     * Initialize scroll-triggered animations using Intersection Observer
     * Provides better performance than scroll event listeners
     */
    function initScrollAnimations() {
        // Create intersection observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, observerOptions);
        
        // Observe all fade-in elements
        const fadeElements = document.querySelectorAll('.fade-in-card, .fade-in-left, .fade-in-right');
        fadeElements.forEach(el => {
            // Set initial state
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            
            // Start observing
            observer.observe(el);
        });
        
        // Handle left/right specific transforms
        const fadeLeftElements = document.querySelectorAll('.fade-in-left');
        fadeLeftElements.forEach(el => {
            el.style.transform = 'translateX(-30px)';
        });
        
        const fadeRightElements = document.querySelectorAll('.fade-in-right');
        fadeRightElements.forEach(el => {
            el.style.transform = 'translateX(30px)';
        });
    }
    
    // ===== HEADER SCROLL BEHAVIOR =====
    
    /**
     * Handle header appearance on scroll
     * Adds/removes classes based on scroll position
     */
    function initHeaderScrollBehavior() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;
        
        function updateHeader() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(15px)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            }
            
            lastScrollY = currentScrollY;
        }
        
        // Throttle scroll events for better performance
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    updateHeader();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    // ===== LOADING ANIMATIONS =====
    
    /**
     * Add staggered loading animations to card grids
     */
    function initLoadingAnimations() {
        const cardGroups = [
            '.features-grid .feature-card',
            '.menu-preview .menu-item',
            '.values-grid .value-card',
            '.team-grid .team-member',
            '.menu-grid .menu-card',
            '.gallery-grid .gallery-item'
        ];
        
        cardGroups.forEach(selector => {
            const cards = document.querySelectorAll(selector);
            cards.forEach((card, index) => {
                // Add progressive delay to create staggered effect
                card.style.animationDelay = `${index * 0.1}s`;
            });
        });
    }
    
    // ===== UTILITY FUNCTIONS =====
    
    /**
     * Debounce function to limit the rate of function execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @param {boolean} immediate - Execute immediately
     */
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    /**
     * Throttle function to limit function execution to once per specified interval
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // ===== ACCESSIBILITY ENHANCEMENTS =====
    
    /**
     * Initialize accessibility features
     */
    function initAccessibility() {
        // Add keyboard navigation support
        document.addEventListener('keydown', function(e) {
            // Enable keyboard navigation for buttons
            if (e.key === 'Enter' || e.key === ' ') {
                if (e.target.classList.contains('btn') || e.target.classList.contains('nav-toggle')) {
                    e.target.click();
                }
            }
            
            // Escape key to close mobile menu
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('navMenu');
                const navToggle = document.getElementById('navToggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
        
        // Add focus visible support for better keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });
        
        document.addEventListener('mousedown', function() {
            document.body.classList.remove('using-keyboard');
        });
    }
    
    // ===== PERFORMANCE MONITORING =====
    
    /**
     * Monitor and log performance metrics (for development)
     */
    function initPerformanceMonitoring() {
        // Only run in development
        if (window.location.hostname === 'localhost') {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
                    console.log(`Page load time: ${loadTime}ms`);
                }, 0);
            });
        }
    }
    
    // ===== SCROLL TO TOP FUNCTIONALITY =====
    
    /**
     * Initialize scroll to top button (if exists)
     */
    function initScrollToTop() {
        const scrollToTopBtn = document.querySelector('.scroll-to-top');
        
        if (scrollToTopBtn) {
            window.addEventListener('scroll', throttle(function() {
                if (window.pageYOffset > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            }, 250));
            
            scrollToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // ===== INITIALIZE ALL FUNCTIONS =====
    
    /**
     * Initialize all functionality when DOM is ready
     */
    function init() {
        try {
            initMobileNavigation();
            initSmoothScrolling();
            initScrollAnimations();
            initHeaderScrollBehavior();
            initLoadingAnimations();
            initAccessibility();
            initPerformanceMonitoring();
            initScrollToTop();
            
            console.log('Brew Café: All scripts initialized successfully');
        } catch (error) {
            console.error('Brew Café: Error initializing scripts:', error);
        }
    }
    
    // Start initialization
    init();
    
    // ===== GLOBAL UTILITY FUNCTIONS =====
    
    /**
     * Show notification (can be used by other scripts)
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info)
     */
    window.showNotification = function(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease-in-out',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        // Set background color based on type
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            warning: '#FF9800',
            info: '#2196F3'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    };
    
    // ===== ERROR HANDLING =====
    
    /**
     * Global error handler
     */
    window.addEventListener('error', function(e) {
        console.error('Brew Café: JavaScript error:', e.error);
        // Could send error to analytics service in production
    });
    
    /**
     * Handle unhandled promise rejections
     */
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Brew Café: Unhandled promise rejection:', e.reason);
        // Could send error to analytics service in production
    });
    
});