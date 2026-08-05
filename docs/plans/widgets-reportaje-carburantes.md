# Widgets para el reportaje de carburantes

Plan de nuevos widgets para el reportaje editorial sobre precios de carburantes en Extremadura (HOY.es / Vocento). Cada sección del reportaje ilustra con un widget. Sistema visual: **"The Editorial Data Card"** (`DESIGN.md`). Datos: API de MITECO vía extractores.

## Estado

| Grupo | Estado | Widgets |
| :--- | :--- | :--- |
| A | ✅ Implementado | situación, comparativa, barras mensuales, récords, diferencial |
| B | 🔜 Futuro | banda min–max, top estaciones baratas, Extremadura vs. media nacional |
| C | 🔜 Futuro | mapa de estaciones, mini-calculadora |

---

## Grupo A — Implementado (usa los datos actuales, sin tocar extractores)

Todos los componentes se registran en `src/main.js` y usan los helpers de datos de `grafico_editorial.js`.

### A1 · Situación ("el precio hoy")
- **Componente:** `data-componente="situacion"` · regiones: extremadura | badajoz | caceres
- Último precio medio de gasolina y gasóleo + variación frente a la media del mes anterior (Δ €/l y %).
- Diseño: dos cajas grandes (valor en la tinta de cada combustible) con delta ▲/▼ neutro. Pie: fecha del último dato.
- Dato: calculado de los JSON actuales.

### A2 · Comparativa Badajoz vs. Cáceres
- **Componente:** `data-componente="comparativa"` · `data-producto="gasolina" | "gasoleo"` (default: gasolina)
- Un solo gráfico con las dos provincias: Badajoz en línea continua, Cáceres en línea discontinua, ambas en la tinta del combustible elegido. Respeta la Two-Ink Rule (la provincia se codifica con el patrón de línea, no con color).

### A3 · Medias mensuales (barras)
- **Componente:** `data-componente="barras"` · regiones: extremadura | badajoz | caceres
- Gráfico de barras agrupadas con las medias mensuales de gasolina y gasóleo (misma lógica de agrupación que la tabla). Alternativa visual a la línea diaria para marcar el ritmo del año.

### A4 · Récords del año
- **Componente:** `data-componente="records"` · regiones: extremadura | badajoz | caceres
- Mes más caro, mes más barato y mayor subida mensual, calculados sobre las medias mensuales de gasolina. Pie aclara que es sobre Gasolina 95 E5.

### A5 · Diferencial gasóleo − gasolina
- **Componente:** `data-componente="diferencial"` · regiones: extremadura | badajoz | caceres
- Evolución diaria de la diferencia entre ambos combustibles. Serie derivada, se dibuja en tinta neutra (Body Ink) para no introducir una tercera tinta cromática.

---

## Grupo B — Futuro (exige ampliar los extractores y regenerar JSON)

Encajaría en la **noticia diaria de precios** de la sección de economía.

### B1 · Banda de precios (min–max diario)
- Hoy el extractor solo guarda la media por día. La API devuelve todas las estaciones, así que puede calcular y guardar también el **precio mínimo y máximo diario**.
- Widget: gráfico de banda (área entre min y max) con la media encima. Visualmente potente: "desde 1,35 hasta 1,80 €/l según la estación".

### B2 · Las gasolineras más baratas de Extremadura
- Requiere guardar datos **a nivel de estación** (nombre, localidad, precio) en la extracción.
- Widget: lista top (p. ej. las 10 más baratas por producto) con nombre y localidad. Contenido muy viral en la noticia diaria.

### B3 · Extremadura vs. media nacional
- Requiere otro endpoint de MITECO (precios medios nacionales o por CCAA).
- Widget: comparativa de Extremadura frente a la media de España (u otras CCAA).

---

## Grupo C — Futuro

### C1 · Mapa de estaciones
- Requiere coordenadas de la API + una librería de mapas (Leaflet). Sería la pieza firma del reportaje, pero añade dependencia y peso. Combina bien con B2 (marcar las más baratas en el mapa).

### C2 · Mini-calculadora depósito / trayecto
- Interactiva: precio × capacidad del depósito o consumo × distancia. Se podría usar en **otro reportaje**; en el de precios se prefiere un ejemplo estático para no romper el ritmo de lectura.
