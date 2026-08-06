# Widgets Carburantes Extremadura

[![GitHub tag](https://img.shields.io/github/v/tag/ahorrillo/widgets-carburantes-extremadura?style=for-the-badge&label=Tag&color=2b6cb0)](https://github.com/ahorrillo/widgets-carburantes-extremadura/tags)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](#)
[![Licencia Vocento](https://img.shields.io/badge/Licencia-Vocento-e53e3e?style=for-the-badge)](#)

Librería ligera y scripts de extracción automatizada para consultar y visualizar la evolución histórica de precios de carburantes (Gasolina 95 E5 y Gasóleo A) en la Comunidad Autónoma de Extremadura y sus provincias (Badajoz y Cáceres).

Diseñado para generar un único archivo JavaScript embebible de fácil integración en noticias o artículos de cualquier CMS mediante atributos HTML `data-*`.

---

## 🚀 Características

* **Extracción automatizada:** Scripts en Node.js para consultar la API REST oficial del MITECO (Ministerio para la Transición Ecológica).
* **Visualización ligera:** Desarrollado con Vanilla JS, Vite y Chart.js sin dependencias pesadas.
* **Integración sin código extra:** Autodetección e inicialización mediante atributos HTML `data-componente`, `data-region` y `data-producto`.
* **Múltiples componentes:** Gráficos de líneas interactivos, tablas de medias mensuales, situación ("el precio hoy"), comparativa provincial, medias mensuales en barras, récords del año y diferencial gasóleo − gasolina.

---

## 📁 Estructura del Proyecto

```text
widgets-carburantes-extremadura/
├── public/
│   └── datos/
│       ├── historico_extremadura_2026.json
│       └── historico_provincias_extremadura_2026.json
├── scripts/
│   ├── extractor_extremadura.mjs
│   └── extractor_caceres_badajoz.mjs
├── src/
│   ├── styles/
│   │   └── widget.css
│   ├── widgets/
│   │   ├── grafico_editorial.js
│   │   ├── widget_extremadura.js
│   │   ├── widget_badajoz.js
│   │   ├── widget_caceres.js
│   │   ├── widget_provincial.js
│   │   ├── widget_tabla.js
│   │   ├── widget_situacion.js
│   │   ├── widget_comparativa.js
│   │   ├── widget_barras.js
│   │   ├── widget_records.js
│   │   └── widget_diferencial.js
│   └── main.js
├── index.html
├── vite.config.js
└── package.json
```

---

## 🛠️ Instalación y Desarrollo

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   git clone https://github.com/ahorrillo/widgets-carburantes-extremadura.git
   cd widgets-carburantes-extremadura
   npm install
   ```

2. **Iniciar entorno de desarrollo local:**
   ```bash
   npm run dev
   ```

3. **Compilar el paquete único para producción:**
   ```bash
   npm run build
   ```
   El archivo distribuible se generará en `dist/widget-carburantes.js`.

---

## 💻 Integración en un CMS

Aloja los datos JSON y el script compilado `widget-carburantes.js` en tu servidor web o CDN. Luego inserta las etiquetas HTML dentro del cuerpo del artículo. Solo se necesita el `<script>` una vez por página; cada widget es un contenedor `data-*`:

```html
<!-- 1. Script del Widget (una sola vez por página) -->
<script src="https://cdn.jsdelivr.net/gh/ahorrillo/widgets-carburantes-extremadura@v1.0.4/dist/widget-carburantes.js"></script>

<!-- 2. Contenedores de widgets (donde quieras cada gráfico) -->

<!-- A0 · Gráfico de evolución diaria -->
<div id="grafico-extremadura"
     data-componente="grafico"
     data-region="extremadura"
     data-data-url="https://cdn.jsdelivr.net/gh/ahorrillo/widgets-carburantes-extremadura@v1.0.4/public/datos/">
</div>

<!-- A1 · Situación ("el precio hoy") -->
<div id="situacion-caceres"
     data-componente="situacion"
     data-region="caceres"
     data-data-url="https://cdn.jsdelivr.net/gh/ahorrillo/widgets-carburantes-extremadura@v1.0.4/public/datos/">
</div>

<!-- A2 · Comparativa Badajoz vs. Cáceres (gasolina o gasoleo) -->
<div id="comparativa-gasoleo"
     data-componente="comparativa"
     data-producto="gasoleo"
     data-data-url="https://cdn.jsdelivr.net/gh/ahorrillo/widgets-carburantes-extremadura@v1.0.4/public/datos/">
</div>

<!-- A3 · Medias mensuales en barras -->
<div id="barras-extremadura"
     data-componente="barras"
     data-region="extremadura"
     data-data-url="https://cdn.jsdelivr.net/gh/ahorrillo/widgets-carburantes-extremadura@v1.0.4/public/datos/">
</div>

<!-- A4 · Récords del año (gasolina o gasoleo) -->
<div id="records-extremadura"
     data-componente="records"
     data-region="extremadura"
     data-producto="gasolina"
     data-data-url="https://cdn.jsdelivr.net/gh/ahorrillo/widgets-carburantes-extremadura@v1.0.4/public/datos/">
</div>

<!-- A5 · Diferencial gasóleo − gasolina -->
<div id="diferencial-extremadura"
     data-componente="diferencial"
     data-region="extremadura"
     data-data-url="https://cdn.jsdelivr.net/gh/ahorrillo/widgets-carburantes-extremadura@v1.0.4/public/datos/">
</div>

<!-- A6 · Tabla de medias mensuales -->
<div id="tabla-extremadura"
     data-componente="tabla"
     data-region="extremadura"
     data-data-url="https://cdn.jsdelivr.net/gh/ahorrillo/widgets-carburantes-extremadura@v1.0.4/public/datos/">
</div>
```

> **Nota importante:** Se recomienda utilizar siempre un **Tag de Git** (ej: `@v1.0.4`) en las URLs de jsDelivr en lugar de `@main` para evitar retrasos en la actualización por caché de CDN. El `<script>` debe cargarse con `defer` o al final del artículo para no bloquear el renderizado.

---

## ⚙️ Atributos Data Disponibles

| Atributo | Valores permitidos | Descripción |
| :--- | :--- | :--- |
| `data-componente` | `grafico` (por defecto), `tabla`, `situacion`, `comparativa`, `barras`, `records`, `diferencial` | Tipo de visualización a renderizar. |
| `data-region` | `extremadura` (por defecto), `badajoz`, `caceres` | Ámbito geográfico del que se consultarán los datos. |
| `data-producto` | `gasolina` (por defecto), `gasoleo` | Combustible; solo lo usan `comparativa` y `records`. |
| `data-data-url` | URL | Base desde la que se cargan los JSON (CDN por defecto: `https://cdn.jsdelivr.net/gh/ahorrillo/widgets-carburantes-extremadura@v1.0.4/public/datos/`). Se elimina la barra final. |

---

## 📊 Fuente de Datos

Los datos son extraídos de la API REST oficial de la **Sede Electrónica del Ministerio para la Transición Ecológica y el Reto Demográfico (MITECO)** de España.

---

## ✒️ Autores

Creado y mantenido por:

**Antonio Horrillo Horrillo**. <ahorrillo@hoy.es> | [GitHub](https://github.com/ahorrillo)

Orgullosamente desarrollado DESDE CERO por el equipo de HOY.es

---

## 📄 Licencia y Términos de Uso

Este software ha sido desarrollado por y para el uso exclusivo de las cabeceras y servicios del grupo **Vocento**.

- **Propiedad:** © 2026 **Vocento**. Todos los derechos reservados.
- **Licencia:** Privativa (uso interno).

Queda estrictamente prohibida la reproducción, distribución, modificación o comunicación pública, total o parcial, de este código fuente a terceros ajenos al Grupo Vocento sin el consentimiento expreso y por escrito de la dirección tecnológica.
