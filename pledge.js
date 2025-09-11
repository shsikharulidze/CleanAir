// Pledge Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializePledgeForm();
    updatePledgeCount();
    loadSamplePledges();
});

function initializePledgeForm() {
    const form = document.getElementById('pledgeForm');
    const thankYouSection = document.getElementById('thankYouSection');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitPledge();
        }
    });
    
    // Real-time validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Auto-save form data
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', debounce(saveFormData, 1000));
    });
    
    // Load saved form data
    loadSavedFormData();
}

function validateForm() {
    const form = document.getElementById('pledgeForm');
    let isValid = true;
    
    // Check required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('email');
    if (emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate ZIP code if provided
    const zipField = document.getElementById('zip-code');
    if (zipField.value && !isValidZipCode(zipField.value)) {
        showFieldError(zipField, 'Please enter a valid 5-digit ZIP code');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.id = field.id + '-error';
    
    field.setAttribute('aria-describedby', errorElement.id);
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidZipCode(zip) {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zip);
}

function submitPledge() {
    const form = document.getElementById('pledgeForm');
    const formData = new FormData(form);
    
    // Create pledge object
    const pledge = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        zipCode: formData.get('zipCode'),
        role: formData.get('role'),
        commitments: formData.getAll('commitments'),
        personalMessage: formData.get('personalMessage'),
        consent: formData.get('consent') === 'on',
        privacy: formData.get('privacy') === 'on',
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Simulate API call (in real implementation, this would call a server)
    setTimeout(() => {
        // Store pledge locally
        savePledgeLocally(pledge);
        
        // Update count
        incrementPledgeCount();
        
        // Show thank you
        showThankYou(pledge);
        
        // Clear saved form data
        clearSavedFormData();
        
        // Reset form
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
    }, 1500);
}

function savePledgeLocally(pledge) {
    let pledges = JSON.parse(localStorage.getItem('pledges') || '[]');
    
    // Add new pledge (anonymized for storage)
    const anonymizedPledge = {
        role: pledge.role,
        personalMessage: pledge.personalMessage,
        timestamp: pledge.timestamp,
        commitments: pledge.commitments
    };
    
    pledges.unshift(anonymizedPledge);
    
    // Keep only last 50 pledges
    if (pledges.length > 50) {
        pledges = pledges.slice(0, 50);
    }
    
    localStorage.setItem('pledges', JSON.stringify(pledges));
}

function showThankYou(pledge) {
    // Hide form section
    document.querySelector('.pledge-form-section').style.display = 'none';
    document.querySelector('.pledge-wall-section').style.display = 'none';
    
    // Show thank you section
    const thankYouSection = document.getElementById('thankYouSection');
    thankYouSection.style.display = 'block';
    
    // Customize thank you message
    const nameSpan = thankYouSection.querySelector('.thank-you-title');
    nameSpan.textContent = `Thank You, ${pledge.firstName}!`;
    
    // Scroll to thank you section
    thankYouSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    // Add confetti effect
    createConfettiEffect();
}

function createConfettiEffect() {
    // Simple confetti animation
    const colors = ['#4A2A3B', '#DDE6D5', '#E8E8E8'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}vw;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                pointer-events: none;
                animation: confettiFall 3s linear forwards;
                z-index: 1000;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 50);
    }
}

function updatePledgeCount() {
    const savedCount = localStorage.getItem('pledgeCount');
    const currentCount = savedCount ? parseInt(savedCount) : Math.floor(Math.random() * 1000) + 1200;
    
    document.getElementById('pledge-count').textContent = currentCount.toLocaleString();
    
    if (!savedCount) {
        localStorage.setItem('pledgeCount', currentCount.toString());
    }
}

function incrementPledgeCount() {
    const currentCount = parseInt(localStorage.getItem('pledgeCount') || '1247');
    const newCount = currentCount + 1;
    
    localStorage.setItem('pledgeCount', newCount.toString());
    
    // Animate the counter
    animateCounter(document.getElementById('pledge-count'), currentCount, newCount);
}

