// ======================
// Dynamic Incident Chart
// ======================

// Sample dynamic data (you can later fetch this from a database or JSON file)
const incidentData = {
  labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  datasets: [
    {
      label: 'Fire',
      data: [30, 20, 40, 50, 60, 45, 70, 55, 65, 75, 80, 90],
      borderColor: '#ff4d4d',
      backgroundColor: 'rgba(255, 77, 77, 0.1)',
      fill: true,
      tension: 0.3
    },
    {
      label: 'Flood',
      data: [20, 35, 25, 45, 30, 50, 55, 35, 45, 60, 50, 65],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.1)',
      fill: true,
      tension: 0.3
    },
    {
      label: 'Crime',
      data: [10, 25, 15, 35, 25, 30, 40, 25, 35, 40, 45, 55],
      borderColor: '#facc15',
      backgroundColor: 'rgba(250,204,21,0.1)',
      fill: true,
      tension: 0.3
    }
  ]
};

// Create a <canvas> dynamically inside your chart area
const chartContainer = document.getElementById('chart-area');
chartContainer.innerHTML = '<canvas id="incidentChart"></canvas>';

const ctx = document.getElementById('incidentChart').getContext('2d');

// Create Chart.js Line Chart
const incidentChart = new Chart(ctx, {
  type: 'line',
  data: incidentData,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          color: '#333',
          font: { size: 12, weight: 500 }
        }
      },
      tooltip: {
        backgroundColor: '#333',
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 10,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#eee' },
        ticks: { stepSize: 25, color: '#555', font: { size: 11 } }
      },
      x: {
        grid: { color: '#f8f8f8' },
        ticks: { color: '#555', font: { size: 11 } }
      }
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuart'
    }
  }
});

// ======================
// Dynamic Year Selector
// ======================
document.querySelector('.chart-dropdown').addEventListener('change', (e) => {
  const selectedYear = e.target.value;
  console.log('Year selected:', selectedYear);

  // You can dynamically load data based on year selection
  // Example: change Fire incidents randomly for demo
  incidentChart.data.datasets[0].data = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100));
  incidentChart.update();
});
