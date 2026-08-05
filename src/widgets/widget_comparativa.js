import { renderizarTarjetaEditorial, crearGraficoEditorial } from './grafico_editorial.js';

export async function renderWidgetComparativa(containerId, region, baseUrl = '', producto = 'gasolina') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cdnBase = baseUrl ? baseUrl.replace(/\/$/, '') : '/datos';
  const url = `${cdnBase}/historico_provincias_extremadura_2026.json`;

  const esGasolina = producto !== 'gasoleo';
  const nombreProducto = esGasolina ? 'Gasolina 95 E5' : 'Gasóleo A';
  const ink = esGasolina ? 'gasolina' : 'gasoleo';
  const paleta = esGasolina
    ? { badajoz: '#8ba3e0', caceres: '#1e40af' }
    : { badajoz: '#7fb28e', caceres: '#166534' };

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} al solicitar ${url}`);
    const data = await res.json();

    const serie = provincia => data.map(d => ({
      fecha: d.fecha,
      valor: esGasolina ? d[provincia]?.gasolina95_E5 : d[provincia]?.gasoleoA
    }));

    const badajoz = serie('badajoz');
    const caceres = serie('caceres');

    const ctx = renderizarTarjetaEditorial(
      containerId,
      `${nombreProducto}: Badajoz frente a Cáceres`,
      'Fuente: MITECO · Precios medios diarios'
    );
    if (!ctx) return;

    crearGraficoEditorial(ctx, {
      etiquetas: badajoz.map(r => r.fecha),
      series: [
        { label: 'Badajoz', ink, data: badajoz.map(r => r.valor), color: paleta.badajoz, borderWidth: 3, fill: false },
        { label: 'Cáceres', ink, data: caceres.map(r => r.valor), color: paleta.caceres, borderDash: [0, 6], borderCapStyle: 'round', borderWidth: 3, fill: false }
      ]
    });
  } catch (err) {
    console.error('Error cargando la comparativa:', err);
  }
}
