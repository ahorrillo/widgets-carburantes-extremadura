import {
  cargarDatos,
  renderizarTarjetaEditorial,
  crearGraficoDiferencial,
  NOMBRES_REGION
} from './grafico_editorial.js';

export async function renderWidgetDiferencial(containerId, region = 'extremadura', baseUrl = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const nombre = NOMBRES_REGION[region] || region.charAt(0).toUpperCase() + region.slice(1);

  try {
    const registros = await cargarDatos(region, baseUrl);

    const ctx = renderizarTarjetaEditorial(
      containerId,
      `Diferencial gasóleo − gasolina en ${nombre}`,
      'Fuente: MITECO · Precios medios diarios'
    );
    if (!ctx) return;

    crearGraficoDiferencial(ctx, {
      etiquetas: registros.map(r => r.fecha),
      data: registros.map(r =>
        typeof r.gasoleo === 'number' && typeof r.gasolina === 'number'
          ? Number((r.gasoleo - r.gasolina).toFixed(3))
          : null
      )
    });
  } catch (err) {
    console.error(`Error cargando el diferencial para ${region}:`, err);
  }
}
