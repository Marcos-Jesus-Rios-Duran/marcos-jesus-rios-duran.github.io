# Componentes de Proyectos

## 📁 Estructura

```
components/
├── atoms/
│   └── BaseButton.vue          # Button reutilizable (ya existía)
├── molecules/
│   ├── ProjectCard.vue         # ✨ Nueva - Tarjeta individual
│   ├── ProjectsGrid.vue        # ✨ Nueva - Grid contenedor
│   └── ProjectModal.vue        # ✨ Nueva - Modal con detalles
└── organisms/
    └── projects/
        └── ProjectsSection.vue # ✨ Nueva - Sección completa
```

## 🎯 Componentes

### 1. ProjectCard.vue (Molecule)
Tarjeta compacta que muestra resumen del proyecto. **Al hacer clic, abre el modal con todos los detalles.**

**Propiedades:**
```javascript
{
  project: Object (requerido)
}
```

**Eventos:**
```javascript
@open(project)  // Se emite cuando el usuario hace clic en la tarjeta
```

**Contenido mostrado en la tarjeta:**
- Tech tags (primeros 3 + contador si hay más)
- Nombre del proyecto
- Status badge
- Descripción truncada (120 caracteres máximo)
- Botón GitHub con ícono SVG

**Características:**
- Tarjeta **compacta y elegante** (min-height 240px)
- Tech tags en header
- GitHub icon SVG
- Click para abrir modal
- Animaciones hover smooth
- Fully responsive

---

### 2. ProjectsGrid.vue (Molecule)
Grid responsivo que organiza múltiples ProjectCards.

**Propiedades:**
```javascript
{
  projects: Object | Array (requerido)
  // Ejemplo: { Soodan: {...}, ModuloConfig: {...} }

  filter: String (default: 'all')
  // 'all', 'featured', 'opensource'
}
```

**Layout:**
- Desktop (1200px+): 3 columnas (minmax 340px)
- Tablet (768-1024px): 2 columnas (minmax 300px)
- Mobile (<768px): 1 columna full-width

**Uso:**
```vue
<ProjectsGrid :projects="allProjects" filter="all" />
```

---

### 3. ProjectsSection.vue (Organism)
Sección completa con header, filtros, grid y modal de detalles.

**Características:**
- Header con título y subtítulo (del i18n)
- Filtros dinámicos: Todos, Destacados, Open Source
- Status badge "En desarrollo"
- Grid de tarjetas compactas (ProjectCard)
- **Modal integrado para ver detalles completos del proyecto**
- Lectura automática de proyectos desde `tm('projects')`
- Empty state si no hay proyectos
- Fully responsive

**Flujo:**
1. Usuario ve tarjetas compactas de proyectos
2. Al hacer clic en una tarjeta → se abre el modal con todos los detalles
3. En el modal puede ver: highlights, patterns, confidentiality, mentorship, links directos a GitHub/website

**Lectura de i18n:**
```javascript
// Automáticamente lee: t('projects.title'), t('projects.subtitle')
// Y: tm('projects.Soodan'), tm('projects.ModuloConfiguracion'), etc.
```

**Filtros:**
- `all`: Muestra todos los proyectos
- `featured`: Proyectos en desarrollo o sin status
- `opensource`: Proyectos con "Open Source" en status

**Uso:**
```vue
<ProjectsSection />
```

---

### 4. ProjectModal.vue (Molecule)
Modal que muestra detalles completos de un proyecto (opcional).

**Propiedades:**
```javascript
{
  project: Object (requerido)
  isOpen: Boolean (default: false)
}
```

**Eventos:**
```javascript
emit('close')  // Se emite cuando el usuario cierra el modal
```

**Características:**
- Muestra toda la información del proyecto
- Patrón de diseño (Design Patterns)
- Información de mentoría
- Links a GitHub/website
- Smooth animations
- Overlay con blur
- Scrollable content
- Estilos dark mode

**Uso en Vue:**
```vue
<template>
  <div>
    <ProjectCard
      :project="selectedProject"
      @click="openModal"
    />

    <ProjectModal
      :project="selectedProject"
      :is-open="isModalOpen"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProjectCard from '@/components/molecules/ProjectCard.vue'
import ProjectModal from '@/components/molecules/ProjectModal.vue'

const selectedProject = ref(null)
const isModalOpen = ref(false)

const openModal = (project) => {
  selectedProject.value = project
  isModalOpen.value = true
}
</script>
```

