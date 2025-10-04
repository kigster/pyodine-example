# Pyodide Python Console Examples

This folder contains working examples of using Pyodide to run Python code in the browser.

## Files

- **python-console.html** - Full-featured Python console with syntax input, error handling
- **simple-example.html** - Minimal example showing basic Pyodide usage

## Example

![Example](doc/screenshot.png.)

## How to Use

1. Start the HTTP server:

   ```bash
   npx http-server -p 8080
   ```

2. Open in browser:

   ```
   http://localhost:8080/python-console.html
   ```

3. Type Python code and click "Run Code" or press `Ctrl+Enter`

## Features

- Executes Python code including imports (numpy, pandas, etc.)
- Captures `print()` statements
- Auto-installs numpy (other packages can be added)
- Error handling and display
- Keyboard shortcut: `Ctrl+Enter` to run

## Testing

Run automated Cypress tests:

```bash
npx cypress run
```

## Key Implementation Details

- **Pyodide CDN**: `https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.js`
- **Captures stdout** using `pyodide.setStdout({ batched: (msg) => ... })`
- **Installs packages** with micropip: `await micropip.install('package-name')`
- **Uses** `runPythonAsync()` for async execution

### Code Example

```javascript
// Load Pyodide
let pyodide = await loadPyodide();

// Capture stdout
let output = [];
pyodide.setStdout({ batched: (msg) => output.push(msg) });

// Load micropip and install packages
await pyodide.loadPackage('micropip');
const micropip = pyodide.pyimport('micropip');
await micropip.install('numpy');

// Run Python code
await pyodide.runPythonAsync(`
import numpy as np
arr = np.array([1, 2, 3])
print(arr.mean())
`);

// Get output
console.log(output.join('\n')); // "2.0"
```

## For Students

The `python-console.html` file provides a ready-to-use Python environment that runs entirely in the browser without needing a Python installation.
