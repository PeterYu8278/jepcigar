// Service Worker for JEP Cigar Business System PWA
// Version: 1.0.0

const CACHE_NAME = 'jep-cigar-v1.0.0';
const STATIC_CACHE = 'jep-cigar-static-v1.0.0';
const DYNAMIC_CACHE = 'jep-cigar-dynamic-v1.0.0';
const API_CACHE = 'jep-cigar-api-v1.0.0';

// 需要预缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // CSS 和 JS 文件将在构建时动态添加
];

// 需要缓存的API路径模式
const API_PATTERNS = [
  /^https:\/\/firestore\.googleapis\.com\/v1\/projects\/cigar-56871/,
  /^https:\/\/firebase\.googleapis\.com\/v1\/projects\/cigar-56871/,
];

// 离线回退页面
const OFFLINE_FALLBACK = '/offline.html';

// 安装事件 - 预缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activated');
        return self.clients.claim();
      })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非GET请求
  if (request.method !== 'GET') {
    return;
  }

  // 跳过Chrome扩展请求
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // 处理不同类型的请求
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleOtherRequest(request));
  }
});

// 判断是否为静态资源
function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.gif') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname.endsWith('.eot')
  );
}

// 判断是否为API请求
function isAPIRequest(request) {
  const url = new URL(request.url);
  return API_PATTERNS.some(pattern => pattern.test(url.href));
}

// 判断是否为导航请求
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// 处理静态资源请求
async function handleStaticAsset(request) {
  try {
    // 首先尝试从缓存获取
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // 如果缓存中没有，则从网络获取
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Failed to handle static asset:', error);
    // 返回一个默认的响应或抛出错误
    throw error;
  }
}

// 处理API请求
async function handleAPIRequest(request) {
  try {
    // 首先尝试从网络获取
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 缓存成功的API响应
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for API request, trying cache...');
    
    // 网络失败时，尝试从缓存获取
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 如果缓存中也没有，返回一个默认响应
    return new Response(
      JSON.stringify({ 
        error: 'Network unavailable', 
        offline: true 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// 处理导航请求
async function handleNavigationRequest(request) {
  try {
    // 首先尝试从网络获取
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for navigation request, trying cache...');
    
    // 网络失败时，尝试从缓存获取
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 如果缓存中也没有，返回离线页面
    const offlineResponse = await caches.match(OFFLINE_FALLBACK);
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // 最后的回退
    return new Response(
      `
      <!DOCTYPE html>
      <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>离线模式 - JEP Cigar</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0; padding: 20px; text-align: center; background: #f5f5f5;
            }
            .container { max-width: 400px; margin: 50px auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .icon { font-size: 48px; color: #f16d1f; margin-bottom: 20px; }
            h1 { color: #333; margin-bottom: 15px; }
            p { color: #666; line-height: 1.6; margin-bottom: 20px; }
            .retry-btn { background: #f16d1f; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; }
            .retry-btn:hover { background: #e25115; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">📱</div>
            <h1>离线模式</h1>
            <p>您当前处于离线状态，部分功能可能无法使用。请检查网络连接后重试。</p>
            <button class="retry-btn" onclick="window.location.reload()">重新加载</button>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}

// 处理其他请求
async function handleOtherRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // 缓存成功的响应
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // 尝试从缓存获取
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// 监听消息事件（用于与主线程通信）
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// 后台同步事件（如果支持）
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

// 执行后台同步
async function doBackgroundSync() {
  try {
    // 这里可以添加后台同步逻辑
    // 例如：同步离线数据、发送待发送的消息等
    console.log('[SW] Performing background sync...');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// 推送通知事件（如果支持）
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received');
  
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('[SW] Push data:', data);
      
      const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: data.primaryKey || 1,
          ...data.data
        },
        actions: data.actions || [
          {
            action: 'explore',
            title: '查看详情',
            icon: '/icons/action-explore.png'
          },
          {
            action: 'close',
            title: '关闭',
            icon: '/icons/action-close.png'
          }
        ],
        requireInteraction: data.requireInteraction || false,
        silent: data.silent || false,
        tag: data.tag || 'default'
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title || 'JEP Cigar', options)
      );
    } catch (error) {
      console.error('[SW] Failed to parse push data:', error);
      
      // 回退到简单的文本通知
      event.waitUntil(
        self.registration.showNotification('JEP Cigar', {
          body: event.data.text() || '您有新的通知',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          vibrate: [100, 50, 100]
        })
      );
    }
  } else {
    // 没有数据时的默认通知
    event.waitUntil(
      self.registration.showNotification('JEP Cigar', {
        body: '您有新的通知',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100]
      })
    );
  }
});

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag, event.action);
  
  event.notification.close();
  
  const notificationData = event.notification.data || {};
  const action = event.action;
  
  let targetUrl = '/';
  
  // 根据通知类型和动作确定目标URL
  if (action === 'explore' || action === 'view-inventory') {
    targetUrl = '/inventory';
  } else if (action === 'view-event') {
    targetUrl = '/events';
  } else if (action === 'view-customer') {
    targetUrl = '/customers';
  } else if (action === 'view-order') {
    targetUrl = '/dashboard';
  } else if (action === 'send-gift') {
    targetUrl = '/gifting';
  } else if (action === 'view-update') {
    targetUrl = '/settings';
  } else if (notificationData.type) {
    // 根据通知数据类型确定URL
    switch (notificationData.type) {
      case 'low-stock':
        targetUrl = '/inventory';
        break;
      case 'event-reminder':
        targetUrl = '/events';
        break;
      case 'birthday-reminder':
        targetUrl = '/customers';
        break;
      case 'new-order':
        targetUrl = '/dashboard';
        break;
      case 'system-update':
        targetUrl = '/settings';
        break;
      default:
        targetUrl = '/dashboard';
    }
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 查找已打开的窗口
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // 如果没有找到匹配的窗口，打开新窗口
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

console.log('[SW] Service Worker script loaded');
