# 📚 Portfolio — Technical Documentation

A modern, responsive portfolio application built with **Vue 3** and **Vite**, demonstrating professional software development practices.

---

## 🏗️ Architecture & Structure

This project follows **Atomic Design** principles combined with **Feature-First** organization for maximum modularity and reusability.

```
src/
├── components/              # Reusable UI components
│   ├── atoms/              # Basic building blocks (Button, Card, etc.)
│   ├── molecules/          # Small component groups (NavBar, ThemeToggle, etc.)
│   └── organisms/          # Complex sections (HeroSection, SkillsSection, etc.)
├── views/                  # Page-level components
│   ├── HomeView.vue        # Landing page
│   ├── AboutView.vue       # About & experience
│   ├── ProjectsView.vue    # Projects showcase
│   ├── ContactView.vue     # Contact section
│   └── NotFoundView.vue    # 404 fallback
├── router/                 # Vue Router configuration
│   └── index.js           # Route definitions with 404 catchall
├── stores/                 # Pinia state management
│   ├── useLang.js         # Language/i18n state
│   ├── useTheme.js        # Dark/light theme state
│   └── useOnboarding.js   # Onboarding tour state
├── i18n/                   # Internationalization
│   └── locales/           # Translation files (EN, ES, FR, IT, DE)
├── tokens/                 # Design tokens
│   └── themes.js          # Theme definitions
└── main.js                # Application entry point
```

---

## 🎯 Design Decisions

### 1. **Component Architecture**
- **Atomic Design**: Components are organized from simple (`atoms`) to complex (`organisms`)
- **Feature-First**: Components are encapsulated within their feature modules
- **Reusability**: Base components (`BaseButton`) are props-driven for flexibility

### 2. **State Management**
- **Pinia Stores**: Reactive state for language, theme, and onboarding
- **Minimal Coupling**: Each store is independent and can be used in isolation
- **Composition API**: Leverages Vue 3's modern reactivity system

### 3. **Internationalization (i18n)**
- **Multi-language Support**: English, Spanish, French, Italian, German
- **JSON-based Translations**: Easy to maintain and extend
- **Language Switching**: Dynamic with Pinia store integration

### 4. **Routing**
- **SPA Navigation**: Client-side routing with Vue Router
- **404 Fallback**: Catch-all route `/:pathMatch(.*)*` handles undefined routes gracefully
- **Named Routes**: Semantic navigation using route names

### 5. **Styling**
- **CSS Modules**: Scoped styles to prevent conflicts
- **Design Tokens**: Centralized theme colors and spacing via `tokens/themes.js`
- **Responsive Design**: Mobile-first approach with flexible layouts

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev
```

Server runs at: `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Linting

```bash
# Run ESLint to check code quality
npm run lint
```

---

## 📦 Key Dependencies

- **Vue 3**: Progressive JavaScript framework
- **Vite**: Lightning-fast build tool and dev server
- **Vue Router**: Client-side routing
- **Pinia**: State management library
- **ESLint**: Code quality and consistency

---

## 🔧 Configuration Files

- `vite.config.js` — Build and dev server configuration
- `eslint.config.js` — Code linting rules
- `jsconfig.json` — JavaScript path aliases and settings
- `package.json` — Dependencies and npm scripts

---

## 🌐 Deployment

This portfolio is optimized for static hosting platforms:

- **Netlify**, **Vercel**, **GitHub Pages**, or **Azure Static Web Apps**
- Build output: `dist/` directory
- Uses client-side routing (SPA) with history mode

---

## 📝 License

This project is licensed under the **MIT License**. You're welcome to fork, modify, and use this as a foundation for your own portfolio. See the root [LICENSE](../LICENSE) file for details.

---

## 💡 Design Principles Applied

- **SOLID Principles**: Components follow single responsibility and open/closed principles
- **DRY (Don't Repeat Yourself)**: Reusable components eliminate code duplication
- **Clean Code**: Readable, maintainable, and well-organized codebase
- **Performance**: Lazy loading, code splitting, and optimized builds
