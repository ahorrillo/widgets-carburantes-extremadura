import Chart from 'chart.js/auto';

export async function renderWidgetExtremadura(containerId, baseUrl = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cdnBase = baseUrl ? baseUrl.replace(/\/$/, '') : '/datos';
  const url = `${cdnBase}/historico_extremadura_2026.json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} al solicitar ${url}`);
    const data = await res.json();

    const fechas = data.map(d => d.fecha);
    const gasolina = data.map(d => d.gasolina95_E5);
    const gasoleo = data.map(d => d.gasoleoA);

    container.innerHTML = `
      <div style="font-family: system-ui, sans-serif; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background: #fff;">
        <h4 style="margin: 0 0 12px 0; color: #0f172a;">Evolución de carburantes en Extremadura</h4>
        <canvas id="${containerId}-chart"></canvas>
      </div>
    `;

    const ctx = document.getElementById(`${containerId}-chart`).getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [
          {
            label: 'Gasolina 95 E5 (€/l)',
            data: gasolina,
            borderColor: '#1e40af',
            backgroundColor: 'rgba(30, 64, 175, 0.1)',
            tension: 0.3
          },
          {
            label: 'Gasóleo A (€/l)',
            data: gasoleo,
            borderColor: '#166534',
            backgroundColor: 'rgba(22, 101, 52, 0.1)',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } }
      }
    });
  } catch (err) {
    console.error('Error cargando el gráfico de Extremadura:', err);
  }
}
