import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
// FULL APP: All components with fixes
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'

console.log('[MAIN] Loading FULL APP with Router and Helmet');
console.log('[MAIN] If this shows white screen, check console for specific error');

try {
  const rootElement = document.getElementById('root');
  if (rootElement.hasChildNodes()) {
    console.log('[MAIN] 💧 Hydrating pre-rendered content...');
    hydrateRoot(rootElement,
      <StrictMode>
        <BrowserRouter>
          <HelmetProvider>
            <App />
            <Analytics />
          </HelmetProvider>
        </BrowserRouter>
      </StrictMode>
    );
    console.log('[MAIN] ✅ Hydration complete');
  } else {
    console.log('[MAIN] 🌱 Starting client-side render...');
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <BrowserRouter>
          <HelmetProvider>
            <App />
            <Analytics />
          </HelmetProvider>
        </BrowserRouter>
      </StrictMode>,
    );
    console.log('[MAIN] ✅ Render complete');
  }
} catch (error) {
  console.error('[MAIN] ❌ CRITICAL ERROR:', error);
  console.error('[MAIN] Error name:', error.name);
  console.error('[MAIN] Error message:', error.message);
  console.error('[MAIN] Stack trace:', error.stack);

  document.body.innerHTML = `
    <div style="background: #ff0000; color: white; padding: 20px; font-family: monospace; font-size: 14px;">
      <h1 style="margin-bottom: 20px;">❌ FULL APP FAILED TO START</h1>
      <h2 style="color: #ffff00; margin-bottom: 10px;">Error: ${error.name}</h2>
      <p style="margin-bottom: 20px; font-size: 16px;">${error.message}</p>
      <h3 style="margin-bottom: 10px;">Stack Trace:</h3>
      <pre style="background: #000; padding: 10px; overflow-x: auto;">${error.stack}</pre>
      <div style="margin-top: 30px; padding: 15px; background: #ffaa00; color: #000;">
        <strong>SOLUTION:</strong> Open browser DevTools (F12) and share the full error message above.
      </div>
    </div>
  `;
}