// Quit Help Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date for quit date picker to today
    const dateInput = document.querySelector('.date-input');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Set default to one week from today
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        dateInput.value = nextWeek.toISOString().split('T')[0];
    }
});

function generateQuitPlan() {
    // Get form values
    const triggers = document.querySelector('.plan-step:nth-child(1) textarea').value.trim();
    const alternatives = document.querySelector('.plan-step:nth-child(2) textarea').value.trim();
    const support = document.querySelector('.plan-step:nth-child(3) textarea').value.trim();
    const quitDate = document.querySelector('.date-input').value;
    
    // Validate inputs
    if (!triggers || !alternatives || !support || !quitDate) {
        alert('Please fill out all sections of your quit plan.');
        return;
    }
    
    // Format quit date
    const dateObj = new Date(quitDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Generate plan summary
    const planSummary = `
        <div class="plan-item">
            <h4>My Quit Date</h4>
            <p><strong>${formattedDate}</strong></p>
        </div>
        
        <div class="plan-item">
            <h4>My Triggers</h4>
            <p>${triggers}</p>
        </div>
        
        <div class="plan-item">
            <h4>My Alternatives</h4>
            <p>${alternatives}</p>
        </div>
        
        <div class="plan-item">
            <h4>My Support Team</h4>
            <p>${support}</p>
        </div>
        
        <div class="plan-item">
            <h4>Emergency Contacts</h4>
            <p>
                National Quitline: <strong>1-800-QUIT-NOW</strong><br>
                NY State Quitline: <strong>1-866-NY-QUITS</strong>
            </p>
        </div>
        
        <div class="plan-item">
            <h4>Remember</h4>
            <ul>
                <li>Cravings only last 3-5 minutes</li>
                <li>It's normal to need multiple attempts</li>
                <li>You're protecting your family's health</li>
                <li>Free support is always available</li>
            </ul>
        </div>
    `;
    
    // Show the result
    document.getElementById('planSummary').innerHTML = planSummary;
    document.getElementById('quitPlanResult').style.display = 'block';
    
    // Scroll to result
    document.getElementById('quitPlanResult').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    // Store plan in localStorage for potential future use
    const planData = {
        triggers,
        alternatives,
        support,
        quitDate,
        createdDate: new Date().toISOString()
    };
    localStorage.setItem('quitPlan', JSON.stringify(planData));
}

function printQuitPlan() {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    const planContent = document.getElementById('planSummary').innerHTML;
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>My Quit Plan - Clean Air Indoors</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    line-height: 1.6;
                }
                h1 {
                    color: #4A2A3B;
                    text-align: center;
                    border-bottom: 2px solid #4A2A3B;
                    padding-bottom: 10px;
                }
                h4 {
                    color: #4A2A3B;
                    margin-top: 20px;
                    margin-bottom: 10px;
                }
                .plan-item {
                    margin-bottom: 20px;
                    padding: 15px;
                    border: 1px solid #E8E8E8;
                    border-radius: 5px;
                }
                ul {
                    margin: 10px 0;
                    padding-left: 20px;
                }
                li {
                    margin-bottom: 5px;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    border-top: 1px solid #E8E8E8;
                    padding-top: 20px;
                }
                strong {
                    color: #4A2A3B;
                }
                @media print {
                    body { margin: 0; }
                    .plan-item { break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <h1>My Personal Quit Plan</h1>
            ${planContent}
            <div class="footer">
                <p>Generated by Clean Air Indoors - Community prevention site</p>
                <p>For more support, visit our website or call the quitlines listed above</p>
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = function() {
        printWindow.print();
        printWindow.close();
    };
}

// Load saved plan if available
function loadSavedPlan() {
    const savedPlan = localStorage.getItem('quitPlan');
    if (savedPlan) {
        try {
            const planData = JSON.parse(savedPlan);
            
            // Fill in the form with saved data
            document.querySelector('.plan-step:nth-child(1) textarea').value = planData.triggers || '';
            document.querySelector('.plan-step:nth-child(2) textarea').value = planData.alternatives || '';
            document.querySelector('.plan-step:nth-child(3) textarea').value = planData.support || '';
            document.querySelector('.date-input').value = planData.quitDate || '';
            
            // Show a notification that we loaded saved data
            if (planData.triggers || planData.alternatives || planData.support) {
                const notification = document.createElement('div');
                notification.className = 'saved-plan-notification';
                notification.innerHTML = `
                    <p>✓ We found your saved quit plan and filled it in for you.</p>
                    <button onclick="this.parentElement.remove()">×</button>
                `;
                notification.style.cssText = `
                    background: #DDE6D5;
                    border: 1px solid #4A2A3B;
                    border-radius: 5px;
                    padding: 10px;
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `;
                
                const form = document.querySelector('.quit-plan-form');
                form.insertBefore(notification, form.firstChild);
            }
        } catch (e) {
            console.log('Could not load saved plan data');
        }
    }
}

// Load saved plan when page loads
document.addEventListener('DOMContentLoaded', loadSavedPlan);

// Save form data as user types (debounced)
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

const saveFormData = debounce(function() {
    const triggers = document.querySelector('.plan-step:nth-child(1) textarea').value.trim();
    const alternatives = document.querySelector('.plan-step:nth-child(2) textarea').value.trim();
    const support = document.querySelector('.plan-step:nth-child(3) textarea').value.trim();
    const quitDate = document.querySelector('.date-input').value;
    
    if (triggers || alternatives || support || quitDate) {
        const planData = {
            triggers,
            alternatives,
            support,
            quitDate,
            lastModified: new Date().toISOString()
        };
        localStorage.setItem('quitPlan', JSON.stringify(planData));
    }
}, 1000);

// Add event listeners to form inputs for auto-save
document.addEventListener('DOMContentLoaded', function() {
    const textareas = document.querySelectorAll('.plan-input');
    textareas.forEach(input => {
        input.addEventListener('input', saveFormData);
    });
});

// Add some encouraging messages based on quit date
function updateQuitDateMessage() {
    const quitDate = document.querySelector('.date-input').value;
    if (quitDate) {
        const today = new Date();
        const quitDay = new Date(quitDate);
        const daysUntil = Math.ceil((quitDay - today) / (1000 * 60 * 60 * 24));
        
        let message = '';
        if (daysUntil === 0) {
            message = '🎉 Today is your quit day! You can do this!';
        } else if (daysUntil === 1) {
            message = '💪 Tomorrow is your quit day! Get ready!';
        } else if (daysUntil <= 7) {
            message = `⏰ ${daysUntil} days until your quit day. Use this time to prepare!`;
        } else {
            message = `📅 ${daysUntil} days to prepare for your quit day.`;
        }
        
        // Add or update message
        let messageEl = document.querySelector('.quit-date-message');
        if (!messageEl) {
            messageEl = document.createElement('p');
            messageEl.className = 'quit-date-message';
            messageEl.style.cssText = 'color: #4A2A3B; font-weight: 500; margin-top: 10px;';
            document.querySelector('.date-input').parentNode.appendChild(messageEl);
        }
        messageEl.textContent = message;
    }
}

// Add event listener for quit date changes
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.querySelector('.date-input');
    if (dateInput) {
        dateInput.addEventListener('change', updateQuitDateMessage);
        // Run once on load if date is already set
        if (dateInput.value) {
            updateQuitDateMessage();
        }
    }
});