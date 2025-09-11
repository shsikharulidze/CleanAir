// Calculator Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize calculator with default values
    calculateCosts();
    
    // Add event listeners for real-time calculation
    const inputs = document.querySelectorAll('#price-per-pack, #packs-per-week, #years-smoking');
    inputs.forEach(input => {
        input.addEventListener('input', calculateCosts);
    });
});

function calculateCosts() {
    // Get input values
    const pricePerPack = parseFloat(document.getElementById('price-per-pack').value) || 0;
    const packsPerWeek = parseFloat(document.getElementById('packs-per-week').value) || 0;
    const yearsSmoking = parseInt(document.getElementById('years-smoking').value) || 0;
    
    // Calculate costs
    const weeklySpend = pricePerPack * packsPerWeek;
    const monthlySpend = weeklySpend * 4.33; // Average weeks per month
    const yearlySpend = weeklySpend * 52;
    const totalSpent = yearlySpend * yearsSmoking;
    
    // Update display elements
    document.getElementById('monthly-cost').textContent = formatCurrency(monthlySpend);
    document.getElementById('yearly-cost').textContent = formatCurrency(yearlySpend);
    document.getElementById('total-cost').textContent = formatCurrency(totalSpent);
    document.getElementById('years-display').textContent = yearsSmoking;
    
    // Update savings projections
    updateSavingsProjections(weeklySpend, monthlySpend, yearlySpend);
    
    // Update time calculations
    updateTimeCalculations(packsPerWeek, yearsSmoking);
    
    // Update alternatives
    updateAlternatives(monthlySpend);
    
    // Save values to localStorage
    saveCalculatorValues(pricePerPack, packsPerWeek, yearsSmoking);
}

function updateSavingsProjections(weeklySpend, monthlySpend, yearlySpend) {
    document.getElementById('savings-week').textContent = formatCurrency(weeklySpend);
    document.getElementById('savings-month').textContent = formatCurrency(monthlySpend);
    document.getElementById('savings-3months').textContent = formatCurrency(monthlySpend * 3);
    document.getElementById('savings-year').textContent = formatCurrency(yearlySpend);
    document.getElementById('savings-5years').textContent = formatCurrency(yearlySpend * 5);
}

function updateTimeCalculations(packsPerWeek, yearsSmoking) {
    // Estimate 5 minutes per cigarette, 20 cigarettes per pack
    const minutesPerPack = 20 * 5; // 100 minutes per pack
    const minutesPerWeek = packsPerWeek * minutesPerPack;
    const minutesPerDay = minutesPerWeek / 7;
    const minutesPerMonth = minutesPerWeek * 4.33;
    const totalMinutes = minutesPerWeek * 52 * yearsSmoking;
    
    // Convert to readable format
    document.getElementById('time-per-day').textContent = formatTime(minutesPerDay);
    document.getElementById('time-per-month').textContent = formatTime(minutesPerMonth);
    document.getElementById('time-total').textContent = formatTime(totalMinutes);
}

