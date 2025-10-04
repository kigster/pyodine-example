// Quick manual test script
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8080/python-console.html');
  
  console.log('Waiting for Pyodide to load...');
  await page.waitForSelector('#status:has-text("Pyodide loaded successfully!")', { timeout: 30000 });
  
  console.log('✓ Pyodide loaded');
  
  // Test simple print
  await page.fill('#code-input', 'print("Hello World!")');
  await page.click('#run-btn');
  await page.waitForTimeout(2000);
  
  const output1 = await page.textContent('#output');
  console.log('Output 1:', output1.includes('Hello World!') ? '✓ Simple print works' : '✗ Failed');
  
  // Test numpy
  await page.fill('#code-input', 'import numpy as np\narr = np.array([1,2,3])\nprint(arr.mean())');
  await page.click('#run-btn');
  await page.waitForTimeout(3000);
  
  const output2 = await page.textContent('#output');
  console.log('Output 2:', output2.includes('2') ? '✓ NumPy works' : '✗ Failed');
  
  await page.waitForTimeout(2000);
  await browser.close();
})();
