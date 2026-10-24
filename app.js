// Carbon Emission Factors (kg CO2e per unit)
const FACTORS = {
  electricity: 0.70, // per kWh
  waste: 0.45,       // per kg landfill waste
  meatMeal: 2.5      // per meal
};

// DOM Elements
const form = document.getElementById('calculator-form');
const totalCo2El = document.getElementById('total-co2');
const ecoScoreEl = document.getElementById('eco-score');
const solarSlider = document.getElementById('solar-slider');
const solarValEl = document.getElementById('solar-val');
const annualSavingsEl = document.getElementById('annual-savings');

let carbonChart;

function calculateEmissions(elec, waste, meals) {
  const elecCo2 = elec * FACTORS.electricity;
  const wasteCo2 = waste * FACTORS.waste;
  const mealsCo2 = meals * FACTORS.meatMeal;
  const totalCo2 = elecCo2 + wasteCo2 + mealsCo2;

  // Normalized Eco-Score Calculation (100 = Optimal, lower = higher carbon footprint)
  const score = Math.max(0, Math.round(100 - (totalCo2 / 5)));

  return { elecCo2, wasteCo2, mealsCo2, totalCo2, score };
}

function updateChart(elecCo2, wasteCo2, mealsCo2) {
  const ctx = document.getElementById('carbonChart').getContext('2d');
  
  if (carbonChart) {
    carbonChart.destroy();
  }

  carbonChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Electricity', 'Waste', 'Food Intake'],
      datasets: [{
        data: [elecCo2, wasteCo2, mealsCo2],
        backgroundColor: ['#2e7d32', '#81c784', '#a5d6a7']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

function renderUI() {
  const elec = parseFloat(document.getElementById('electricity').value) || 0;
  const waste = parseFloat(document.getElementById('waste').value) || 0;
  const meals = parseFloat(document.getElementById('meat-meals').value) || 0;

  const { elecCo2, wasteCo2, mealsCo2, totalCo2, score } = calculateEmissions(elec, waste, meals);

  totalCo2El.textContent = totalCo2.toFixed(1);
  ecoScoreEl.textContent = score;

  updateChart(elecCo2, wasteCo2, mealsCo2);

  // Update Simulation Projection
  const solarPercent = parseFloat(solarSlider.value) / 100;
  solarValEl.textContent = solarSlider.value;
  const dailySaved = (elec * FACTORS.electricity) * solarPercent;
  const annualSaved = dailySaved * 365;
  annualSavingsEl.textContent = annualSaved.toFixed(0);
}

// Event Listeners
form.addEventListener('submit', (e) => {
  e.preventDefault();
  renderUI();
});

solarSlider.addEventListener('input', renderUI);

// Initial Render
renderUI();
