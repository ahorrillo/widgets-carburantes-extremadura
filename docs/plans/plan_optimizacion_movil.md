# Plan de Optimización para Dispositivos Móviles

Hemos analizado el problema de visualización en pantallas móviles que se muestra en la captura de pantalla (`screenshot.jpg`). 

---

## 🔍 Análisis de los problemas detectados

1. **Gráfico colapsado/aplastado en vertical**:
   - **Causa**: Chart.js tiene activada la opción `maintainAspectRatio: true` por defecto. En anchos de pantalla reducidos (móviles), la altura del gráfico se reduce de forma proporcional al ancho (manteniendo la relación de aspecto 2:1 por defecto), lo que resulta en un gráfico muy plano donde las leyendas y las etiquetas del eje X se encabalgan.
   - **Solución**: Desactivar `maintainAspectRatio` en Chart.js y usar un contenedor CSS (`.wc-grafico-contenedor`) con una altura fija y responsive para controlar la altura de los gráficos en todas las resoluciones.

2. **Columnas de la tabla comprimidas y con saltos de línea**:
   - **Causa**: Las cabeceras de columna "Media Gasolina 95" y "Media Gasóleo A" son demasiado largas. Al visualizar la tabla en pantallas estrechas, estas cabeceras se ven forzadas a saltar de línea, comprimiendo las columnas de datos.
   - **Solución**: Simplificar las cabeceras a "Gasolina 95" y "Gasóleo A". Como el título superior ya indica "Promedio mensual de carburantes", la palabra "Media" es redundante. Además, reduciremos ligeramente el padding de las celdas en dispositivos móviles mediante `@media`.

---

## 🛠️ Propuesta de cambios

### 1. Modificación en `src/widgets/grafico_editorial.js`

- Envolver el elemento `<canvas>` dentro de un contenedor `.wc-grafico-contenedor` en `renderizarTarjetaEditorial`:
  ```javascript
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
  ```
- Desactivar `maintainAspectRatio` en las configuraciones de los tres constructores de gráficos (`crearGraficoEditorial`, `crearGraficoBarras`, `crearGraficoDiferencial`):
  ```javascript
  options: {
    responsive: true,
    maintainAspectRatio: false,
    ...
  }
  ```

### 1.5 Modificación de las etiquetas de las series de los gráficos

- En `src/widgets/widget_extremadura.js`, `src/widgets/widget_provincial.js` y `src/widgets/widget_barras.js`, se acortaron las etiquetas de la leyenda:
  - `"Gasolina 95 E5 (€/l)"` ➔ `"Gasolina 95"`
  - `"Gasóleo A (€/l)"` ➔ `"Gasóleo A"`

### 2. Modificación en `src/widgets/widget_tabla.js`

- Simplificar los textos de las cabeceras de la tabla:
  ```html
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
  ```

### 3. Modificación en `src/styles/widget.css`

- Añadir la clase `.wc-grafico-contenedor` con altura controlada.
- Reducir el padding de las celdas de tabla en pantallas móviles (dentro de `@media (max-width: 480px)`):
  ```css
  .wc-grafico-contenedor {
    position: relative;
    width: 100%;
    height: 260px;
  }
  
  @media (max-width: 480px) {
    .wc-grafico-contenedor {
      height: 200px;
    }
  
    .wc-th, .wc-td {
      padding: 8px 6px;
    }
  
    .wc-grid-2 {
      grid-template-columns: 1fr;
    }
  }
  ```

### 4. Regenerar el bundle de distribución
- Ejecutar `npm run build` para asegurar que el CDN/CMS reciba la versión actualizada de `dist/widget-carburantes.js` con el CSS inline modificado.
