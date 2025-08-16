# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Gamma Vite App

Nowoczesna aplikacja React z pełną funkcjonalnością i responsywnym designem.

## 🚀 Funkcjonalności

- **React 19** z TypeScript
- **React Router** - nawigacja między stronami
- **Redux Toolkit** - zarządzanie stanem globalnym
- **Ant Design** - biblioteka komponentów UI
- **i18next** - wielojęzyczność (Polski/Angielski)
- **Responsywny design** - pełne wsparcie dla mobile/tablet/desktop
- **Dark/Light theme** - przełączanie motywów
- **Ładowanie tłumaczeń przez HTTP** - z plików JSON

## 📱 Layout i UX

### Responsywność
- **Mobile** (< 768px): Sidebar ukryty, wypływa nad content z overlay
- **Tablet** (768px - 1024px): Sidebar zwinięty (tylko ikony)
- **Desktop** (> 1024px): Sidebar rozwinięty z tekstami

### Komponenty
- **Header**: Logo, hamburger menu (mobile), przełączniki języka i motywu
- **Sidebar**: Nawigacja z ikonami, automatyczne zwijanie na urządzeniach mobilnych
- **Main Content**: Obszar główny z responsywnym padding
- **Theme Provider**: Obsługa CSS custom properties dla motywów

## 🏗️ Struktura projektu

```
src/
├── components/          # Komponenty UI (.tsx) - TYLKO prezentacja
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── ThemeToggle.tsx
│   ├── LanguageSelector.tsx
│   ├── HamburgerMenu.tsx
│   └── ThemeProvider.tsx
├── layouts/             # Layout komponenty
│   └── MainLayout.tsx
├── pages/               # Strony (Home, About, Settings)
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   └── SettingsPage.tsx
├── services/            # Logika biznesowa (.ts) - API, operacje
│   └── i18n.ts
├── hooks/               # Custom hooks (.ts) - logika stanu
│   ├── redux.ts
│   └── useResponsive.ts
├── store/               # Redux store
│   ├── index.ts
│   └── appSlice.ts
├── styles/              # Style globalne
│   └── globals.css
├── types/               # TypeScript typy
│   └── index.ts
└── utils/               # Funkcje pomocnicze (.ts)
```

## 🎨 Theming

Aplikacja używa CSS custom properties dla pełnej obsługi motywów:

### Zmienne CSS
- `--color-primary`, `--color-success`, etc. - kolory główne
- `--color-bg-primary`, `--color-bg-secondary` - tła
- `--color-text-primary`, `--color-text-secondary` - teksty
- `--space-*`, `--radius-*` - spacing i border radius
- `--transition-*` - animacje

### Przełączanie motywów
- Stan motywu w Redux (`app.theme`)
- Automatyczne ustawienie `data-theme` na `html`
- Integracja z Ant Design ConfigProvider
- Zapisywanie w localStorage

## 🌍 Internacjonalizacja

### Wsparcie dla języków:
- 🇵🇱 Polski (domyślny)
- 🇺🇸 Angielski

### Pliki tłumaczeń:
- `public/locales/pl/common.json`
- `public/locales/en/common.json`

### Ładowanie przez HTTP:
- i18next-http-backend
- Automatyczne ładowanie tłumaczeń z serwera
- Fallback do języka angielskiego

## 🛠️ Uruchamianie

```bash
# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev

# Build produkcyjny
npm run build

# Preview build'a
npm run preview
```

## 📋 Skrypty

- `npm run dev` - serwer deweloperski
- `npm run build` - build produkcyjny
- `npm run lint` - linting kodu
- `npm run preview` - podgląd build'a

## 🧩 Kluczowe zależności

- `react` + `react-dom` - biblioteka React
- `react-router-dom` - routing
- `@reduxjs/toolkit` + `react-redux` - stan globalny
- `antd` + `@ant-design/icons` - komponenty UI
- `react-i18next` + `i18next-http-backend` - internacjonalizacja
- `typescript` - typy statyczne

