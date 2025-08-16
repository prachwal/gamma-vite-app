# 🚀 Build Manager - Zaawansowany System Zarządzania Budową

## 📋 Przegląd

Zaawansowany skrypt Bash do zarządzania procesem budowy projektu Gamma Vite App. Automatyzuje wszystkie aspekty budowy z profesjonalnym logowaniem, obsługą błędów i raportowaniem.

## ✨ Funkcjonalności

### 🔧 Zarządzanie Budową
- **Czyszczenie środowiska** - Automatyczne usuwanie folderów buildów
- **Kontrola zależności** - Sprawdzanie i instalacja pakietów
- **Budowa wieloetapowa** - Kod główny, Storybook, dokumentacja
- **Obsługa błędów** - Inteligentne reagowanie na problemy

### 📊 Logowanie i Raportowanie  
- **Szczegółowe logi** - Wszystkie operacje zapisywane z timestampami
- **Podział logów** - Osobne pliki dla sukcesu i błędów
- **Kolorowe output** - Łatwa identyfikacja statusów
- **Podsumowania** - Czasy wykonania, rozmiary plików

### 🧪 Testy i Jakość
- **Testy jednostkowe** - Automatyczne uruchomienie z Vitest
- **Coverage raporty** - Analiza pokrycia kodu testami  
- **Linting** - Sprawdzanie jakości kodu z ESLint
- **TypeScript check** - Walidacja typów

## 🚀 Użycie

### Bezpośrednie uruchomienie skryptu:
```bash
# Pełna budowa (domyślne)
./build-manager.sh

# Budowa bez czyszczenia
./build-manager.sh no-clean

# Tylko czyszczenie
./build-manager.sh clean

# Tylko testy
./build-manager.sh test

# Tylko budowa główna
./build-manager.sh build

# Tylko Storybook
./build-manager.sh storybook

# Tylko dokumentacja
./build-manager.sh docs

# Pomoc
./build-manager.sh help
```

### Przez skrypty npm:
```bash
# Pełna budowa
npm run build:all

# Szybka budowa bez czyszczenia
npm run build:no-clean  

# Tylko czyszczenie środowiska
npm run build:clean

# Tylko testy z coverage
npm run build:test

# Tylko aplikacja główna
npm run build:main

# Tylko dokumentacja TypeDoc
npm run build:docs

# Wyświetl pomoc
npm run build:help
```

## 📁 Struktura Wyjściowa

Po wykonaniu budowy powstają następujące foldery:

```
├── dist/              # Aplikacja główna (Vite build)
├── storybook-static/  # Storybook build  
├── docs/              # Dokumentacja TypeDoc
├── coverage/          # Raporty pokrycia testów
└── logs/              # Logi procesów budowy
    ├── build_YYYYMMDD_HHMMSS.log
    └── errors_YYYYMMDD_HHMMSS.log
```

## 📝 System Logowania

### Poziomy logów:
- **INFO** 🔵 - Informacje ogólne
- **WARN** 🟡 - Ostrzeżenia (nie przerywają budowy)  
- **ERROR** 🔴 - Błędy krytyczne
- **SUCCESS** 🟢 - Operacje udane
- **STEP** 🟣 - Kroki procesu budowy

### Lokalizacja logów:
- **Build log**: `logs/build_TIMESTAMP.log` - Wszystkie operacje
- **Error log**: `logs/errors_TIMESTAMP.log` - Tylko błędy

## ⚙️ Konfiguracja

### Zmienne środowiskowe (opcjonalne):
```bash
# Ścieżki można dostosować w sekcji KONFIGURACJA skryptu
LOGS_DIR="./logs"           # Folder logów
BUILD_DIR="./dist"          # Folder budowy
STORYBOOK_DIR="./storybook-static"  # Storybook output
DOCS_DIR="./docs"           # Dokumentacja
```

### Wymagania systemowe:
- **Node.js** 18+ 
- **npm** 8+
- **Bash** 4.0+
- **System Unix/Linux** (lub WSL na Windows)

## 🔍 Diagnostyka

### Sprawdzanie statusu:
```bash
# Sprawdź czy skrypt jest wykonywalny
ls -la build-manager.sh

# Testuj z verbose output
./build-manager.sh test 2>&1 | tee debug.log

# Sprawdź ostatnie logi
tail -f logs/build_$(ls -t logs/ | head -1)
```

### Typowe problemy:

**Problem**: Brak uprawnień
```bash
chmod +x build-manager.sh
```

**Problem**: Node.js nie znaleziony  
```bash
node --version  # Sprawdź instalację
```

**Problem**: Błędy TypeScript
```bash
npm run build:test  # Uruchom tylko testy
```

## 📊 Metryki i Statystyki

Skrypt automatycznie zbiera:
- ⏱️ Czasy wykonania każdego etapu
- 📁 Rozmiary wygenerowanych folderów
- 📈 Pokrycie testów (%) 
- 📄 Liczba wygenerowanych plików
- 🚨 Historia błędów z kodami wyjścia

## 🔧 Rozszerzanie

### Dodawanie nowych kroków:
1. Utwórz funkcję w stylu `build_custom()`
2. Dodaj wywołanie w funkcji `main()`
3. Dodaj opcję w `case` statement
4. Aktualizuj `show_help()`

### Przykład nowego kroku:
```bash
# Dodanie kroku deploy
build_deploy() {
    print_banner "🚀 DEPLOY"
    execute_command "Upload do serwera" "rsync -av dist/ server:/var/www/"
}
```

## 📝 Changelog

### v1.0.0 (2025-08-16)
- ✨ Pierwsza wersja skryptu
- 🔧 Pełna automatyzacja budowy
- 📊 System logowania i raportowania
- 🧪 Integracja z testami i coverage
- 📚 Budowa Storybook i dokumentacji
- 🗂️ Automatyczna aktualizacja .gitignore

## 🤝 Rozwój

Sugestie ulepszeń:
- 🐳 Integracja z Docker
- ☁️ Deploy na serwery chmurowe  
- 📱 Notyfikacje (email, Slack)
- 🔄 CI/CD integration
- 📦 Pakowanie artyfaktów

## 📄 Licencja

Część projektu Gamma Vite App - używaj zgodnie z licencją projektu.
