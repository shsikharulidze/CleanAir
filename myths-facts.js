// Myths and Facts Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize flip card functionality
    initializeFlipCards();
});

function initializeFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    
    flipCards.forEach(card => {
        // Click event
        card.addEventListener('click', function() {
            toggleCard(this);
        });
        
        // Keyboard events for accessibility
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCard(this);
            }
        });
        
        // Update aria-label based on current state
        updateAriaLabel(card);
    });
}

function toggleCard(card) {
    const isFlipped = card.classList.contains('flipped');
    
    // Toggle the flipped state
    card.classList.toggle('flipped');
    
    // Update accessibility attributes
    updateAriaLabel(card);
    
    // Add subtle haptic feedback for mobile devices
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
    
    // Announce the change to screen readers
    announceCardFlip(card, !isFlipped);
}

function updateAriaLabel(card) {
    const isFlipped = card.classList.contains('flipped');
    const newLabel = isFlipped ? 
        'Flip card to see myth' : 
        'Flip card to see fact';
    
    card.setAttribute('aria-label', newLabel);
}

function announceCardFlip(card, isNowFlipped) {
    // Create a temporary element to announce the change
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    
    const side = isNowFlipped ? 'fact' : 'myth';
    announcement.textContent = `Card flipped to show ${side}`;
    
    document.body.appendChild(announcement);
    
    // Remove the announcement after screen readers have processed it
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Add enhanced keyboard navigation
document.addEventListener('keydown', function(e) {
    const flipCards = document.querySelectorAll('.flip-card');
    const currentFocus = document.activeElement;
    const currentIndex = Array.from(flipCards).indexOf(currentFocus);
    
    if (currentIndex !== -1) {
        let nextIndex = -1;
        
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                nextIndex = (currentIndex + 1) % flipCards.length;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                nextIndex = (currentIndex - 1 + flipCards.length) % flipCards.length;
                break;
            case 'Home':
                e.preventDefault();
                nextIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                nextIndex = flipCards.length - 1;
                break;
        }
        
        if (nextIndex !== -1) {
            flipCards[nextIndex].focus();
        }
    }
});

// Add intersection observer for entrance animations
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation of cards
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observe all flip cards
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Add touch gesture support for mobile
let touchStartY = 0;
let touchStartX = 0;

document.addEventListener('touchstart', function(e) {
    if (e.target.closest('.flip-card')) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }
}, { passive: true });

document.addEventListener('touchend', function(e) {
    const card = e.target.closest('.flip-card');
    if (card) {
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        
        const diffY = touchStartY - touchEndY;
        const diffX = touchStartX - touchEndX;
        
        // If it's a tap (minimal movement), toggle the card
        if (Math.abs(diffY) < 10 && Math.abs(diffX) < 10) {
            toggleCard(card);
        }
    }
}, { passive: true });

// Preload any additional resources
function preloadResources() {
    // Preload any images or resources that might be needed
    // This helps with smooth animations and interactions
}

// Auto-flip demonstration (optional - can be enabled for tours)
function demonstrateFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    
    flipCards.forEach((card, index) => {
        setTimeout(() => {
            if (!card.classList.contains('flipped')) {
                toggleCard(card);
                
                // Flip back after 2 seconds
                setTimeout(() => {
                    if (card.classList.contains('flipped')) {
                        toggleCard(card);
                    }
                }, 2000);
            }
        }, index * 500);
    });
}

// Export functions for potential external use
window.CleanAirMythsFacts = {
    toggleCard,
    demonstrateFlipCards
};