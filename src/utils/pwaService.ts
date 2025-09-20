// PWA Service Worker 注册和管理
// 用于管理Service Worker的注册、更新和通信

interface PWAConfig {
  swPath: string;
  scope: string;
  updateInterval: number;
}

class PWAService {
  private config: PWAConfig;
  private registration: ServiceWorkerRegistration | null = null;
  private updateCheckInterval: number | null = null;

  constructor(config: PWAConfig = {
    swPath: '/sw.js',
    scope: '/',
    updateInterval: 60000 // 1分钟检查一次更新
  }) {
    this.config = config;
  }

  // 注册Service Worker
  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('[PWA] Service Worker not supported');
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register(this.config.swPath, {
        scope: this.config.scope
      });



      // 监听更新
      this.setupUpdateListeners();

      // 开始定期检查更新
      this.startUpdateCheck();

      return this.registration;
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
      return null;
    }
  }

  // 设置更新监听器
  private setupUpdateListeners(): void {
    if (!this.registration) return;

    // 监听Service Worker更新
    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration?.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // 有新版本可用
          this.showUpdateNotification();
        }
      });
    });

    // 监听消息
    navigator.serviceWorker.addEventListener('message', (event) => {
      this.handleSWMessage(event);
    });

    // 监听控制器变化
    navigator.serviceWorker.addEventListener('controllerchange', () => {

      // 可以在这里重新加载页面或显示提示
      window.location.reload();
    });
  }

  // 开始定期检查更新
  private startUpdateCheck(): void {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
    }

    this.updateCheckInterval = window.setInterval(() => {
      this.checkForUpdates();
    }, this.config.updateInterval);
  }

  // 检查更新
  async checkForUpdates(): Promise<void> {
    if (!this.registration) return;

    try {
      await this.registration.update();
    } catch (error) {
      console.error('[PWA] Update check failed:', error);
    }
  }

  // 显示更新通知
  private showUpdateNotification(): void {
    // 这里可以显示自定义的更新提示
    const shouldUpdate = confirm('发现新版本，是否立即更新？');
    if (shouldUpdate) {
      this.applyUpdate();
    }
  }

  // 应用更新
  async applyUpdate(): Promise<void> {
    if (!this.registration?.waiting) return;

    // 发送消息给Service Worker，要求跳过等待
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  // 处理Service Worker消息
  private handleSWMessage(event: MessageEvent): void {
    const { data } = event;
    
    switch (data.type) {
      case 'SW_READY':

        break;
      case 'SW_OFFLINE':

        this.showOfflineNotification();
        break;
      case 'SW_ONLINE':

        this.showOnlineNotification();
        break;
      case 'CACHE_UPDATED':

        break;
      default:

    }
  }

  // 显示离线通知
  private showOfflineNotification(): void {
    // 可以集成到现有的通知系统

  }

  // 显示在线通知
  private showOnlineNotification(): void {
    // 可以集成到现有的通知系统

  }

  // 获取Service Worker版本信息
  async getVersion(): Promise<string | null> {
    if (!this.registration?.active) return null;

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.version);
      };

      this.registration?.active?.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      );
    });
  }

  // 清理缓存
  async clearCache(): Promise<void> {
    if (!this.registration) return;

    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );


  }

  // 获取缓存使用情况
  async getCacheUsage(): Promise<{ name: string; size: number }[]> {
    const cacheNames = await caches.keys();
    const usage = await Promise.all(
      cacheNames.map(async (cacheName) => {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        return {
          name: cacheName,
          size: keys.length
        };
      })
    );

    return usage;
  }

  // 手动触发后台同步
  async triggerBackgroundSync(tag: string): Promise<void> {
    if (!this.registration || !('sync' in window.ServiceWorkerRegistration.prototype)) {
      console.warn('[PWA] Background sync not supported');
      return;
    }

    try {
      await (this.registration as any).sync.register(tag);

    } catch (error) {
      console.error('[PWA] Background sync registration failed:', error);
    }
  }

  // 请求通知权限
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('[PWA] Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();

      return permission;
    }

    return Notification.permission;
  }

  // 显示通知
  async showNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    if (!this.registration || Notification.permission !== 'granted') {
      console.warn('[PWA] Cannot show notification - permission denied or SW not registered');
      return;
    }

    const defaultOptions: NotificationOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      requireInteraction: false,
      ...options
    };

    await this.registration.showNotification(title, defaultOptions);
  }

  // 获取安装提示
  getInstallPrompt(): any {
    // 这个需要在实际的安装事件中获取
    return null;
  }

  // 显示安装提示
  async showInstallPrompt(): Promise<boolean> {
    const deferredPrompt = this.getInstallPrompt();
    if (!deferredPrompt) {
      console.warn('[PWA] No install prompt available');
      return false;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {

      return true;
    } else {

      return false;
    }
  }

  // 检查是否已安装
  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  // 停止服务
  stop(): void {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
      this.updateCheckInterval = null;
    }
  }
}

// 创建全局实例
export const pwaService = new PWAService();

// 导出类型
export type { PWAConfig };
export default PWAService;
