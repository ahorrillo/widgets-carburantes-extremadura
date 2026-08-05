import { renderizarTarjetaEditorial, crearGraficoEditorial, NOMBRES_REGION } from './grafico_editorial.js';

export async function renderWidgetProvincial(containerId, provincia = 'badajoz', baseUrl = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cdnBase = baseUrl ? baseUrl.replace(/\/$/, '') : '/datos';
  const url = `${cdnBase}/historico_provincias_extremadura_2026.json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} al solicitar ${url}`);
    const data = await res.json();

    const titulo = NOMBRES_REGION[provincia] || provincia.charAt(0).toUpperCase() + provincia.slice(1);

    const ctx = renderizarTarjetaEditorial(
      containerId,
      `Evolución de carburantes en ${titulo}`,
      'Fuente: MITECO · Precios medios diarios'
    );
    if (!ctx) return;

    crearGraficoEditorial(ctx, {
      etiquetas: data.map(d => d.fecha),
      series: [
        { label: 'Gasolina 95 E5 (€/l)', ink: 'gasolina', data: data.map(d => d[provincia]?.gasolina95_E5) },
        { label: 'Gasóleo A (€/l)', ink: 'gasoleo', data: data.map(d => d[provincia]?.gasoleoA) }
      ]
    });
  } catch (err) {
    console.error(`Error cargando el gráfico de ${provincia}:`, err);
  }
}
