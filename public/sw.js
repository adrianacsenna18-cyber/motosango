self.addEventListener('push', function(event) {
  console.log("[SW] Push recebido");
  
  let payload = {};
  
  if (event.data) {
    try {
      payload = event.data.json();
      console.log("[SW] Payload JSON lido:", payload);
    } catch (e1) {
      try {
        const textData = event.data.text();
        console.log("[SW] Payload texto lido:", textData);
        payload = { body: textData };
      } catch (e2) {
        console.log("[SW] Falha ao ler payload, usando fallback", e2);
      }
    }
  } else {
    console.log("[SW] Payload vazio, usando fallback");
  }

  const title = payload.title || "MotoSango";
  const options = {
    body: payload.body || "Nova corrida disponível",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    tag: "motosango-corrida",
    renotify: true,
    requireInteraction: true,
    silent: false,
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    data: payload.data || payload || { url: "/mototaxista/painel" }
  };

  console.log("[SW] showNotification chamado com title:", title, "e options:", options);

  event.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => console.log("[SW] showNotification sucesso"))
      .catch((err) => console.error("[SW] showNotification erro:", err))
  );
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
