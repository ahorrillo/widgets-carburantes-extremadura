import Chart from 'chart.js/auto';

export const FUENTE_SISTEMA = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

export const NOMBRES_REGION = {
  extremadura: 'Extremadura',
  badajoz: 'Badajoz',
  caceres: 'Cáceres'
};

const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const MESES_LARGOS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const INKS = {
  gasolina: { linea: '#1e40af', relleno: 'rgba(30, 64, 175, 0.1)' },
  gasoleo: { linea: '#166534', relleno: 'rgba(22, 101, 52, 0.1)' }
};

function formatearPrecio(valor) {
  if (valor === null || valor === undefined) return '-';
  return `${Number(valor).toFixed(3).replace('.', ',')} €/l`;
}

function formatearEjePrecio(valor) {
  return Number(valor).toFixed(2).replace('.', ',');
}

function formatearFecha(fecha) {
  if (!fecha) return '';
  const [dia, mes, anio] = fecha.split('-');
  const mesCorto = MESES_CORTOS[Number(mes) - 1];
  return mesCorto ? `${dia} ${mesCorto}` : fecha;
}

export function formatearFechaLarga(fecha) {
  if (!fecha) return '';
  const [dia, mes, anio] = fecha.split('-');
  const mesLargo = MESES_LARGOS[Number(mes) - 1];
  return mesLargo ? `${dia} de ${mesLargo} de ${anio}` : fecha;
}

export function formatearMesCorto(clave) {
  const [anio, mes] = clave.split('-');
  const mesCorto = MESES_CORTOS[Number(mes) - 1];
  return mesCorto ? `${mesCorto} ${anio.slice(2)}` : clave;
}

export async function cargarDatos(region, baseUrl) {
  const cdnBase = baseUrl ? baseUrl.replace(/\/$/, '') : '/datos';
  const esProvincial = region === 'badajoz' || region === 'caceres';
  const archivo = esProvincial
    ? 'historico_provincias_extremadura_2026.json'
    : 'historico_extremadura_2026.json';

  const res = await fetch(`${cdnBase}/${archivo}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} al solicitar ${archivo}`);
  const data = await res.json();

  return data.map(d => {
    const item = esProvincial ? d[region] : d;
    return {
      fecha: d.fecha,
      gasolina: typeof item?.gasolina95_E5 === 'number' ? item.gasolina95_E5 : null,
      gasoleo: typeof item?.gasoleoA === 'number' ? item.gasoleoA : null
    };
  });
}

export function agruparMensual(registros) {
  const meses = {};

  for (const r of registros) {
    if (!r.fecha) continue;
    const partes = r.fecha.split(/[-/]/);
    const clave = partes[0].length === 4 ? `${partes[0]}-${partes[1]}` : `${partes[2]}-${partes[1]}`;

    if (!meses[clave]) meses[clave] = { gSum: 0, gN: 0, goSum: 0, goN: 0 };

    if (typeof r.gasolina === 'number') {
      meses[clave].gSum += r.gasolina;
      meses[clave].gN++;
    }
    if (typeof r.gasoleo === 'number') {
      meses[clave].goSum += r.gasoleo;
      meses[clave].goN++;
    }
  }

  return Object.keys(meses).sort().map(clave => {
    const [anio, mes] = clave.split('-');
    const m = meses[clave];
    return {
      clave,
      anio,
      nombre: MESES_LARGOS[Number(mes) - 1] || clave,
      mediaGasolina: m.gN ? m.gSum / m.gN : null,
      mediaGasoleo: m.goN ? m.goSum / m.goN : null
    };
  });
}

export function renderizarTarjetaEditorial(containerId, titulo, notaFuente) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  container.innerHTML = `
    <div class="wc-card">
      <h4 class="wc-titulo">${titulo}</h4>
      <div class="wc-grafico-contenedor">
        <canvas id="${containerId}-chart"></canvas>
      </div>
      <p class="wc-fuente">${notaFuente}</p>
    </div>
  `;

  const canvas = document.getElementById(`${containerId}-chart`);
  return canvas ? canvas.getContext('2d') : null;
}

