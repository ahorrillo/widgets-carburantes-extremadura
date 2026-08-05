import { renderWidgetExtremadura } from './widgets/widget_extremadura.js';
import { renderWidgetBadajoz } from './widgets/widget_badajoz.js';
import { renderWidgetCaceres } from './widgets/widget_caceres.js';
import { renderWidgetTabla } from './widgets/widget_tabla.js';
import { renderWidgetSituacion } from './widgets/widget_situacion.js';
import { renderWidgetComparativa } from './widgets/widget_comparativa.js';
import { renderWidgetBarras } from './widgets/widget_barras.js';
import { renderWidgetRecords } from './widgets/widget_records.js';
import { renderWidgetDiferencial } from './widgets/widget_diferencial.js';
import widgetStyles from './styles/widget.css?inline';

export function renderizarPorElemento(el) {
  const containerId = el.id;
  if (!containerId) return;

  const componente = (el.dataset.componente || 'grafico').toLowerCase();
  const region = (el.dataset.region || 'extremadura').toLowerCase();
  const producto = (el.dataset.producto || 'gasolina').toLowerCase();

  // Extrae la URL base del CDN del atributo del contenedor
  const baseUrl = el.dataset.dataUrl || '/datos';

  switch (componente) {
    case 'tabla':
      renderWidgetTabla(containerId, region, baseUrl);
      break;
    case 'situacion':
      renderWidgetSituacion(containerId, region, baseUrl);
      break;
    case 'comparativa':
      renderWidgetComparativa(containerId, region, baseUrl, producto);
      break;
    case 'barras':
      renderWidgetBarras(containerId, region, baseUrl);
      break;
    case 'records':
      renderWidgetRecords(containerId, region, baseUrl, producto);
      break;
    case 'diferencial':
      renderWidgetDiferencial(containerId, region, baseUrl);
      break;
    case 'grafico':
    default:
      switch (region) {
        case 'badajoz':
          renderWidgetBadajoz(containerId, baseUrl);
          break;
        case 'caceres':
          renderWidgetCaceres(containerId, baseUrl);
          break;
        case 'extremadura':
        default:
          renderWidgetExtremadura(containerId, baseUrl);
          break;
      }
      break;
  }
}

function inyectarEstilos() {
  if (document.getElementById('wc-estilos')) return;
  const style = document.createElement('style');
  style.id = 'wc-estilos';
  style.textContent = widgetStyles;
  document.head.appendChild(style);
}

function autoInicializar() {
  inyectarEstilos();
  const selector = '[data-componente], [data-region], [data-data-url]';
  document.querySelectorAll(selector).forEach(el => renderizarPorElemento(el));
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInicializar);
  } else {
    autoInicializar();
  }
}
