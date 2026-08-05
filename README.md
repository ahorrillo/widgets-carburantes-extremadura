# Widgets Carburantes Extremadura

[![GitHub tag](https://img.shields.io/github/v/tag/ahorrillo/widgets-carburantes-extremadura?style=for-the-badge&label=Tag&color=2b6cb0)](https://github.com/ahorrillo/widgets-carburantes-extremadura/tags)
[![Versión](https://img.shields.io/badge/Versi%C3%B3n-v1.0.0-2b6cb0?style=for-the-badge)](#)
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
* **Integración sin código extra:** Autodetección e inicialización mediante atributos HTML `data-componente` y `data-region`.
* **Múltiples componentes:** Soporte para gráficos de líneas interactivos y tablas dinámicas con los últimos registros.

---

## 📁 Estructura del Proyecto

```text
widgets-carburantes-extremadura/
├── public/
│   └── datos/
│       ├── historico_extremadura_2026.json
│       └── historico_provincias_extremadura_2026.json
├── src/
│   ├── widgets/
│   │   ├── widget_extremadura.js
│   │   ├── widget_badajoz.js
│   │   ├── widget_caceres.js
│   │   ├── widget_provincial.js
│   │   └── widget_tabla.js
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

Aloja los datos JSON y el script compilado `widget-carburantes.js` en tu servidor web o CDN. Luego inserta las etiquetas HTML dentro del cuerpo del artículo:

```html
<!-- 1. Contenedor del Widget -->
<div id="widget-carburantes-extremadura"
     data-componente="grafico"
     data-region="extremadura"
     data-data-url="https://cdn.jsdelivr.net/gh/ahorrillo/widgets-carburantes-extremadura@v1.0.0/public/datos/">
</div>

<!-- 2. Script del Widget -->
<script src="https://cdn.jsdelivr.net/gh/ahorrillo/widgets-carburantes-extremadura@v1.0.0/dist/widget-carburantes.js"></script>
```

> **Nota importante:** Se recomienda utilizar siempre un **Tag de Git** (ej: `@v1.0.7`) en las URLs de jsDelivr en lugar de `@main` para evitar retrasos en la actualización por caché de CDN.

### 3. Múltiples componentes en una misma página

```html
<div id="grafico-region" data-componente="grafico" data-region="extremadura"></div>
<div id="tabla-region" data-componente="tabla" data-region="extremadura" style="margin-top: 20px;"></div>

<script src="https://tu-dominio.com/js/widget-carburantes.js"></script>
```

---

## ⚙️ Atributos Data Disponibles

| Atributo | Valores permitidos | Descripción |
| :--- | :--- | :--- |
| `data-componente` | `grafico` (por defecto), `tabla` | Especifica el tipo de visualización a renderizar. |
| `data-region` | `extremadura` (por defecto), `badajoz`, `caceres` | Ámbito geográfico del que se consultarán los datos. |

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
