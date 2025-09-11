// FAQ Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeFAQ();
    addSearchFunctionality();
});

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        
        // Click event
        question.addEventListener('click', function() {
            toggleFAQItem(item, question, answer, icon);
        });
        
        // Keyboard events
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQItem(item, question, answer, icon);
            }
        });
    });
}

function toggleFAQItem(item, question, answer, icon) {
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    
    // Close all other items first (accordion behavior)
    closeAllFAQItems();
    
    if (!isExpanded) {
        // Open this item
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.opacity = '1';
        icon.style.transform = 'rotate(180deg)';
        item.classList.add('expanded');
        
        // Scroll into view
        setTimeout(() => {
            item.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 300);
    }
}

function closeAllFAQItems() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        icon.style.transform = 'rotate(0deg)';
        item.classList.remove('expanded');
    });
}

function addSearchFunctionality() {
    // Create search box
    const searchContainer = document.createElement('div');
    searchContainer.className = 'faq-search-container';
    searchContainer.innerHTML = `
        <div class="faq-search-box">
            <input type="text" id="faq-search" placeholder="Search FAQs..." aria-label="Search frequently asked questions">
            <button type="button" id="clear-search" aria-label="Clear search" style="display: none;">×</button>
        </div>
        <div id="search-results" class="search-results" style="display: none;"></div>
    `;
    
    // Insert before FAQ accordion
    const faqSection = document.querySelector('.faq-section .container');
    const faqAccordion = document.getElementById('faqAccordion');
    faqSection.insertBefore(searchContainer, faqAccordion);
    
    // Search functionality
    const searchInput = document.getElementById('faq-search');
    const clearButton = document.getElementById('clear-search');
    const searchResults = document.getElementById('search-results');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length > 2) {
            performSearch(query);
            clearButton.style.display = 'block';
        } else {
            clearSearch();
        }
    });
    
    clearButton.addEventListener('click', clearSearch);
    
    function performSearch(query) {
        const faqItems = document.querySelectorAll('.faq-item');
        const results = [];
        
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question span').textContent.toLowerCase();
            const answer = item.querySelector('.faq-content').textContent.toLowerCase();
            
            if (question.includes(query) || answer.includes(query)) {
                results.push({
                    index: index,
                    question: item.querySelector('.faq-question span').textContent,
                    snippet: getSnippet(answer, query)
                });
            }
        });
        
        displaySearchResults(results, query);
    }
    
    function getSnippet(text, query) {
        const index = text.toLowerCase().indexOf(query);
        if (index === -1) return text.substring(0, 150) + '...';
        
        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + query.length + 50);
        
        return (start > 0 ? '...' : '') + 
               text.substring(start, end) + 
               (end < text.length ? '...' : '');
    }
    
    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <p>No results found for "${query}". Try different keywords or <a href="tel:1-800-784-8669">call 1-800-QUIT-NOW</a> for personalized help.</p>
                </div>
            `;
        } else {
            searchResults.innerHTML = `
                <div class="search-header">
                    <h3>Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"</h3>
                </div>
                ${results.map(result => `
                    <div class="search-result-item" onclick="scrollToFAQ(${result.index})">
                        <h4 class="search-result-question">${highlightQuery(result.question, query)}</h4>
                        <p class="search-result-snippet">${highlightQuery(result.snippet, query)}</p>
                    </div>
                `).join('')}
            `;
        }
        
        searchResults.style.display = 'block';
        document.getElementById('faqAccordion').style.display = 'none';
    }
    
    function highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    function clearSearch() {
        searchInput.value = '';
        clearButton.style.display = 'none';
        searchResults.style.display = 'none';
        document.getElementById('faqAccordion').style.display = 'block';
    }
}

// Global function to scroll to specific FAQ
window.scrollToFAQ = function(index) {
    // Clear search first
    document.getElementById('faq-search').value = '';
    document.getElementById('clear-search').style.display = 'none';
    document.getElementById('search-results').style.display = 'none';
    document.getElementById('faqAccordion').style.display = 'block';
    
    // Get the FAQ item and expand it
    const faqItems = document.querySelectorAll('.faq-item');
    const targetItem = faqItems[index];
    
    if (targetItem) {
        const question = targetItem.querySelector('.faq-question');
        const answer = targetItem.querySelector('.faq-answer');
        const icon = targetItem.querySelector('.faq-icon');
        
        // Close all first
        closeAllFAQItems();
        
        // Open target
        setTimeout(() => {
            question.setAttribute('aria-expanded', 'true');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.opacity = '1';
            icon.style.transform = 'rotate(180deg)';
            targetItem.classList.add('expanded');
            
            // Scroll to it
            targetItem.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
    }
};

// Add keyboard navigation for FAQ items
document.addEventListener('keydown', function(e) {
    const faqQuestions = document.querySelectorAll('.faq-question');
    const currentFocus = document.activeElement;
    const currentIndex = Array.from(faqQuestions).indexOf(currentFocus);
    
    if (currentIndex !== -1) {
        let nextIndex = -1;
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                nextIndex = (currentIndex + 1) % faqQuestions.length;
                break;
            case 'ArrowUp':
                e.preventDefault();
                nextIndex = (currentIndex - 1 + faqQuestions.length) % faqQuestions.length;
                break;
            case 'Home':
                e.preventDefault();
                nextIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                nextIndex = faqQuestions.length - 1;
                break;
        }
        
        if (nextIndex !== -1) {
            faqQuestions[nextIndex].focus();
        }
    }
});

// Add entrance animations
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
    
    // Observe FAQ items
    document.addEventListener('DOMContentLoaded', function() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    });
}

// Add analytics for popular questions (optional)
function trackFAQInteraction(questionText) {
    // This could be connected to analytics later
    console.log('FAQ Question opened:', questionText);
}

// Export for external use
window.FAQPage = {
    scrollToFAQ: window.scrollToFAQ,
    closeAllFAQItems,
    toggleFAQItem
};