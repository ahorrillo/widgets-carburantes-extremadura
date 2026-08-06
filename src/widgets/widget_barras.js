import {
  cargarDatos,
  agruparMensual,
  renderizarTarjetaEditorial,
  crearGraficoBarras,
  formatearMesCorto,
  NOMBRES_REGION
} from './grafico_editorial.js';

export async function renderWidgetBarras(containerId, region = 'extremadura', baseUrl = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const nombre = NOMBRES_REGION[region] || region.charAt(0).toUpperCase() + region.slice(1);

  try {
    const registros = await cargarDatos(region, baseUrl);
    const meses = agruparMensual(registros);

    const ctx = renderizarTarjetaEditorial(
      containerId,
      `Media mensual en ${nombre}`,
      'Fuente: MITECO · Medias mensuales de precios diarios'
    );
    if (!ctx) return;

    crearGraficoBarras(ctx, {
      etiquetas: meses.map(m => formatearMesCorto(m.clave)),
      series: [
        { label: 'Gasolina 95', ink: 'gasolina', data: meses.map(m => m.mediaGasolina) },
        { label: 'Gasóleo A', ink: 'gasoleo', data: meses.map(m => m.mediaGasoleo) }
      ]
    });
  } catch (err) {
    console.error(`Error cargando el gráfico de barras para ${region}:`, err);
  }
}
