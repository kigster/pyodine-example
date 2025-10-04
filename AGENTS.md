# AGENTS.md

This file contains context and implementation details for AI agents working with this Pyodide Python console project.

## Project Overview

This project demonstrates how to run Python code in the browser using Pyodide, a Python distribution compiled to WebAssembly. It includes a full-featured interactive Python console that can execute Python code, import packages, and capture output - all running client-side in the browser.

## Architecture

### Core Components

1. **python-console.html** - Main interactive console
   - UI: Code input textarea, output display, control buttons
   - JavaScript runtime that loads and manages Pyodide
   - Stdout/stderr capture mechanism
   - Package management via micropip

2. **simple-example.html** - Minimal implementation reference
   - Demonstrates the core Pyodide loading pattern
   - Shows basic stdout capture
   - Useful as a starting template

3. **Cypress Tests** (`cypress/e2e/python-console.cy.js`)
   - Tests Pyodide loading and initialization
   - Validates Python code execution
   - Tests package import (numpy)
   - Tests print() output capture

## Key Technical Details

### Pyodide Loading

```javascript
// Load Pyodide from CDN
let pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/"
});

// Load micropip for package management
await pyodide.loadPackage('micropip');
```

### Capturing Python Output (IMPORTANT!)

**Correct Method** - Use Pyodide's `setStdout()` API:

```javascript
let outputBuffer = [];
pyodide.setStdout({ batched: (msg) => outputBuffer.push(msg) });
await pyodide.runPythonAsync(code);
// outputBuffer now contains all print() statements
```

**Incorrect Method** - Don't use StringIO redirection:

```javascript
// ❌ This does NOT work reliably
await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);
```

The StringIO approach causes blank errors and unreliable output capture.

### Package Installation

Packages must be installed before use:

```javascript
const micropip = pyodide.pyimport('micropip');
await micropip.install('numpy');  // Now numpy can be imported
```

Pre-installed packages in Pyodide include:

- numpy
- pandas
- matplotlib
- scipy
- scikit-learn
- many more (check Pyodide docs)

### Error Handling

```javascript
try {
    await pyodide.runPythonAsync(code);
} catch (error) {
    // error.message contains Python traceback
    console.error(error.message);
}
```

## Common Issues and Solutions

### Issue: Blank error messages

**Cause**: Using StringIO to redirect stdout/stderr
**Solution**: Use `pyodide.setStdout()` and `pyodide.setStderr()` APIs

### Issue: ModuleNotFoundError for packages

**Cause**: Package not installed
**Solution**: Use micropip to install: `await micropip.install('package-name')`

### Issue: Pyodide takes long to load

**Cause**: WebAssembly and packages are large (~10-50MB)
**Solution**: This is normal. Show loading indicator and set appropriate timeouts (30s+)

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npx http-server -p 8080

# Run tests
npx cypress run

# Open Cypress GUI (if display available)
npx cypress open
```

## Testing Strategy

Cypress tests use long timeouts due to Pyodide's load time:

- Initial load: 30 second timeout
- Code execution: 10-15 second timeout (includes package installation)

Tests verify:

1. Pyodide loads successfully
2. Simple print() statements work
3. Package imports (numpy) work
4. Output is captured correctly

## Browser Compatibility

Requires modern browsers with WebAssembly support:

- Chrome 112+
- Firefox 112+
- Safari 16.4+
- Edge 112+

## Performance Considerations

- **Initial load**: ~3-5 seconds (loads Pyodide core)
- **First package import**: ~2-5 seconds per package (downloads wheel files)
- **Subsequent executions**: Fast (<100ms for simple code)
- **Package caching**: Packages are cached by browser after first load

## Future Enhancement Ideas

1. **Code editor improvements**: Syntax highlighting, auto-completion
2. **Package pre-loading**: Pre-install common packages on init
3. **Session persistence**: Save code and output to localStorage
4. **Multiple cells**: Jupyter-style notebook interface
5. **File system**: Mount virtual file system for file I/O
6. **Matplotlib integration**: Display plots inline
7. **Error highlighting**: Show line numbers for errors

## References

- [Pyodide Documentation](https://pyodide.org/en/stable/)
- [Pyodide API Reference](https://pyodide.org/en/stable/usage/api/python-api.html)
- [Loading Packages](https://pyodide.org/en/stable/usage/loading-packages.html)
- [Stream Redirection](https://pyodide.org/en/stable/usage/streams.html)

## Educational Use Case

This project was created for a Python course where students need to:

- Run Python code without installing Python locally
- Learn programming in a browser-based environment
- Execute code with imports and external packages
- See immediate feedback from their code

The console provides a zero-setup Python environment accessible from any modern web browser.
