#!/bin/bash

# =============================================================================
# 🚀 Gamma Vite App - Advanced Build Manager
# =============================================================================
# Autor: AI Assistant
# Data utworzenia: $(date +"%Y-%m-%d")
# Wersja: 1.0.0
# Opis: Zaawansowany skrypt zarządzający budową kodu z obsługą błędów i logowaniem
# =============================================================================

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# =============================================================================
# 📋 KONFIGURACJA
# =============================================================================

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_DIR="$SCRIPT_DIR"
readonly LOGS_DIR="$PROJECT_DIR/logs"
readonly BUILD_DIR="$PROJECT_DIR/dist"
readonly STORYBOOK_DIR="$PROJECT_DIR/storybook-static"
readonly DOCS_DIR="$PROJECT_DIR/docs"
readonly COVERAGE_DIR="$PROJECT_DIR/coverage"

# Kolory dla output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly WHITE='\033[1;37m'
readonly NC='\033[0m' # No Color

# Znaczniki czasowe
readonly TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
readonly BUILD_LOG="$LOGS_DIR/build_${TIMESTAMP}.log"
readonly ERROR_LOG="$LOGS_DIR/errors_${TIMESTAMP}.log"

# =============================================================================
# 🛠️  FUNKCJE POMOCNICZE
# =============================================================================

# Funkcja logowania
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Upewnienie się że folder logs istnieje
    [ ! -d "$LOGS_DIR" ] && mkdir -p "$LOGS_DIR" 2>/dev/null || true
    
    case "$level" in
        "INFO")  echo -e "${BLUE}[INFO]${NC} ${timestamp}: $message" | tee -a "$BUILD_LOG" 2>/dev/null || echo -e "${BLUE}[INFO]${NC} ${timestamp}: $message" ;;
        "WARN")  echo -e "${YELLOW}[WARN]${NC} ${timestamp}: $message" | tee -a "$BUILD_LOG" 2>/dev/null || echo -e "${YELLOW}[WARN]${NC} ${timestamp}: $message" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} ${timestamp}: $message" | tee -a "$BUILD_LOG" "$ERROR_LOG" 2>/dev/null || echo -e "${RED}[ERROR]${NC} ${timestamp}: $message" ;;
        "SUCCESS") echo -e "${GREEN}[SUCCESS]${NC} ${timestamp}: $message" | tee -a "$BUILD_LOG" 2>/dev/null || echo -e "${GREEN}[SUCCESS]${NC} ${timestamp}: $message" ;;
        "STEP") echo -e "${PURPLE}[STEP]${NC} ${timestamp}: $message" | tee -a "$BUILD_LOG" 2>/dev/null || echo -e "${PURPLE}[STEP]${NC} ${timestamp}: $message" ;;
        *) echo -e "${WHITE}[LOG]${NC} ${timestamp}: $message" | tee -a "$BUILD_LOG" 2>/dev/null || echo -e "${WHITE}[LOG]${NC} ${timestamp}: $message" ;;
    esac
}

# Banner funkcja
print_banner() {
    local title="$1"
    echo -e "\n${CYAN}$(printf '=%.0s' {1..80})${NC}"
    echo -e "${CYAN}🚀 $title${NC}"
    echo -e "${CYAN}$(printf '=%.0s' {1..80})${NC}\n"
}

# Sprawdzenie czy komenda istnieje
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Wykonanie komendy z obsługą błędów
execute_command() {
    local description="$1"
    local command="$2"
    local optional="${3:-false}"
    
    log "STEP" "Rozpoczynam: $description"
    log "INFO" "Wykonuję: $command"
    
    if eval "$command" >> "$BUILD_LOG" 2>&1; then
        log "SUCCESS" "✅ $description - SUKCES"
        return 0
    else
        local exit_code=$?
        if [ "$optional" = "true" ]; then
            log "WARN" "⚠️ $description - BŁĄD (opcjonalne, kontynuuję)"
            return 0
        else
            log "ERROR" "❌ $description - BŁĄD (kod: $exit_code)"
            return $exit_code
        fi
    fi
}

