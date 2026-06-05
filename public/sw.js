self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Você tem uma nova solicitação de corrida!',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      requireInteraction: true,
      renotify: true,
      silent: false,
      tag: 'nova-corrida',
      data: {
        url: data.url || '/mototaxista/painel'
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title || '🚨 Nova Corrida no MotoSango!', options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      const urlToOpen = event.notification.data.url;
      
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes('/mototaxista/painel') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