function updateAlternatives(monthlySpend) {
    const alternatives = [
        { item: "Gym membership", cost: 50, icon: "🏋️" },
        { item: "Streaming services", cost: 15, icon: "📺" },
        { item: "Coffee for a month", cost: 120, icon: "☕" },
        { item: "Nice dinner out", cost: 80, icon: "🍽️" },
        { item: "Books", cost: 25, icon: "📚" },
        { item: "Movie tickets", cost: 30, icon: "🎬" },
        { item: "Gas for car", cost: 100, icon: "⛽" },
        { item: "Phone bill", cost: 70, icon: "📱" }
    ];
    
    // Filter alternatives that cost less than monthly spend
    const affordableAlternatives = alternatives.filter(alt => alt.cost <= monthlySpend);
    
    // Sort by cost descending
    affordableAlternatives.sort((a, b) => b.cost - a.cost);
    
    // Take top 4
    const topAlternatives = affordableAlternatives.slice(0, 4);
    
    // Generate HTML
    const alternativesGrid = document.getElementById('alternatives-grid');
    alternativesGrid.innerHTML = topAlternatives.map(alt => `
        <div class="alternative-item">
            <div class="alternative-icon">${alt.icon}</div>
            <div class="alternative-name">${alt.item}</div>
            <div class="alternative-quantity">${Math.floor(monthlySpend / alt.cost)}x per month</div>
        </div>
    `).join('');
    
    // If no alternatives fit, show a message
    if (topAlternatives.length === 0) {
        alternativesGrid.innerHTML = `
            <div class="alternative-item">
                <div class="alternative-icon">💰</div>
                <div class="alternative-name">Savings account</div>
                <div class="alternative-quantity">Build your emergency fund</div>
            </div>
        `;
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatTime(minutes) {
    if (minutes < 60) {
        return Math.round(minutes) + ' min';
    } else if (minutes < 1440) { // Less than 24 hours
        return Math.round(minutes / 60) + ' hours';
    } else { // Days
        return Math.round(minutes / 1440) + ' days';
    }
}

function saveCalculatorValues(pricePerPack, packsPerWeek, yearsSmoking) {
    const calculatorData = {
        pricePerPack,
        packsPerWeek,
        yearsSmoking,
        lastCalculated: new Date().toISOString()
    };
    localStorage.setItem('calculatorData', JSON.stringify(calculatorData));
}

function loadSavedValues() {
    const savedData = localStorage.getItem('calculatorData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            if (data.pricePerPack) document.getElementById('price-per-pack').value = data.pricePerPack;
            if (data.packsPerWeek) document.getElementById('packs-per-week').value = data.packsPerWeek;
            if (data.yearsSmoking) document.getElementById('years-smoking').value = data.yearsSmoking;
            
            calculateCosts();
        } catch (e) {
            console.log('Could not load saved calculator data');
        }
    }
}

// Load saved values when page loads
document.addEventListener('DOMContentLoaded', loadSavedValues);

// Add input validation
function validateInputs() {
    const priceInput = document.getElementById('price-per-pack');
    const packsInput = document.getElementById('packs-per-week');
    const yearsInput = document.getElementById('years-smoking');
    
    // Price per pack validation
    priceInput.addEventListener('input', function() {
        if (this.value < 1) this.value = 1;
        if (this.value > 50) this.value = 50;
    });
    
    // Packs per week validation
    packsInput.addEventListener('input', function() {
        if (this.value < 0.5) this.value = 0.5;
        if (this.value > 50) this.value = 50;
    });
    
    // Years smoking validation
    yearsInput.addEventListener('input', function() {
        if (this.value < 1) this.value = 1;
        if (this.value > 50) this.value = 50;
    });
}

// Initialize validation
document.addEventListener('DOMContentLoaded', validateInputs);

// Add animation to results
function animateResults() {
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
    });
}