# Sprawdzenie rozmiaru foldera
check_folder_size() {
    local folder="$1"
    if [ -d "$folder" ]; then
        local size=$(du -sh "$folder" 2>/dev/null | cut -f1 2>/dev/null || echo "N/A")
        log "INFO" "📁 Rozmiar $folder: $size"
    fi
}

# Czyszczenie folderów
clean_folders() {
    print_banner "🧹 CZYSZCZENIE FOLDERÓW"
    
    local folders_to_clean=("$BUILD_DIR" "$STORYBOOK_DIR" "$DOCS_DIR" "$COVERAGE_DIR" ".vitest")
    
    for folder in "${folders_to_clean[@]}"; do
        if [ -d "$folder" ]; then
            check_folder_size "$folder"
            execute_command "Usuwanie $folder" "rm -rf '$folder'" true
        else
            log "INFO" "📂 Folder $folder nie istnieje - pomijam"
        fi
    done
    
    # Czyszczenie cache
    execute_command "Czyszczenie cache npm" "npm cache clean --force" true
    execute_command "Czyszczenie node_modules/.cache" "rm -rf node_modules/.cache" true
}

# Przygotowanie środowiska
prepare_environment() {
    print_banner "🔧 PRZYGOTOWANIE ŚRODOWISKA"
    
    # Utworzenie foldera logs
    execute_command "Tworzenie folderu logs" "mkdir -p '$LOGS_DIR'"
    
    # Sprawdzenie Node.js i npm
    if command_exists node; then
        local node_version=$(node --version)
        log "INFO" "Node.js: $node_version"
    else
        log "ERROR" "Node.js nie jest zainstalowany!"
        exit 1
    fi
    
    if command_exists npm; then
        local npm_version=$(npm --version)
        log "INFO" "npm: $npm_version"
    else
        log "ERROR" "npm nie jest zainstalowany!"
        exit 1
    fi
    
    # Sprawdzenie package.json
    if [ ! -f "package.json" ]; then
        log "ERROR" "Brak pliku package.json!"
        exit 1
    fi
    
    # Instalacja/aktualizacja zależności
    execute_command "Instalacja zależności" "npm ci"
}

# Uruchomienie testów
run_tests() {
    print_banner "🧪 TESTY"
    
    # Testy jednostkowe
    execute_command "Uruchomienie testów jednostkowych" "npm run test:run"
    
    # Testy z coverage (w trybie run, nie watch)
    execute_command "Generowanie pokrycia testów" "npx vitest --coverage --run --config vitest.config.ts"
    
    if [ -d "$COVERAGE_DIR" ]; then
        check_folder_size "$COVERAGE_DIR"
        
        # Próba odczytania pokrycia z pliku
        local coverage_file="$COVERAGE_DIR/coverage-summary.json"
        if [ -f "$coverage_file" ]; then
            local coverage=$(grep -o '"total":{[^}]*"pct":[0-9.]*' "$coverage_file" | grep -o '[0-9.]*$' | head -1 2>/dev/null || echo "N/A")
            log "INFO" "📊 Pokrycie testów: ${coverage}%"
        fi
    fi
    
    # Linting
    execute_command "Sprawdzanie jakości kodu (ESLint)" "npm run lint" false
}

# Budowa głównego kodu
build_main() {
    print_banner "🔨 BUDOWA GŁÓWNEGO KODU"
    
    # TypeScript compilation check
    execute_command "Sprawdzanie typów TypeScript" "npx tsc --noEmit"
    
    # Główna budowa
    execute_command "Budowa aplikacji Vite" "npm run build"
    
    if [ -d "$BUILD_DIR" ]; then
        check_folder_size "$BUILD_DIR"
        
        # Sprawdzenie plików wyjściowych
        local js_files=$(find "$BUILD_DIR" -name "*.js" | wc -l 2>/dev/null || echo "0")
        local css_files=$(find "$BUILD_DIR" -name "*.css" | wc -l 2>/dev/null || echo "0")
        local html_files=$(find "$BUILD_DIR" -name "*.html" | wc -l 2>/dev/null || echo "0")
        
        log "INFO" "📄 Pliki wyjściowe - JS: $js_files, CSS: $css_files, HTML: $html_files"
    fi
}

