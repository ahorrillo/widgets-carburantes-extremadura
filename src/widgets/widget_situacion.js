import {
  cargarDatos,
  agruparMensual,
  NOMBRES_REGION,
  formatearFechaLarga
} from './grafico_editorial.js';

function formatearPrecio(valor) {
  return valor === null || valor === undefined ? '-' : Number(valor).toFixed(3).replace('.', ',');
}

function claveMesAnterior(fecha) {
  const partes = fecha.split(/[-/]/);
  let anio, mes;
  if (partes[0].length === 4) {
    anio = Number(partes[0]);
    mes = Number(partes[1]);
  } else {
    anio = Number(partes[2]);
    mes = Number(partes[1]);
  }
  mes -= 1;
  if (mes === 0) {
    mes = 12;
    anio -= 1;
  }
  return `${anio}-${String(mes).padStart(2, '0')}`;
}

function renderDelta(delta, base) {
  if (delta === null || base === null || base === undefined || base === 0) {
    return '<span class="wc-delta">Sin variación mensual</span>';
  }
  const esSubida = delta >= 0;
  const flecha = esSubida ? '▲' : '▼';
  const texto = `${flecha} ${Math.abs(delta).toFixed(3).replace('.', ',')} €/l · ` +
    `${esSubida ? '+' : '−'}${(Math.abs(delta) / base * 100).toFixed(1).replace('.', ',')}%`;
  return `<span class="wc-delta">${texto}</span>`;
}

export async function renderWidgetSituacion(containerId, region = 'extremadura', baseUrl = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const nombre = NOMBRES_REGION[region] || region.charAt(0).toUpperCase() + region.slice(1);

  try {
    const registros = await cargarDatos(region, baseUrl);
    const ultimo = registros.filter(r => r.gasolina !== null || r.gasoleo !== null).pop();
    if (!ultimo) return;

    const meses = agruparMensual(registros);
    const previo = meses.find(m => m.clave === claveMesAnterior(ultimo.fecha));

    const deltaGasolina = typeof ultimo.gasolina === 'number' && previo?.mediaGasolina
      ? ultimo.gasolina - previo.mediaGasolina
      : null;
    const deltaGasoleo = typeof ultimo.gasoleo === 'number' && previo?.mediaGasoleo
      ? ultimo.gasoleo - previo.mediaGasoleo
      : null;

    container.innerHTML = `
      <div class="wc-card">
        <h4 class="wc-titulo">El precio hoy en ${nombre}</h4>
        <div class="wc-grid-2">
          <div class="wc-dato">
            <span class="wc-dato-etiqueta">Gasolina 95 E5</span>
            <span class="wc-dato-valor wc-valor-gas">${formatearPrecio(ultimo.gasolina)} <span class="wc-dato-unidad">€/l</span></span>
            ${renderDelta(deltaGasolina, previo?.mediaGasolina)}
          </div>
          <div class="wc-dato">
            <span class="wc-dato-etiqueta">Gasóleo A</span>
            <span class="wc-dato-valor wc-valor-gasoleo">${formatearPrecio(ultimo.gasoleo)} <span class="wc-dato-unidad">€/l</span></span>
            ${renderDelta(deltaGasoleo, previo?.mediaGasoleo)}
          </div>
        </div>
        <p class="wc-fuente">Datos a ${formatearFechaLarga(ultimo.fecha)} · Variación frente a la media del mes anterior · Fuente: MITECO</p>
      </div>
    `;
  } catch (err) {
    console.error(`Error cargando la situación para ${region}:`, err);
  }
}
