#!/bin/bash

# VS Code Test Explorer Reset Script
# Clears test cache and resets VS Code testing environment

echo "🔄 Resetting VS Code Test Explorer..."

# Clear Vitest cache
echo "📁 Clearing Vitest cache..."
rm -rf node_modules/.vitest
rm -rf coverage

# Clear VS Code test cache if exists
echo "📁 Clearing VS Code test cache..."
find ~/.vscode/extensions -name "*vitest*" -type d -exec rm -rf {} + 2>/dev/null || true

# Restart TypeScript server would be manual in VS Code
echo "⚡ Test cache cleared!"
echo ""
echo "📋 Next steps:"
echo "1. In VS Code, press Ctrl+Shift+P"
echo "2. Run 'TypeScript: Restart TS Server'"
echo "3. Run 'Test: Reset and Reload All Test Data'"
echo "4. Check Test Explorer panel"
echo ""
echo "🧪 You can also run tests manually:"
echo "   npm run test"
echo "   npm run test:run"