# Budowa Storybook
build_storybook() {
    print_banner "📚 BUDOWA STORYBOOK"
    
    execute_command "Budowa Storybook" "npm run build-storybook"
    
    if [ -d "$STORYBOOK_DIR" ]; then
        check_folder_size "$STORYBOOK_DIR"
        
        # Sprawdzenie czy index.html istnieje
        if [ -f "$STORYBOOK_DIR/index.html" ]; then
            log "SUCCESS" "🎯 Storybook zbudowany pomyślnie"
        else
            log "WARN" "⚠️ Brak pliku index.html w Storybook"
        fi
    fi
}

# Budowa dokumentacji
build_docs() {
    print_banner "📖 BUDOWA DOKUMENTACJI TSDOC"
    
    execute_command "Generowanie dokumentacji TypeDoc" "npm run docs"
    
    if [ -d "$DOCS_DIR" ]; then
        check_folder_size "$DOCS_DIR"
        
        # Sprawdzenie czy dokumentacja została wygenerowana
        local html_files=$(find "$DOCS_DIR" -name "*.html" | wc -l 2>/dev/null || echo "0")
        log "INFO" "📄 Pliki dokumentacji HTML: $html_files"
        
        if [ -f "$DOCS_DIR/index.html" ]; then
            log "SUCCESS" "🎯 Dokumentacja wygenerowana pomyślnie"
        else
            log "WARN" "⚠️ Brak głównego pliku dokumentacji"
        fi
    fi
}

# Aktualizacja .gitignore
update_gitignore() {
    print_banner "📝 AKTUALIZACJA .GITIGNORE"
    
    local gitignore_file=".gitignore"
    local backup_file=".gitignore.backup.$(date +%s)"
    
    # Backup oryginalnego pliku
    if [ -f "$gitignore_file" ]; then
        execute_command "Tworzenie kopii zapasowej .gitignore" "cp '$gitignore_file' '$backup_file'"
    fi
    
    # Dodanie nowych wpisów do .gitignore
    local new_entries=(
        "# Build management logs"
        "logs/"
        "*.log"
        ""
        "# Temporary files"
        ".tmp/"
        "tmp/"
        ""
        "# Backup files"
        "*.backup.*"
        ""
        "# OS generated files"
        ".DS_Store"
        ".DS_Store?"
        "._*"
        ".Spotlight-V100"
        ".Trashes"
        "ehthumbs.db"
        "Thumbs.db"
        ""
        "# IDE files"
        ".vscode/*"
        "!.vscode/settings.json"
        "!.vscode/tasks.json"
        "!.vscode/launch.json"
        "!.vscode/extensions.json"
        "*.swp"
        "*.swo"
        "*~"
    )
    
    # Sprawdzenie czy wpisy już istnieją
    for entry in "${new_entries[@]}"; do
        if [ -n "$entry" ] && ! grep -Fxq "$entry" "$gitignore_file" 2>/dev/null; then
            echo "$entry" >> "$gitignore_file"
        fi
    done
    
    log "SUCCESS" "✅ .gitignore zaktualizowany"
}

# Podsumowanie budowy
build_summary() {
    print_banner "📊 PODSUMOWANIE BUDOWY"
    
    local end_time=$(date)
    local duration=$(($(date +%s) - $(date -d "$start_time" +%s 2>/dev/null || echo $(date +%s))))
    
    log "INFO" "⏱️  Czas rozpoczęcia: $start_time"
    log "INFO" "⏱️  Czas zakończenia: $end_time"
    log "INFO" "⏱️  Całkowity czas budowy: ${duration}s"
    
    echo -e "\n${GREEN}📁 ROZMIARY FOLDERÓW WYJŚCIOWYCH:${NC}"
    check_folder_size "$BUILD_DIR"
    check_folder_size "$STORYBOOK_DIR" 
    check_folder_size "$DOCS_DIR"
    check_folder_size "$COVERAGE_DIR"
    check_folder_size "$LOGS_DIR"
    
    echo -e "\n${BLUE}📋 PLIKI LOGÓW:${NC}"
    log "INFO" "📝 Build log: $BUILD_LOG"
    if [ -f "$ERROR_LOG" ] && [ -s "$ERROR_LOG" ]; then
        log "WARN" "🚨 Error log: $ERROR_LOG"
    else
        log "SUCCESS" "✅ Brak błędów w logach"
    fi
    
    # URL do podglądu (jeśli są zbudowane)
    echo -e "\n${CYAN}🌐 PODGLĄD REZULTATÓW:${NC}"
    [ -d "$BUILD_DIR" ] && log "INFO" "🏠 Aplikacja: file://$BUILD_DIR/index.html"
    [ -d "$STORYBOOK_DIR" ] && log "INFO" "📚 Storybook: file://$STORYBOOK_DIR/index.html"  
    [ -d "$DOCS_DIR" ] && log "INFO" "📖 Dokumentacja: file://$DOCS_DIR/index.html"
    [ -d "$COVERAGE_DIR" ] && log "INFO" "📊 Coverage: file://$COVERAGE_DIR/index.html"
}

