// Policy Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load saved customization settings
    loadSavedSettings();
});

function updateInstitutionName(name) {
    const nameElements = document.querySelectorAll('#campus-name');
    nameElements.forEach(element => {
        element.textContent = name || 'Your Institution';
    });
    
    // Save to localStorage
    localStorage.setItem('institutionName', name);
}

function updateDistance(distance) {
    const distanceElements = document.querySelectorAll('#entrance-distance, #campus-distance');
    distanceElements.forEach(element => {
        element.textContent = distance;
    });
    
    // Save to localStorage
    localStorage.setItem('entranceDistance', distance);
}

function loadSavedSettings() {
    // Load saved institution name
    const savedName = localStorage.getItem('institutionName');
    if (savedName) {
        document.getElementById('institution-name').value = savedName;
        updateInstitutionName(savedName);
    }
    
    // Load saved distance
    const savedDistance = localStorage.getItem('entranceDistance');
    if (savedDistance) {
        document.getElementById('distance-requirement').value = savedDistance;
        updateDistance(savedDistance);
    }
}

// Add smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', function() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
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
});

// Add entrance animation for policy cards
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observe policy cards
    const policyCards = document.querySelectorAll('.rule-card, .protection-card, .responsibility-card, .legal-card');
    policyCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Add interactive features for better engagement
function addInteractiveFeatures() {
    // Add click-to-highlight for important rules
    const importantRules = document.querySelectorAll('.rule-main, .responsibility-title');
    importantRules.forEach(rule => {
        rule.addEventListener('click', function() {
            this.style.backgroundColor = '#DDE6D5';
            this.style.padding = '10px';
            this.style.borderRadius = '5px';
            this.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                this.style.backgroundColor = '';
                this.style.padding = '';
            }, 2000);
        });
    });
    
    // Add tooltips for distance requirements
    const distanceElements = document.querySelectorAll('#entrance-distance, #campus-distance');
    distanceElements.forEach(element => {
        element.title = 'Distance requirement helps prevent secondhand smoke from entering buildings';
        element.style.cursor = 'help';
        element.style.borderBottom = '1px dotted #4A2A3B';
    });
}

// Initialize interactive features when DOM is loaded
document.addEventListener('DOMContentLoaded', addInteractiveFeatures);

// Export functions for external use
window.PolicyPage = {
    updateInstitutionName,
    updateDistance,
    loadSavedSettings
};