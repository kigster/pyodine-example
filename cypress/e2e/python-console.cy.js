describe('Python Console with Pyodide', () => {
  it('should load Pyodide and execute Python code', () => {
    cy.visit('/python-console.html')
    
    // Wait for Pyodide to load (increase timeout as it takes time)
    cy.get('#status', { timeout: 30000 }).should('contain', 'Pyodide loaded successfully!')
    
    // Check that run button is enabled
    cy.get('#run-btn').should('not.be.disabled')
    
    // Clear the default code and enter simple Python
    cy.get('#code-input').clear().type('print("Hello from Python!")')
    
    // Run the code
    cy.get('#run-btn').click()
    
    // Check for output (with longer timeout for execution)
    cy.get('#output', { timeout: 10000 }).should('contain', 'Hello from Python!')
  })
  
  it('should handle imports and numpy', () => {
    cy.visit('/python-console.html')
    
    // Wait for Pyodide to load
    cy.get('#status', { timeout: 30000 }).should('contain', 'Pyodide loaded successfully!')
    
    // Test numpy import
    cy.get('#code-input').clear().type(`import numpy as np
arr = np.array([1, 2, 3])
print(arr.mean())`)
    
    cy.get('#run-btn').click()
    
    // Check for numpy output
    cy.get('#output', { timeout: 15000 }).should('contain', '2')
  })
})