function animateCounter(element, start, end) {
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function loadSamplePledges() {
    const pledgeWall = document.getElementById('pledgeWall');
    const savedPledges = JSON.parse(localStorage.getItem('pledges') || '[]');
    
    // If we have saved pledges, show some of them
    if (savedPledges.length > 0) {
        const recentPledges = savedPledges.slice(0, 3);
        
        recentPledges.forEach(pledge => {
            if (pledge.personalMessage && pledge.personalMessage.trim()) {
                const pledgeCard = createPledgeCard(
                    pledge.personalMessage,
                    `${pledge.role || 'Community Member'}`,
                    formatTimeAgo(pledge.timestamp)
                );
                
                pledgeWall.insertBefore(pledgeCard, pledgeWall.firstChild);
            }
        });
    }
}

function createPledgeCard(message, author, timeAgo) {
    const card = document.createElement('div');
    card.className = 'pledge-card new-pledge';
    card.innerHTML = `
        <div class="pledge-quote">"${message}"</div>
        <div class="pledge-author">- ${author}</div>
        <div class="pledge-date">${timeAgo}</div>
    `;
    
    return card;
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const pledgeTime = new Date(timestamp);
    const diffMs = now - pledgeTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
        return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
        return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays < 7) {
        return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    } else {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
}

function saveFormData() {
    const form = document.getElementById('pledgeForm');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    localStorage.setItem('pledgeFormData', JSON.stringify(data));
}

function loadSavedFormData() {
    const savedData = localStorage.getItem('pledgeFormData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            const form = document.getElementById('pledgeForm');
            
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox') {
                        const value = Array.isArray(data[key]) ? data[key] : [data[key]];
                        const checkboxes = form.querySelectorAll(`[name="${key}"]`);
                        checkboxes.forEach(cb => {
                            cb.checked = value.includes(cb.value);
                        });
                    } else {
                        field.value = data[key];
                    }
                }
            });
        } catch (e) {
            console.log('Could not load saved form data');
        }
    }
}

function clearSavedFormData() {
    localStorage.removeItem('pledgeFormData');
}

