# Justfile for Pyodide Python Console

# List available commands
default:
    @just --list

# Install dependencies
install:
    npm install

# Start the development server
serve:
    npx http-server -p 8080

serve-bg:
    npx http-server -p 8080 &

# Open the console in the default browser
open: serve-bg
    open http://localhost:8080/python-console.html

# Run Cypress tests headlessly
test: serve-bg
    npx cypress run

# Open Cypress GUI for interactive testing
test-ui:
    npx cypress open

# Run tests for a specific spec file
test-spec SPEC:
    npx cypress run --spec "cypress/e2e/{{SPEC}}"

# Clean up generated files
clean:
    rm -rf cypress/screenshots cypress/videos
    rm -f server.pid

# Clean everything including dependencies
clean-all: clean
    rm -rf node_modules package-lock.json

# Quick check - run tests with existing server
check: serve
    npx cypress run --spec "cypress/e2e/python-console.cy.js"

# Format/lint check (if you add prettier/eslint later)
format:
    @echo "No formatter configured yet"

# Show project info
info:
    @echo "Pyodide Python Console"
    @echo "====================="
    @echo "Files:"
    @ls -1 *.html *.md 2>/dev/null || true
    @echo ""
    @echo "Node modules installed:" 
    @test -d node_modules && echo "✓ Yes" || echo "✗ No (run 'just install')"
    @echo ""
    @echo "Server running:"
    @lsof -ti:8080 >/dev/null 2>&1 && echo "✓ Yes (port 8080)" || echo "✗ No (run 'just serve')"

# Kill any process running on port 8080
kill-server:
    @lsof -ti:8080 | xargs kill 2>/dev/null || echo "No server running on port 8080"

# Quick start: install, start server, and open browser
start: install
    npx http-server -p 8080 & 
    sleep 2
    open http://localhost:8080/python-console.html
