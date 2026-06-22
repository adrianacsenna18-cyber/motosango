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

  const title = payload.title || '🚨 Nova Corrida no MotoSango!';
  
  // Opções básicas compatíveis com iOS/Apple
  const options = {
    body: payload.body || 'Você tem uma nova solicitação de corrida!',
    icon: '/icon-192x192.png',
    data: {
      url: payload.url || '/mototaxista/painel'
    }
  };

  // Verificação de dispositivo
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.userAgent.includes("Mac") && "ontouchend" in document);
               
  // Propriedades agressivas (vibrate, badge, tag, requireInteraction, etc) 
  // causam descarte silencioso no iOS PWA Background, então aplicamos apenas no Android
  if (!isIOS) {
    options.badge = '/icon-192x192.png';
    options.vibrate = [200, 100, 200, 100, 200, 100, 200];
    options.requireInteraction = true;
    options.tag = 'nova-corrida';
    options.renotify = true;
  }

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