export function crearGraficoEditorial(ctx, { etiquetas, series }) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: etiquetas.map(fecha => formatearFecha(fecha)),
      datasets: series.map(s => ({
        label: s.label,
        data: s.data,
        borderColor: s.color || INKS[s.ink].linea,
        backgroundColor: s.relleno || INKS[s.ink].relleno,
        borderWidth: s.borderWidth || 2.5,
        borderDash: s.borderDash || [],
        borderCapStyle: s.borderCapStyle || 'butt',
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.3,
        fill: s.fill !== false
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          align: 'start',
          labels: {
            boxWidth: 36,
            boxHeight: 10,
            borderRadius: 3,
            padding: 16,
            font: { family: FUENTE_SISTEMA, size: 12, weight: 500 },
            color: '#475569'
          }
        },
        tooltip: {
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          titleColor: '#0f172a',
          titleFont: { family: FUENTE_SISTEMA, size: 12, weight: 700 },
          bodyColor: '#475569',
          bodyFont: { family: FUENTE_SISTEMA, size: 12 },
          usePointStyle: true,
          boxPadding: 4,
          callbacks: {
            title: items => (items.length ? formatearFecha(items[0].label) : ''),
            label: item => ` ${item.dataset.label}: ${formatearPrecio(item.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: '#64748b',
            font: { family: FUENTE_SISTEMA, size: 11 },
            maxTicksLimit: 8
          }
        },
        y: {
          grid: { color: '#f1f5f9' },
          border: { display: false },
          ticks: {
            color: '#64748b',
            font: { family: FUENTE_SISTEMA, size: 11 },
            callback: valor => formatearEjePrecio(valor)
          }
        }
      }
    }
  });
}

export function crearGraficoBarras(ctx, { etiquetas, series }) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: series.map(s => ({
        label: s.label,
        data: s.data,
        backgroundColor: INKS[s.ink].linea,
        hoverBackgroundColor: INKS[s.ink].linea,
        borderRadius: 3,
        borderSkipped: false,
        maxBarThickness: 18
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          align: 'start',
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            borderRadius: 3,
            padding: 16,
            font: { family: FUENTE_SISTEMA, size: 12, weight: 500 },
            color: '#475569'
          }
        },
        tooltip: {
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          titleColor: '#0f172a',
          titleFont: { family: FUENTE_SISTEMA, size: 12, weight: 700 },
          bodyColor: '#475569',
          bodyFont: { family: FUENTE_SISTEMA, size: 12 },
          usePointStyle: true,
          boxPadding: 4,
          callbacks: {
            label: item => ` ${item.dataset.label}: ${formatearPrecio(item.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: '#64748b',
            font: { family: FUENTE_SISTEMA, size: 11 }
          }
        },
        y: {
          grid: { color: '#f1f5f9' },
          border: { display: false },
          ticks: {
            color: '#64748b',
            font: { family: FUENTE_SISTEMA, size: 11 },
            callback: valor => formatearEjePrecio(valor)
          }
        }
      }
    }
  });
}

export function crearGraficoDiferencial(ctx, { etiquetas, data }) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: etiquetas.map(fecha => formatearFecha(fecha)),
      datasets: [{
        label: 'Diferencial (gasóleo − gasolina)',
        data,
        borderColor: '#475569',
        backgroundColor: 'rgba(71, 85, 105, 0.1)',
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.3,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          align: 'start',
          labels: {
            boxWidth: 36,
            boxHeight: 10,
            borderRadius: 3,
            padding: 16,
            font: { family: FUENTE_SISTEMA, size: 12, weight: 500 },
            color: '#475569'
          }
        },
        tooltip: {
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          titleColor: '#0f172a',
          titleFont: { family: FUENTE_SISTEMA, size: 12, weight: 700 },
          bodyColor: '#475569',
          bodyFont: { family: FUENTE_SISTEMA, size: 12 },
          usePointStyle: true,
          boxPadding: 4,
          callbacks: {
            title: items => (items.length ? formatearFecha(items[0].label) : ''),
            label: item => ` ${item.dataset.label}: ${formatearPrecio(item.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: '#64748b',
            font: { family: FUENTE_SISTEMA, size: 11 },
            maxTicksLimit: 8
          }
        },
        y: {
          grid: { color: '#f1f5f9' },
          border: { display: false },
          ticks: {
            color: '#64748b',
            font: { family: FUENTE_SISTEMA, size: 11 },
            callback: valor => formatearEjePrecio(valor)
          }
        }
      }
    }
  });
}
