# Gamma Vite App

**Zaawansowana aplikacja React 19 + TypeScript z kompletną infrastrukturą budowy**

## 🚀 Szybki Start

```bash
# Instalacja
npm ci

# Rozwój
npm run dev

# Pełna budowa z zaawansowanym zarządzaniem
npm run build:all

# Tylko testy 
npm run build:test

# Budowa bez czyszczenia
npm run build:no-clean
```

## 📊 Monitorowanie Logów

```bash
# Statystyki logów budowy
npm run logs:stats

# Lista wszystkich logów
npm run logs:list

# Ostatnie błędy
npm run logs:errors

# Ostatni log budowy
npm run logs:latest
```

## 🔧 Zaawansowane Zarządzanie Budową

### Build Manager
Kompleksowy system zarządzania budową z:
- 🧹 Automatycznym czyszczeniem
- 🧪 Uruchamianiem testów z coverage  
- 🔨 Budową kodu głównego
- 📚 Budową Storybook
- 📖 Generowaniem dokumentacji TypeDoc
- 📝 Szczegółowym logowaniem
- ⚡ Obsługą błędów

```bash
# Wszystkie opcje build manager
npm run build:help

# Tylko czyszczenie środowiska  
npm run build:clean

# Tylko budowa główna
npm run build:main

# Tylko dokumentacja
npm run build:docs
```

### Struktura Wyjściowa

Po budowie powstają foldery:
- `dist/` - Aplikacja główna
- `storybook-static/` - Storybook 
- `docs/` - Dokumentacja API
- `coverage/` - Raporty testów
- `logs/` - Logi procesów budowy

## 📚 Dokumentacja

- **[Build Manager](BUILD_MANAGER.md)** - Szczegółowa dokumentacja systemu budowy
- **[Storybook](http://localhost:6006)** - Po uruchomieniu `npm run storybook`
- **[TypeDoc](docs/index.html)** - Po wygenerowaniu `npm run docs`
- **[Coverage](coverage/index.html)** - Po uruchomieniu `npm run test:coverage`

## 🛠️ Dostępne Skrypty

### Rozwój
- `npm run dev` - Serwer deweloperski
- `npm run preview` - Podgląd budowy
- `npm run lint` - Sprawdzanie kodu

### Testy  
- `npm run test` - Testy w trybie watch
- `npm run test:ui` - UI dla testów
- `npm run test:run` - Jednorazowe uruchomienie
- `npm run test:coverage` - Z raportem pokrycia

### Budowa
- `npm run build` - Standardowa budowa
- `npm run build:all` - ⭐ Pełna budowa z zarządzaniem
- `npm run build:no-clean` - Szybka budowa bez czyszczenia
- `npm run build:clean` - Tylko czyszczenie środowiska

### Dokumentacja
- `npm run docs` - Generowanie TypeDoc
- `npm run docs:watch` - TypeDoc w trybie watch  
- `npm run docs:serve` - Podgląd dokumentacji

### Storybook
- `npm run storybook` - Serwer deweloperski  
- `npm run build-storybook` - Budowa statyczna

### Monitorowanie
- `npm run logs:stats` - Statystyki logów
- `npm run logs:list` - Lista wszystkich logów
- `npm run logs:errors` - Ostatnie błędy
- `npm run logs:latest` - Ostatni log
- `npm run logs:clean` - Czyszczenie starych logów

## 🏗️ Architektura

### Technologie Główne
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Ant Design** - UI komponenty
- **Redux Toolkit** - State management  
- **React Router** - Routing
- **i18next** - Internationalization

### Narzędzia Rozwoju
- **Vitest** - Testing framework
- **Testing Library** - Component testing
- **ESLint** - Code quality
- **TypeDoc** - API documentation
- **Storybook** - Component stories

### Zaawansowane Funkcje  
- 🎨 **Responsive design** z auto-sidebar
- 🌗 **Dark/Light mode** z CSS custom properties
- 🌍 **i18n** PL/EN z HTTP backend
- 📱 **Mobile-first** responsive layout
- ⚡ **Performance** z code splitting
- 🧪 **100% test coverage** dla komponentów
- 📖 **Auto-generated docs** z TSDoc
- 🎭 **Component stories** w Storybook

## 📁 Struktura Projektu

```
src/
├── components/     # Komponenty UI (prezentacja)
├── hooks/         # Custom hooks (logika stanu)  
├── layouts/       # Komponenty layoutu
├── pages/         # Komponenty stron
├── services/      # Logika biznesowa (API, i18n)
├── store/         # Redux state management
├── styles/        # Globalne style CSS
├── test/          # Utilities testowe
├── types/         # Definicje TypeScript
└── stories/       # Storybook stories
```

## 🔧 Konfiguracja

Kluczowe pliki konfiguracyjne:
- `vite.config.ts` - Konfiguracja Vite
- `vitest.config.ts` - Dedykowana konfiguracja testów
- `tsconfig.app.json` - TypeScript dla app
- `eslint.config.js` - ESLint rules
- `typedoc.json` - TypeDoc settings
- `.storybook/` - Konfiguracja Storybook

## 🚀 Deployment

```bash
# Pełna budowa produkcyjna
npm run build:all

# Sprawdzenie przed deployment
npm run logs:stats

# Pliki do deployment
ls -la dist/ storybook-static/ docs/
```

## 💡 Wskazówki

### Rozwój
- Używaj `npm run build:no-clean` dla szybszych testów
- Monitoruj logi przez `npm run logs:stats`
- Sprawdzaj coverage regularnie
- Dokumentuj komponenty w Storybook

### Debugowanie
- Sprawdź `npm run logs:errors` przy problemach
- Użyj `npm run logs:latest` dla szczegółów
- Analizuj coverage dla gaps w testach
- Sprawdź TypeDoc warnings dla dokumentacji

---

**Wersja:** 0.0.0 | **Node.js:** 18+ | **npm:** 8+ | **OS:** Unix/Linux/WSL