function shareOnSocial(platform) {
    const url = window.location.href;
    const text = "I just made a pledge to support clean indoor air! Join me in keeping our spaces smoke-free.";
    
    let shareUrl = '';
    
    switch(platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function copyPledgeLink() {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Link copied to clipboard!');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--deep-plum);
        color: var(--ivory);
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

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

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .pledge-form-section {
        padding: 3rem 0;
        background: var(--ivory);
    }
    
    .pledge-form-container {
        max-width: 800px;
        margin: 0 auto;
        background: var(--ivory);
        padding: 2rem;
        border-radius: 8px;
        border: 1px solid var(--soft-gray);
    }
    
    .pledge-commitments {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: var(--sage-tint);
        border-radius: 8px;
    }
    
    .commitment-list {
        space-y: 1.5rem;
    }
    
    .commitment-item {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .commitment-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
    }
    
    .commitment-text strong {
        color: var(--deep-plum);
        display: block;
        margin-bottom: 0.5rem;
    }
    
    .commitment-text p {
        color: var(--charcoal);
        margin: 0;
        font-size: 0.9rem;
    }
    
    .form-section {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--soft-gray);
    }
    
    .form-section:last-child {
        border-bottom: none;
    }
    
    .form-section-title {
        color: var(--deep-plum);
        margin-bottom: 1rem;
        font-size: 1.25rem;
    }
    
    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group label {
        display: block;
        font-weight: 600;
        color: var(--deep-plum);
        margin-bottom: 0.5rem;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--soft-gray);
        border-radius: 5px;
        font-size: 1rem;
        font-family: var(--font-body);
        transition: border-color 0.2s ease;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--deep-plum);
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #dc3545;
    }
    
    .form-help {
        display: block;
        color: rgba(31, 35, 40, 0.7);
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    .field-error {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    .checkbox-group {
        space-y: 1rem;
    }
    
    .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        margin-bottom: 1rem;
        cursor: pointer;
        font-size: 0.95rem;
        line-height: 1.4;
    }
    
    .checkbox-label input[type="checkbox"] {
        display: none;
    }
    
    .checkbox-custom {
        width: 20px;
        height: 20px;
        border: 2px solid var(--deep-plum);
        border-radius: 3px;
        flex-shrink: 0;
        margin-top: 2px;
        position: relative;
        transition: all 0.2s ease;
    }
    
    .checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
        background: var(--deep-plum);
    }
    
    .checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
        content: "✓";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--ivory);
        font-size: 12px;
        font-weight: bold;
    }
    
    .consent-section {
        margin: 2rem 0;
        padding: 1.5rem;
        background: var(--sage-tint);
        border-radius: 8px;
    }
    
    .checkbox-label.required {
        font-weight: 600;
    }
    
    .form-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 2rem;
    }
    
    .pledge-stats-section {
        padding: 2rem 0;
        background: var(--sage-tint);
    }
    
    .pledge-stats {
        display: flex;
        justify-content: center;
        gap: 3rem;
        flex-wrap: wrap;
    }
    
    .stat-item {
        text-align: center;
    }
    
    .stat-number {
        font-size: 2.5rem;
        font-family: var(--font-heading);
        font-weight: 700;
        color: var(--deep-plum);
        margin-bottom: 0.5rem;
    }
    
    .stat-label {
        color: var(--charcoal);
        font-weight: 500;
    }
    
    .pledge-wall-section {
        padding: 3rem 0;
        background: var(--ivory);
    }
    
    .pledge-wall {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
    }
    
    .pledge-card {
        padding: 1.5rem;
        background: var(--sage-tint);
        border-radius: 8px;
        border: 1px solid rgba(74, 42, 59, 0.2);
    }
    
    .pledge-card.new-pledge {
        border-color: var(--deep-plum);
        box-shadow: 0 4px 8px rgba(74, 42, 59, 0.2);
    }
    
    .pledge-quote {
        font-style: italic;
        color: var(--charcoal);
        margin-bottom: 1rem;
        line-height: 1.4;
    }
    
    .pledge-author {
        font-weight: 600;
        color: var(--deep-plum);
        margin-bottom: 0.25rem;
    }
    
    .pledge-date {
        font-size: 0.875rem;
        color: rgba(31, 35, 40, 0.7);
    }
    
    .thank-you-section {
        padding: 4rem 0;
        background: var(--sage-tint);
        text-align: center;
    }
    
    .thank-you-content {
        max-width: 600px;
        margin: 0 auto;
    }
    
    .thank-you-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }
    
    .thank-you-title {
        font-size: 2.5rem;
        color: var(--deep-plum);
        margin-bottom: 1rem;
    }
    
    .thank-you-message {
        font-size: 1.125rem;
        color: var(--charcoal);
        margin-bottom: 2rem;
        line-height: 1.5;
    }
    
    .thank-you-next-steps {
        text-align: left;
        margin: 2rem 0;
        padding: 1.5rem;
        background: var(--ivory);
        border-radius: 8px;
    }
    
    .thank-you-next-steps h3 {
        color: var(--deep-plum);
        margin-bottom: 1rem;
    }
    
    .thank-you-next-steps ul {
        list-style: none;
        padding: 0;
    }
    
    .thank-you-next-steps li {
        margin-bottom: 0.75rem;
        color: var(--charcoal);
    }
    
    .thank-you-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin: 2rem 0;
    }
    
    .social-sharing {
        margin-top: 2rem;
    }
    
    .social-sharing h4 {
        color: var(--deep-plum);
        margin-bottom: 1rem;
    }
    
    .share-buttons {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .share-btn {
        padding: 0.5rem 1rem;
        background: var(--deep-plum);
        color: var(--ivory);
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.875rem;
        transition: background-color 0.2s ease;
    }
    
    .share-btn:hover {
        background: var(--charcoal);
    }
    
    @media (max-width: 768px) {
        .pledge-form-container {
            padding: 1.5rem;
        }
        
        .form-grid {
            grid-template-columns: 1fr;
        }
        
        .form-actions {
            flex-direction: column;
            align-items: center;
        }
        
        .form-actions .btn {
            width: 100%;
            max-width: 300px;
        }
        
        .pledge-stats {
            gap: 2rem;
        }
        
        .pledge-wall {
            grid-template-columns: 1fr;
        }
        
        .thank-you-actions {
            flex-direction: column;
            align-items: center;
        }
        
        .thank-you-actions .btn {
            width: 100%;
            max-width: 300px;
        }
    }
`;
document.head.appendChild(style);

// Export for external use
window.PledgePage = {
    shareOnSocial,
    copyPledgeLink,
    showNotification
};