---

## 🎬 Flujo de Interacción

```
Usuario entra a Proyectos
        ↓
Ve tarjetas COMPACTAS con:
├─ Tech tags (primeros 3)
├─ Título del proyecto
├─ Status badge
├─ Descripción resumida (120 chars)
└─ Botón GitHub

        ↓
Usuario hace clic en tarjeta
        ↓
Se ABRE MODAL con:
├─ Toda la descripción completa
├─ Tech stack completo
├─ Highlights/Features
├─ Design Patterns
├─ Info de mentoría
├─ Confidentiality notice (si aplica)
├─ Links directos a GitHub & website
└─ Botones para accionar

        ↓
Usuario cierra modal o navega a GitHub
```

**Ventajas de este diseño:**
✅ Grid más bonito y menos denso
✅ Tarjetas caben mejor en pantalla
✅ Detalles accesibles pero no abrumadores
✅ Fácil exploración de proyectos
✅ Links directos desde el modal (no desde tarjeta)

---

## 📝 Estructura de Datos (i18n)

### En `src/i18n/locales/es.json`:

```json
{
  "projects": {
    "title": "Proyectos",
    "subtitle": "Lo que he construido",
    "status": "En desarrollo",
    "cta_view": "Ver en GitHub",
    "cta_visit": "Visitar",
    "filter_all": "Todos",
    "filter_featured": "Destacados",
    "filter_opensource": "Open Source",
    "empty_message": "Los proyectos serán publicados próximamente.",

    // Cada proyecto como key, debe tener al menos:
    "ProjectKey": {
      "name": "Nombre del Proyecto",
      "description": "Descripción breve",

      // Opcional
      "status": "En desarrollo|Finalizado|Confidencial|Open Source|etc.",
      "technologies": ["Tech1", "Tech2"],
      "highlights": ["Feature 1", "Feature 2"] | "features": [...],
      "patterns": ["Pattern 1", "Pattern 2"],
      "confidentiality": "Detalles no divulgados...",
      "mentorship": "Colaboración con...",
      "view_mode": "Architectural Case Study",
      "github": "https://github.com/...",
      "url": "https://example.com"
    }
  }
}
```

---

## 🎨 Estilos y Temas

### Colores
- **Light Mode**: Rosa palo (#FFB3CC) y variantes
- **Dark Mode**: Cyan (#00E5FF) y variantes

### Animaciones
- **Card Hover**: `translateY(-4px)` + shadow
- **Modal**: Fade in + slide up
- **Transitions**: 0.2s - 0.3s cubic-bezier

### Dark Mode
Automáticamente detectado por `[data-theme="dark"]`

---

## ✅ Checklist de Uso

Para usar estos componentes en tu app:

1. ✅ Los archivos ya están creados en sus ubicaciones
2. ✅ Las traducciones están en es.json
3. ✅ ProjectsView.vue ya usa ProjectsSection
4. ✅ Todos los componentes están listos para usar

**Para agregar un nuevo proyecto:**
1. Abre `src/i18n/locales/es.json`
2. Agrega una nueva clave bajo `"projects"`:
   ```json
   "MiProyecto": {
     "name": "...",
     "description": "...",
     ...
   }
   ```
3. ¡Automáticamente aparecerá en el grid!

---

## 🔄 Reusabilidad

### Reutilizando dentro de ProjectCard
- `BaseButton.vue` para CTAs
- Status badge logic compartido

### Extensiones futuras
- Filtros adicionales (por tecnología, por fecha)
- Búsqueda de proyectos
- Ordenamiento (alfabético, por fecha)
- "Detalle de proyecto" en página separada

---

## 🐛 Debugging

### El grid no muestra proyectos
- Verifica que `projects` tenga la estructura correcta
- Revisa la consola del navegador

### Los filtros no funcionan
- Verifica que los proyectos tengan la propiedad `status`
- Los valores de status deben coincidir: "En desarrollo", "Open Source / En Desarrollo", etc.

### Estilos no se aplican
- Verifica que `[data-theme]` esté aplicado en el HTML root
- Revisa que no haya conflictos de CSS Global

---

## 📚 Referencias

- **Atomic Design**: atoms < molecules < organisms
- **Feature-First**: Estructura por características
- **i18n**: Multiidioma con vue-i18n
- **Dark Mode**: Implementado con CSS custom properties y `data-theme`
