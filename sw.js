self.addEventListener('install', event => {
  console.log('[Service Worker] Instalado.');
  self.skipWaiting(); // Salta a la fase de activación inmediatamente
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activado.');
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  console.log('[Service Worker] Notificación clickeada.');
});
