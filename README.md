# 🌐 Profe. Felipe | Ecosistema Digital (Hub Portal & Lanzador)

Portal centralizador y lanzador de aplicaciones web para la suite docente de **Profe. Felipe** (Educación Física, Deportes, Fisioterapia y herramientas administrativas).

## 🚀 Características
- **Identidad de Marca y Dashboard Híbrido**: Combina presencia docente con un lanzador interactivo estilo panel de control.
- **Configuración Dinámica (`data/apps.json`)**: Añade o modifica aplicaciones fácilmente editando un simple archivo JSON sin tocar el código de la interfaz.
- **Buscador en Tiempo Real y Filtros**: Búsqueda global (atajo `⌘ K` / `Ctrl K`) y categorías por dominio educativo.
- **Badges de Estado en Vivo**: Muestra estados como `🟢 Activa`, `🚀 Nueva`, o `⏳ Próximamente`.
- **Diseño Responsivo con Modo Oscuro/Claro**: Estética moderna Glassmorphism adaptable a cualquier pantalla.
- **Roadmap e Interacción**: Sección de proyectos en desarrollo y modal interactivo para recepción de ideas de los profesores.

## 📁 Estructura del Proyecto
- `index.html`: Estructura semántica principal.
- `styles.css`: Sistema de diseño con variables CSS, animaciones y soporte para modo oscuro/claro.
- `app.js`: Lógica en JavaScript ES6 para renderizado dinámico, búsqueda y gestión de estado.
- `data/apps.json`: Catálogo de aplicaciones activas y futuras.

## 🛠️ ¿Cómo agregar una nueva aplicación en el futuro?
Para registrar una nueva app web en el portal, solo abre `data/apps.json` y añade un nuevo objeto como este:

```json
{
  "id": "mi-nueva-app",
  "nombre": "Nombre de tu Aplicación",
  "categoria": "Herramientas Docentes",
  "descripcion": "Descripción corta de lo que hace tu nueva app.",
  "estado": "Activa",
  "badge_color": "green",
  "url": "../ruta-a-tu-app/index.html",
  "icono": "🎮",
  "destacado": true,
  "metricas": "Métrica clave",
  "etiquetas": ["Etiqueta1", "Etiqueta2"],
  "version": "v1.0"
}
```

## 🌐 Publicación en GitHub Pages

1. Sube el contenido de esta carpeta (`profe-felipe-hub`) a tu repositorio de GitHub.
2. En tu repositorio, ve a **Settings → Pages**.
3. En **Source**, selecciona la rama `main` (o `master`) y la carpeta raíz `/root`.
4. ¡Listo! Tu portal estará disponible públicamente en `https://tu-usuario.github.io/nombre-repo/`.
