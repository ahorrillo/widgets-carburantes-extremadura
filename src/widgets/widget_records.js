import { cargarDatos, agruparMensual, NOMBRES_REGION } from './grafico_editorial.js';

function formatearPrecio(valor) {
  return Number(valor).toFixed(3).replace('.', ',');
}

export async function renderWidgetRecords(containerId, region = 'extremadura', baseUrl = '', producto = 'gasolina') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const nombre = NOMBRES_REGION[region] || region.charAt(0).toUpperCase() + region.slice(1);
  const esGasolina = producto !== 'gasoleo';
  const claveMedia = esGasolina ? 'mediaGasolina' : 'mediaGasoleo';
  const nombreProducto = esGasolina ? 'Gasolina 95 E5' : 'Gasóleo A';

  try {
    const registros = await cargarDatos(region, baseUrl);
    const meses = agruparMensual(registros).filter(m => m[claveMedia] !== null);
    if (!meses.length) return;

    const masCaro = meses.reduce((a, b) => (b[claveMedia] > a[claveMedia] ? b : a));
    const masBarato = meses.reduce((a, b) => (b[claveMedia] < a[claveMedia] ? b : a));

    let mayorSubida = null;
    for (let i = 1; i < meses.length; i++) {
      const delta = meses[i][claveMedia] - meses[i - 1][claveMedia];
      if (!mayorSubida || delta > mayorSubida.delta) {
        mayorSubida = { desde: meses[i - 1], hasta: meses[i], delta };
      }
    }

    const filaMayorSubida = mayorSubida && mayorSubida.delta > 0
      ? `
        <div class="wc-record-fila">
          <span class="wc-record-etiqueta">Mayor subida mensual</span>
          <span class="wc-record-valor">+${formatearPrecio(mayorSubida.delta)} €/l
            <span class="wc-record-detalle">(${mayorSubida.desde.nombre} → ${mayorSubida.hasta.nombre})</span>
          </span>
        </div>`
      : '';

    container.innerHTML = `
      <div class="wc-card">
        <h4 class="wc-titulo">Récords de 2026 en ${nombre}</h4>
          <div class="wc-record-fila">
            <span class="wc-record-etiqueta">Mes más caro</span>
            <span class="wc-record-valor">${masCaro.nombre}
              <span class="wc-record-detalle">${formatearPrecio(masCaro[claveMedia])} €/l</span>
            </span>
          </div>
          <div class="wc-record-fila">
            <span class="wc-record-etiqueta">Mes más barato</span>
            <span class="wc-record-valor">${masBarato.nombre}
              <span class="wc-record-detalle">${formatearPrecio(masBarato[claveMedia])} €/l</span>
            </span>
          </div>
          ${filaMayorSubida}
        <p class="wc-fuente">${nombreProducto} · Fuente: MITECO</p>
      </div>
    `;
  } catch (err) {
    console.error(`Error cargando los récords para ${region}:`, err);
  }
}
