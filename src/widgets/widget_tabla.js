export async function renderWidgetTabla(containerId, region = 'extremadura', baseUrl = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const esProvincial = region === 'badajoz' || region === 'caceres';

  // Limpia la barra final si existe
  const cdnBase = baseUrl ? baseUrl.replace(/\/$/, '') : '/datos';

  const archivo = esProvincial
    ? 'historico_provincias_extremadura_2026.json'
    : 'historico_extremadura_2026.json';

  const url = `${cdnBase}/${archivo}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} al solicitar ${url}`);

    const data = await res.json();
    const titulo = region.charAt(0).toUpperCase() + region.slice(1);

    // 1. Agrupar registros por Mes y Año
    const agrupadoPorMes = {};

    data.forEach(d => {
      const item = esProvincial ? d[region] : d;
      if (!d.fecha || !item) return;

      // Asume formato "YYYY-MM-DD" o "DD/MM/YYYY" -> extrae Mes y Año
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

    const filasHtml = clavesOrdenadas.map(clave => {
      const [year, month] = clave.split('-');
      const nombreMes = nombresMeses[parseInt(month, 10) - 1] || clave;
      const stats = agrupadoPorMes[clave];

      const mediaGasolina = stats.gasolinaCount > 0
        ? (stats.gasolinaSum / stats.gasolinaCount).toFixed(3)
        : '-';

      const mediaGasoleo = stats.gasoleoCount > 0
        ? (stats.gasoleoSum / stats.gasoleoCount).toFixed(3)
        : '-';

      return `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px; color: #475569; font-weight: 500;">${nombreMes} ${year}</td>
          <td style="padding: 10px; font-weight: bold; color: #1e40af;">${mediaGasolina} €/l</td>
          <td style="padding: 10px; font-weight: bold; color: #166534;">${mediaGasoleo} €/l</td>
        </tr>
      `;
    }).join('');

    // 3. Renderizar estructura HTML de la tabla
    container.innerHTML = `
      <div style="font-family: system-ui, sans-serif; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; max-width: 600px; background: #fff;">
        <h4 style="margin: 0 0 12px 0; color: #0f172a;">Promedio mensual de carburantes (${titulo})</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
          <thead>
            <tr style="background: #f8fafc; color: #64748b; border-bottom: 2px solid #e2e8f0;">
              <th style="padding: 8px 10px;">Mes</th>
              <th style="padding: 8px 10px;">Media Gasolina 95</th>
              <th style="padding: 8px 10px;">Media Gasóleo A</th>
            </tr>
          </thead>
          <tbody>${filasHtml}</tbody>
        </table>
      </div>
    `;
  } catch (err) {
    console.error(`Error cargando la tabla para ${region}:`, err);
  }
}