# Obsługa błędów
handle_error() {
    local exit_code=$?
    local line_number=$1
    
    log "ERROR" "💥 Błąd w linii $line_number (kod: $exit_code)"
    log "ERROR" "🛑 Budowa przerwana"
    
    # Sprawdzenie czy są szczegóły błędu w logach
    if [ -f "$ERROR_LOG" ] && [ -s "$ERROR_LOG" ]; then
        echo -e "\n${RED}🚨 OSTATNIE BŁĘDY:${NC}"
        tail -10 "$ERROR_LOG" 2>/dev/null || echo "Nie można odczytać logów błędów"
    fi
    
    exit $exit_code
}

# =============================================================================
# 🎯 GŁÓWNA FUNKCJA BUDOWY
# =============================================================================

main() {
    local start_time=$(date)
    
    # Przechwytywanie błędów
    trap 'handle_error $LINENO' ERR
    
    print_banner "GAMMA VITE APP - ZAAWANSOWANY BUILD MANAGER"
    log "INFO" "🚀 Rozpoczynam proces budowy..."
    
    # Przejście do katalogu projektu
    cd "$PROJECT_DIR"
    
    # Wykonanie kroków budowy
    prepare_environment
    
    if [ "${1:-all}" != "no-clean" ]; then
        clean_folders
    fi
    
    run_tests
    build_main
    build_storybook  
    build_docs
    update_gitignore
    build_summary
    
    log "SUCCESS" "🎉 Budowa zakończona pomyślnie!"
}

# =============================================================================
# 📜 HELP I OPCJE
# =============================================================================

show_help() {
    echo -e "${CYAN}Gamma Vite App - Zaawansowany Build Manager${NC}\n"
    echo -e "${WHITE}UŻYCIE:${NC}"
    echo -e "  $0 [OPCJA]\n"
    echo -e "${WHITE}OPCJE:${NC}"
    echo -e "  ${GREEN}all${NC}          Pełna budowa (domyślne)"
    echo -e "  ${GREEN}no-clean${NC}     Budowa bez czyszczenia folderów"
    echo -e "  ${GREEN}clean${NC}        Tylko czyszczenie folderów"
    echo -e "  ${GREEN}test${NC}         Tylko testy"
    echo -e "  ${GREEN}build${NC}        Tylko budowa główna"
    echo -e "  ${GREEN}storybook${NC}    Tylko budowa Storybook"
    echo -e "  ${GREEN}docs${NC}         Tylko dokumentacja"
    echo -e "  ${GREEN}help${NC}         Pokaż tę pomoc\n"
    echo -e "${WHITE}PRZYKŁADY:${NC}"
    echo -e "  $0                # Pełna budowa"
    echo -e "  $0 no-clean      # Budowa bez czyszczenia"
    echo -e "  $0 test          # Tylko testy"
    echo -e "  $0 clean         # Tylko czyszczenie\n"
}

# =============================================================================
# 🚀 PUNKT WEJŚCIA
# =============================================================================

case "${1:-all}" in
    "all")
        main "$@"
        ;;
    "no-clean")
        main "no-clean"
        ;;
    "clean")
        prepare_environment
        clean_folders
        ;;
    "test")
        prepare_environment
        run_tests
        ;;
    "build")
        prepare_environment
        build_main
        ;;
    "storybook")
        prepare_environment
        build_storybook
        ;;
    "docs")
        prepare_environment
        build_docs
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Nieznana opcja: $1${NC}" >&2
        show_help
        exit 1
        ;;
esac
