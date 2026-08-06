import { NOMBRES_REGION } from './grafico_editorial.js';

export async function renderWidgetTabla(containerId, region = 'extremadura', baseUrl = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const esProvincial = region === 'badajoz' || region === 'caceres';

  const cdnBase = baseUrl ? baseUrl.replace(/\/$/, '') : '/datos';

  const archivo = esProvincial
    ? 'historico_provincias_extremadura_2026.json'
    : 'historico_extremadura_2026.json';

  const url = `${cdnBase}/${archivo}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} al solicitar ${url}`);

    const data = await res.json();
    const titulo = NOMBRES_REGION[region] || region.charAt(0).toUpperCase() + region.slice(1);

    // 1. Agrupar registros por Mes y Año
    const agrupadoPorMes = {};

    data.forEach(d => {
      const item = esProvincial ? d[region] : d;
      if (!d.fecha || !item) return;

      // Asume formato "DD-MM-YYYY" o "YYYY-MM-DD" -> extrae Mes y Año
      const partes = d.fecha.split(/[-/]/);
      let claveMes = '';

      if (partes[0].length === 4) {
        claveMes = `${partes[0]}-${partes[1]}`; // YYYY-MM
      } else {
        claveMes = `${partes[2]}-${partes[1]}`; // YYYY-MM desde DD/MM/YYYY
      }

      if (!agrupadoPorMes[claveMes]) {
        agrupadoPorMes[claveMes] = {
          gasolinaSum: 0,
          gasolinaCount: 0,
          gasoleoSum: 0,
          gasoleoCount: 0
        };
      }

      if (typeof item.gasolina95_E5 === 'number') {
        agrupadoPorMes[claveMes].gasolinaSum += item.gasolina95_E5;
        agrupadoPorMes[claveMes].gasolinaCount++;
      }
      if (typeof item.gasoleoA === 'number') {
        agrupadoPorMes[claveMes].gasoleoSum += item.gasoleoA;
        agrupadoPorMes[claveMes].gasoleoCount++;
      }
    });

    // Nombres de los meses en español
    const nombresMeses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // 2. Generar filas calculando la media
    const clavesOrdenadas = Object.keys(agrupadoPorMes).sort(); // Orden cronológico

    const media = (sum, count) => count > 0 ? (sum / count).toFixed(3).replace('.', ',') : '-';

    const filasHtml = clavesOrdenadas.map(clave => {
      const [year, month] = clave.split('-');
      const nombreMes = nombresMeses[parseInt(month, 10) - 1] || clave;
      const stats = agrupadoPorMes[clave];

      const mediaGasolina = media(stats.gasolinaSum, stats.gasolinaCount);
      const mediaGasoleo = media(stats.gasoleoSum, stats.gasoleoCount);

      return `
        <tr class="wc-fila">
          <td class="wc-td">${nombreMes} ${year}</td>
          <td class="wc-td wc-derecha wc-valor wc-valor-gas">${mediaGasolina === '-' ? '-' : `${mediaGasolina} €/l`}</td>
          <td class="wc-td wc-derecha wc-valor wc-valor-gasoleo">${mediaGasoleo === '-' ? '-' : `${mediaGasoleo} €/l`}</td>
        </tr>
      `;
    }).join('');

    // 3. Renderizar estructura HTML de la tabla
    container.innerHTML = `
      <div class="wc-card">
        <h4 class="wc-titulo">Promedio mensual de carburantes (${titulo})</h4>
        <table class="wc-tabla">
          <thead>
            <tr class="wc-fila-cabecera">
              <th class="wc-th">Mes</th>
              <th class="wc-th wc-derecha">Gasolina 95</th>
              <th class="wc-th wc-derecha">Gasóleo A</th>
            </tr>
          </thead>
          <tbody>${filasHtml}</tbody>
        </table>
        <p class="wc-fuente">Fuente: MITECO · Medias mensuales de precios diarios</p>
      </div>
    `;
  } catch (err) {
    console.error(`Error cargando la tabla para ${region}:`, err);
  }
}
