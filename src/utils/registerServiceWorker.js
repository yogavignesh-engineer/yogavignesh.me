/**
 * Service Worker Registration
 * 
 * Registers and manages service worker lifecycle
 */

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });

      console.log('✅ Service Worker registered:', registration.scope);

      // Check for updates every hour
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            showUpdateNotification(() => {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            });
          }
        });
      });

      // Reload when new SW takes control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  });
}

function showUpdateNotification(onUpdate) {
  // Create update notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: #66FCF1;
    color: #111;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    display: flex;
    gap: 1rem;
    align-items: center;
  `;

  notification.innerHTML = `
    <span>🎉 New version available!</span>
    <button style="
      background: #111;
      color: #66FCF1;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    ">
      Update Now
    </button>
  `;

  const button = notification.querySelector('button');
  button?.addEventListener('click', () => {
    onUpdate();
    notification.remove();
  });

  document.body.appendChild(notification);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    notification.remove();
  }, 10000);
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
      console.log('Service Worker unregistered');
    });
  }
}

export async function checkOfflineStatus() {
  if (!navigator.onLine) {
    return true;
  }

  try {
    const response = await fetch('/manifest.json', {
      method: 'HEAD',
      cache: 'no-cache'
    });
    return !response.ok;
  } catch {
    return true;
  }
}
