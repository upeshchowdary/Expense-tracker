import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";

import App from './App.jsx'

console.log('Main.jsx loaded');

try {
  const rootElement = document.getElementById('root');
  console.log('Root element found:', rootElement);
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = createRoot(rootElement);
  console.log('React root created');
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error rendering app:', error);
  document.body.innerHTML = `
    <div style="padding: 2rem; font-family: Arial, sans-serif;">
      <h1 style="color: red;">Error Loading App</h1>
      <p>Error: ${error.message}</p>
      <p>Check the console for more details.</p>
    </div>
  `;
}