// CSS for animation (add to page dynamically)
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .calculator-form {
        background: var(--ivory);
        padding: 2rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        border: 1px solid var(--soft-gray);
    }
    
    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
    }
    
    .form-group label {
        font-weight: 600;
        color: var(--deep-plum);
        margin-bottom: 0.5rem;
    }
    
    .form-group input {
        padding: 0.75rem;
        border: 2px solid var(--soft-gray);
        border-radius: 5px;
        font-size: 1rem;
        transition: border-color 0.2s ease;
    }
    
    .form-group input:focus {
        outline: none;
        border-color: var(--deep-plum);
    }
    
    .form-help {
        color: rgba(31, 35, 40, 0.7);
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    .calculator-results {
        margin-top: 2rem;
    }
    
    .results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .result-card {
        text-align: center;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid var(--soft-gray);
    }
    
    .result-card.highlight {
        background: var(--sage-tint);
    }
    
    .result-card.total {
        background: var(--deep-plum);
        color: var(--ivory);
    }
    
    .result-label {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--deep-plum);
    }
    
    .result-card.total .result-label {
        color: var(--ivory);
    }
    
    .result-amount {
        font-size: 2.5rem;
        font-family: var(--font-heading);
        font-weight: 700;
        color: var(--deep-plum);
        margin-bottom: 0.5rem;
    }
    
    .result-card.total .result-amount {
        color: var(--ivory);
    }
    
    .result-note {
        color: rgba(31, 35, 40, 0.7);
        font-size: 0.875rem;
    }
    
    .result-card.total .result-note {
        color: rgba(255, 255, 250, 0.8);
    }
    
    .alternatives-section {
        margin: 2rem 0;
        padding: 1.5rem;
        background: var(--ivory);
        border-radius: 8px;
        border: 1px solid var(--soft-gray);
    }
    
    .alternatives-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .alternative-item {
        text-align: center;
        padding: 1rem;
        background: var(--soft-gray);
        border-radius: 5px;
    }
    
    .alternative-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
    
    .alternative-name {
        font-weight: 600;
        color: var(--deep-plum);
        margin-bottom: 0.25rem;
    }
    
    .alternative-quantity {
        font-size: 0.875rem;
        color: rgba(31, 35, 40, 0.7);
    }
    
    .time-section {
        margin: 2rem 0;
        padding: 1.5rem;
        background: var(--sage-tint);
        border-radius: 8px;
        text-align: center;
    }
    
    .time-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1.5rem;
        margin: 1.5rem 0;
    }
    
    .time-stat {
        text-align: center;
    }
    
    .time-number {
        font-size: 1.5rem;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--deep-plum);
    }
    
    .time-label {
        font-size: 0.875rem;
        color: rgba(31, 35, 40, 0.7);
        margin-top: 0.25rem;
    }
    
    .time-note {
        color: rgba(31, 35, 40, 0.7);
        font-size: 0.875rem;
        margin: 0;
    }
    
    .savings-section {
        padding: 3rem 0;
        background: var(--ivory);
    }
    
    .savings-timeline {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
    }
    
    .savings-milestone {
        text-align: center;
        padding: 1.5rem;
        background: var(--sage-tint);
        border-radius: 8px;
        border: 1px solid rgba(74, 42, 59, 0.2);
    }
    
    .milestone-time {
        font-weight: 600;
        color: var(--deep-plum);
        margin-bottom: 0.5rem;
    }
    
    .milestone-amount {
        font-size: 1.5rem;
        font-family: var(--font-heading);
        font-weight: 700;
        color: var(--deep-plum);
        margin-bottom: 0.75rem;
    }
    
    .milestone-benefit {
        font-size: 0.875rem;
        color: rgba(31, 35, 40, 0.8);
        line-height: 1.4;
    }
    
    .hidden-costs-section {
        padding: 3rem 0;
        background: var(--soft-gray);
    }
    
    .hidden-costs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }
    
    .hidden-cost-card {
        padding: 1.5rem;
        background: var(--ivory);
        border-radius: 8px;
        border: 1px solid var(--charcoal);
    }
    
    .hidden-cost-title {
        color: var(--deep-plum);
        margin-bottom: 1rem;
    }
    
    .hidden-cost-list {
        list-style: none;
        padding: 0;
        margin-bottom: 1rem;
    }
    
    .hidden-cost-list li {
        padding: 0.25rem 0;
        color: var(--charcoal);
    }
    
    .hidden-cost-list li::before {
        content: "• ";
        color: var(--deep-plum);
        font-weight: bold;
    }
    
    .hidden-cost-note {
        font-weight: 600;
        color: var(--deep-plum);
        font-size: 0.9rem;
        margin: 0;
    }
    
    @media (max-width: 768px) {
        .form-grid,
        .results-grid,
        .alternatives-grid,
        .time-stats,
        .savings-timeline,
        .hidden-costs-grid {
            grid-template-columns: 1fr;
        }
        
        .result-amount {
            font-size: 2rem;
        }
        
        .calculator-form {
            padding: 1.5rem;
        }
    }
`;
document.head.appendChild(style);

// Animate on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(animateResults, 500);
});

// Export functions for external use
window.Calculator = {
    calculateCosts,
    formatCurrency,
    formatTime
};