## 📐 Breakpoints

```typescript
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
}
```

## 🎯 Najlepsze praktyki

1. **Separacja logiki i prezentacji** - komponenty zawierają tylko UI
2. **Typowanie TypeScript** - ścisłe interfejsy dla wszystkich danych
3. **Responsywność** - mobile-first approach
4. **Dostępność** - ARIA labels, focus management
5. **Performance** - lazy loading, code splitting
6. **SEO** - semantic HTML, meta tags

## 🔧 Konfiguracja

### Vite config
Standardowa konfiguracja Vite z React plugin

### TypeScript
- Strict mode enabled
- Path mapping dla czytelniejszych importów
- Separacja na app i node configs

### ESLint
- React hooks rules
- TypeScript integration
- Accessibility rules

## 📱 Testowanie responsywności

Aplikacja została przetestowana na:
- 📱 Mobile: 320px - 767px
- 📱 Tablet: 768px - 1023px  
- 💻 Desktop: 1024px+

## 🚀 Deployment

Aplikacja jest gotowa do deployment na:
- Vercel
- Netlify
- GitHub Pages
- Dowolny serwer statyczny

```bash
npm run build
# Upload dist/ folder
```

## 🧪 Testowanie

Projekt używa **Vitest** jako frameworka do testowania z integracją @testing-library/react.

### Uruchomienie testów

```bash
# Uruchom testy jednostkowe
npm run test

# Uruchom testy w trybie watch
npm run test

# Uruchom testy raz (CI mode)
npm run test:run

# Uruchom testy z interfejsem UI
npm run test:ui

# Generuj raport pokrycia kodu
npm run test:coverage
```

### Struktura testów

```
src/
├── components/
│   ├── Component.tsx
│   └── Component.test.tsx
├── hooks/
│   ├── useHook.ts
│   └── useHook.test.ts
├── pages/
│   ├── Page.tsx
│   └── Page.test.tsx
└── test/
    ├── setup.ts          # Konfiguracja testów
    └── utils.tsx         # Narzędzia pomocnicze
```

### Przykład testu

```tsx
import { render, screen, userEvent } from '../test/utils';
import { ThemeToggle } from './ThemeToggle';

test('toggles theme when clicked', async () => {
  const user = userEvent.setup();
  render(<ThemeToggle />);
  
  const button = screen.getByRole('button');
  await user.click(button);
  
  // Sprawdź czy akcja została wykonana
});
```

## 📚 Dokumentacja

Projekt używa **TypeDoc** do generowania automatycznej dokumentacji API z komentarzy TSDoc.

### Generowanie dokumentacji

```bash
# Generuj dokumentację
npm run docs

# Generuj dokumentację w trybie watch
npm run docs:watch

# Serwuj dokumentację lokalnie
npm run docs:serve
```

### Komentarze TSDoc

```typescript
/**
 * @fileoverview Opis pliku
 * @since 1.0.0
 */

/**
 * Opis funkcji lub komponentu
 * 
 * @param param - Opis parametru
 * @returns Opis zwracanej wartości
 * @example
 * ```tsx
 * // Przykład użycia
 * <Component param="value" />
 * ```
 * @since 1.0.0
 */
export function Component() {
  // implementacja
}
```

### Konwencje dokumentacji

- **@fileoverview** - Opis modułu na początku pliku
- **@since** - Wersja w której funkcja została dodana  
- **@param** - Opis parametrów funkcji
- **@returns** - Opis wartości zwracanej
- **@example** - Przykłady użycia
- **@component** - Oznaczenie komponentów React

### Przeglądanie dokumentacji

Po wygenerowaniu dokumentacja będzie dostępna w folderze `docs/`. 
Użyj `npm run docs:serve` aby otworzyć ją w przeglądarce.

## 📁 Foldery ignorowane w Git

```
# Dokumentacja
docs/

# Pokrycie testów
coverage/

# Cache Vitest
.vitest/

# Storybook
storybook-static
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
