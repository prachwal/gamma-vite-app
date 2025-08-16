#!/bin/bash

# =============================================================================
# 📊 Log Monitor - Monitorowanie logów Build Manager
# =============================================================================

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly LOGS_DIR="$SCRIPT_DIR/logs"

# Kolory
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m'

show_help() {
    echo -e "${CYAN}Log Monitor - Monitorowanie logów Build Manager${NC}\n"
    echo -e "${YELLOW}UŻYCIE:${NC}"
    echo -e "  $0 [OPCJA]\n"
    echo -e "${YELLOW}OPCJE:${NC}"
    echo -e "  ${GREEN}latest${NC}       Pokaż ostatni log budowy"
    echo -e "  ${GREEN}errors${NC}       Pokaż błędy z ostatniego loga"
    echo -e "  ${GREEN}list${NC}         Lista wszystkich logów"
    echo -e "  ${GREEN}tail${NC}         Obserwuj najnowszy log na żywo"
    echo -e "  ${GREEN}clean${NC}        Usuń stare logi (starsze niż 7 dni)"
    echo -e "  ${GREEN}stats${NC}        Statystyki logów"
    echo -e "  ${GREEN}help${NC}         Pokaż tę pomoc\n"
}

get_latest_log() {
    if [ -d "$LOGS_DIR" ]; then
        ls -t "$LOGS_DIR"/build_*.log 2>/dev/null | head -1
    fi
}

get_latest_error_log() {
    if [ -d "$LOGS_DIR" ]; then
        ls -t "$LOGS_DIR"/errors_*.log 2>/dev/null | head -1
    fi
}

show_latest() {
    local latest_log=$(get_latest_log)
    if [ -n "$latest_log" ] && [ -f "$latest_log" ]; then
        echo -e "${BLUE}📄 Ostatni log budowy: ${latest_log}${NC}\n"
        cat "$latest_log"
    else
        echo -e "${RED}❌ Nie znaleziono logów budowy${NC}"
    fi
}

show_errors() {
    local latest_error=$(get_latest_error_log)
    if [ -n "$latest_error" ] && [ -f "$latest_error" ]; then
        echo -e "${RED}🚨 Ostatnie błędy: ${latest_error}${NC}\n"
        cat "$latest_error"
    else
        echo -e "${GREEN}✅ Brak błędów w ostatnim logu${NC}"
    fi
}

list_logs() {
    if [ ! -d "$LOGS_DIR" ]; then
        echo -e "${RED}❌ Folder logs nie istnieje${NC}"
        return 1
    fi
    
    echo -e "${BLUE}📋 Lista logów budowy:${NC}\n"
    
    local build_logs=($(ls -t "$LOGS_DIR"/build_*.log 2>/dev/null || true))
    local error_logs=($(ls -t "$LOGS_DIR"/errors_*.log 2>/dev/null || true))
    
    if [ ${#build_logs[@]} -eq 0 ]; then
        echo -e "${YELLOW}⚠️ Brak logów budowy${NC}"
        return 0
    fi
    
    printf "%-30s %-10s %-15s %s\n" "PLIK" "ROZMIAR" "DATA" "STATUS"
    printf "%-30s %-10s %-15s %s\n" "$(printf '%.0s-' {1..30})" "$(printf '%.0s-' {1..10})" "$(printf '%.0s-' {1..15})" "$(printf '%.0s-' {1..10})"
    
    for log in "${build_logs[@]}"; do
        local basename=$(basename "$log")
        local timestamp=$(echo "$basename" | grep -o '[0-9]\{8\}_[0-9]\{6\}' || echo "unknown")
        local formatted_date=$(date -d "${timestamp:0:8} ${timestamp:9:2}:${timestamp:11:2}:${timestamp:13:2}" '+%Y-%m-%d %H:%M' 2>/dev/null || echo "unknown")
        local size=$(du -sh "$log" 2>/dev/null | cut -f1 || echo "N/A")
        
        # Sprawdź czy był błąd
        local error_file="${log/build_/errors_}"
        local status="✅ OK"
        if [ -f "$error_file" ] && [ -s "$error_file" ]; then
            status="❌ BŁĘDY"
        fi
        
        printf "%-30s %-10s %-15s %s\n" "$basename" "$size" "$formatted_date" "$status"
    done
}

tail_latest() {
    local latest_log=$(get_latest_log)
    if [ -n "$latest_log" ] && [ -f "$latest_log" ]; then
        echo -e "${BLUE}📄 Obserwowanie: ${latest_log}${NC}"
        echo -e "${YELLOW}📝 Naciśnij Ctrl+C aby wyjść${NC}\n"
        tail -f "$latest_log"
    else
        echo -e "${RED}❌ Nie znaleziono logów do obserwowania${NC}"
    fi
}

clean_logs() {
    if [ ! -d "$LOGS_DIR" ]; then
        echo -e "${RED}❌ Folder logs nie istnieje${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}🧹 Usuwanie logów starszych niż 7 dni...${NC}"
    
    local deleted=0
    # Znajdź pliki starsze niż 7 dni
    while IFS= read -r -d '' file; do
        echo "Usuwam: $(basename "$file")"
        rm "$file"
        ((deleted++))
    done < <(find "$LOGS_DIR" -name "*.log" -type f -mtime +7 -print0 2>/dev/null)
    
    echo -e "${GREEN}✅ Usunięto $deleted plików logów${NC}"
}

show_stats() {
    if [ ! -d "$LOGS_DIR" ]; then
        echo -e "${RED}❌ Folder logs nie istnieje${NC}"
        return 1
    fi
    
    echo -e "${CYAN}📊 Statystyki logów:${NC}\n"
    
    local total_logs=$(ls "$LOGS_DIR"/build_*.log 2>/dev/null | wc -l)
    local total_errors=$(ls "$LOGS_DIR"/errors_*.log 2>/dev/null | wc -l)
    local total_size=$(du -sh "$LOGS_DIR" 2>/dev/null | cut -f1 || echo "N/A")
    
    echo -e "📄 Całkowita liczba logów budowy: ${GREEN}$total_logs${NC}"
    echo -e "🚨 Logi z błędami: ${RED}$total_errors${NC}"  
    echo -e "📁 Rozmiar folderu logs: ${BLUE}$total_size${NC}"
    
    if [ $total_logs -gt 0 ]; then
        echo -e "\n${BLUE}📈 Ostatnie budowy:${NC}"
        ls -t "$LOGS_DIR"/build_*.log 2>/dev/null | head -5 | while read log; do
            local basename=$(basename "$log")
            local timestamp=$(echo "$basename" | grep -o '[0-9]\{8\}_[0-9]\{6\}' || echo "unknown")
            local formatted_date=$(date -d "${timestamp:0:8} ${timestamp:9:2}:${timestamp:11:2}:${timestamp:13:2}" '+%Y-%m-%d %H:%M' 2>/dev/null || echo "unknown")
            local error_file="${log/build_/errors_}"
            local status="✅"
            [ -f "$error_file" ] && [ -s "$error_file" ] && status="❌"
            echo "  $status $formatted_date - $(basename "$log")"
        done
    fi
}

case "${1:-help}" in
    "latest")
        show_latest
        ;;
    "errors")  
        show_errors
        ;;
    "list")
        list_logs
        ;;
    "tail")
        tail_latest
        ;;
    "clean")
        clean_logs
        ;;
    "stats")
        show_stats
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
