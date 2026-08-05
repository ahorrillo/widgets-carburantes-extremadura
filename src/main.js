import { renderWidgetExtremadura } from './widgets/widget_extremadura.js';
import { renderWidgetBadajoz } from './widgets/widget_badajoz.js';
import { renderWidgetCaceres } from './widgets/widget_caceres.js';
import { renderWidgetTabla } from './widgets/widget_tabla.js';

export function renderizarPorElemento(el) {
  const containerId = el.id;
  if (!containerId) return;

  const componente = (el.dataset.componente || 'grafico').toLowerCase();
  const region = (el.dataset.region || 'extremadura').toLowerCase();

  // Extrae la URL base del CDN del atributo del contenedor
  const baseUrl = el.dataset.dataUrl || '/datos';

  if (componente === 'tabla') {
    renderWidgetTabla(containerId, region, baseUrl);
  } else {
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
  }
}

function autoInicializar() {
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
