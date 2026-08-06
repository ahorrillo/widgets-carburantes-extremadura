import { renderizarTarjetaEditorial, crearGraficoEditorial } from './grafico_editorial.js';

export async function renderWidgetExtremadura(containerId, baseUrl = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cdnBase = baseUrl ? baseUrl.replace(/\/$/, '') : '/datos';
  const url = `${cdnBase}/historico_extremadura_2026.json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} al solicitar ${url}`);
    const data = await res.json();

    const ctx = renderizarTarjetaEditorial(
      containerId,
      'Evolución de carburantes en Extremadura',
      'Fuente: MITECO · Precios medios diarios'
    );
    if (!ctx) return;

    crearGraficoEditorial(ctx, {
      etiquetas: data.map(d => d.fecha),
      series: [
        { label: 'Gasolina 95', ink: 'gasolina', data: data.map(d => d.gasolina95_E5) },
        { label: 'Gasóleo A', ink: 'gasoleo', data: data.map(d => d.gasoleoA) }
      ]
    });
  } catch (err) {
    console.error('Error cargando el gráfico de Extremadura:', err);
  }
}
