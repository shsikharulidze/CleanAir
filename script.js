// Clean Air Indoors - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Page loading animations
    initializePageAnimations();
    
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            
            // Toggle menu visibility
            mobileMenu.classList.toggle('show');
            
            // Update ARIA attributes
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle hamburger animation
            const hamburger = mobileMenuBtn.querySelector('.hamburger');
            if (hamburger) {
                hamburger.style.transform = !isExpanded ? 'rotate(45deg)' : 'rotate(0deg)';
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('show');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                
                const hamburger = mobileMenuBtn.querySelector('.hamburger');
                if (hamburger) {
                    hamburger.style.transform = 'rotate(0deg)';
                }
            });
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Keyboard accessibility for interactive elements
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('show')) {
            mobileMenu.classList.remove('show');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.focus();
        }
    });
    
    // Focus management for better accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    // Trap focus in mobile menu when open
    if (mobileMenu) {
        mobileMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && mobileMenu.classList.contains('show')) {
                const focusableContent = mobileMenu.querySelectorAll(focusableElements);
                const firstFocusableElement = focusableContent[0];
                const lastFocusableElement = focusableContent[focusableContent.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    // Add loading state for external links
    const externalLinks = document.querySelectorAll('a[href^="http"], a[href^="tel:"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Add visual feedback for phone calls and external links
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 300);
        });
    });
    
    // Form validation and enhancement (for future forms)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.setAttribute('aria-invalid', 'true');
                    field.focus();
                } else {
                    field.setAttribute('aria-invalid', 'false');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    // Intersection Observer for animations (optional enhancement)
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe fact cards for subtle entrance animation
        const factCards = document.querySelectorAll('.fact-card');
        factCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
    
    // Console message for developers
    console.log('Clean Air Indoors - Educational site for tobacco prevention');
    console.log('Built with accessibility and performance in mind');
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize for responsive adjustments
window.addEventListener('resize', debounce(function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    // Close mobile menu on desktop resize
    if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('show')) {
        mobileMenu.classList.remove('show');
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }
}, 250));

// Page animation functions
function initializePageAnimations() {
    // Add page enter animation
    document.body.classList.add('page-enter');
    
    // Enhanced intersection observer for staggered animations
    if ('IntersectionObserver' in window) {
        const staggeredObserver = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated-in');
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });
        
        // Animate sections
        const sections = document.querySelectorAll('section, .fact-card, .emergency-card');
        sections.forEach((section, index) => {
            section.classList.add('animate-on-scroll');
            if (index > 0) { // Don't animate the first section (hero)
                staggeredObserver.observe(section);
            } else {
                section.classList.add('animated-in');
            }
        });
        
        // Animate form elements
        const formElements = document.querySelectorAll('.form-group, .faq-item, .pledge-card');
        formElements.forEach(element => {
            element.classList.add('animate-on-scroll');
            staggeredObserver.observe(element);
        });
    }
    
    // Add loading complete class after initial render
    setTimeout(() => {
        document.body.classList.add('loading-complete');
    }, 100);
}

// Link transition effects
function addLinkTransitions() {
    const internalLinks = document.querySelectorAll('a[href^="./"], a[href$=".html"]:not([href^="http"])');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's an anchor link or external
            if (href.startsWith('#') || href.startsWith('http') || href.startsWith('tel:')) {
                return;
            }
            
            e.preventDefault();
            
            // Add exit animation
            document.body.classList.add('page-exit');
            
            // Navigate after animation
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
}

// Initialize link transitions
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addLinkTransitions);
} else {
    addLinkTransitions();
}