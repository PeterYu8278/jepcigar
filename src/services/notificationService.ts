// 推送通知服务
// 用于管理PWA的推送通知功能

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  actions?: NotificationAction[];
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

class NotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
  }

  // 初始化通知服务
  async initialize(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('[NotificationService] Notifications not supported');
      return false;
    }

    try {
      // 获取Service Worker注册
      this.registration = await navigator.serviceWorker.getRegistration() || null;
      
      if (!this.registration) {
        console.warn('[NotificationService] No service worker registration found');
        return false;
      }


      return true;
    } catch (error) {
      console.error('[NotificationService] Initialization failed:', error);
      return false;
    }
  }

  // 请求通知权限
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      return { granted: false, denied: true, default: false };
    }

    try {
      const permission = await Notification.requestPermission();
      
      const result: NotificationPermission = {
        granted: permission === 'granted',
        denied: permission === 'denied',
        default: permission === 'default',
      };


      return result;
    } catch (error) {
      console.error('[NotificationService] Permission request failed:', error);
      return { granted: false, denied: true, default: false };
    }
  }

  // 检查通知权限
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported) {
      return { granted: false, denied: true, default: false };
    }

    const permission = Notification.permission;
    return {
      granted: permission === 'granted',
      denied: permission === 'denied',
      default: permission === 'default',
    };
  }

  // 显示通知
  async showNotification(options: NotificationOptions): Promise<boolean> {
    if (!this.isSupported || !this.registration) {
      console.warn('[NotificationService] Cannot show notification - not supported or not initialized');
      return false;
    }

    const permission = this.getPermissionStatus();
    if (!permission.granted) {
      console.warn('[NotificationService] Cannot show notification - permission not granted');
      return false;
    }

    try {
      const notificationOptions: NotificationOptions = {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        requireInteraction: false,
        silent: false,
        ...options,
      };

      await this.registration.showNotification(options.title, notificationOptions);

      return true;
    } catch (error) {
      console.error('[NotificationService] Failed to show notification:', error);
      return false;
    }
  }

  // 显示库存预警通知
  async showLowStockAlert(items: string[]): Promise<boolean> {
    return this.showNotification({
      title: '库存预警',
      body: `以下商品库存不足：${items.slice(0, 3).join('、')}${items.length > 3 ? '等' : ''}`,
      tag: 'low-stock',
      data: { type: 'low-stock', items },
      requireInteraction: true,
      actions: [
        {
          action: 'view-inventory',
          title: '查看库存',
          icon: '/icons/action-inventory.png',
        },
        {
          action: 'dismiss',
          title: '忽略',
        },
      ],
    });
  }

  // 显示活动提醒通知
  async showEventReminder(event: { title: string; startTime: Date; location?: string }): Promise<boolean> {
    const timeStr = event.startTime.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return this.showNotification({
      title: '活动提醒',
      body: `${event.title} 将在 ${timeStr} 开始${event.location ? `，地点：${event.location}` : ''}`,
      tag: 'event-reminder',
      data: { type: 'event-reminder', event },
      requireInteraction: true,
      actions: [
        {
          action: 'view-event',
          title: '查看活动',
          icon: '/icons/action-event.png',
        },
        {
          action: 'dismiss',
          title: '忽略',
        },
      ],
    });
  }

  // 显示客户生日提醒
  async showBirthdayReminder(customer: { name: string; birthday: Date }): Promise<boolean> {
    return this.showNotification({
      title: '客户生日提醒',
      body: `今天是 ${customer.name} 的生日，记得送上祝福！`,
      tag: 'birthday-reminder',
      data: { type: 'birthday-reminder', customer },
      requireInteraction: true,
      actions: [
        {
          action: 'view-customer',
          title: '查看客户',
          icon: '/icons/action-customer.png',
        },
        {
          action: 'send-gift',
          title: '发送礼品',
          icon: '/icons/action-gift.png',
        },
      ],
    });
  }

  // 显示新订单通知
  async showNewOrderNotification(order: { id: string; customerName: string; amount: number }): Promise<boolean> {
    return this.showNotification({
      title: '新订单',
      body: `${order.customerName} 的新订单 ¥${order.amount}，订单号：${order.id}`,
      tag: 'new-order',
      data: { type: 'new-order', order },
      requireInteraction: true,
      actions: [
        {
          action: 'view-order',
          title: '查看订单',
          icon: '/icons/action-order.png',
        },
        {
          action: 'dismiss',
          title: '忽略',
        },
      ],
    });
  }

  // 显示系统更新通知
  async showSystemUpdateNotification(version: string): Promise<boolean> {
    return this.showNotification({
      title: '系统更新',
      body: `应用已更新到版本 ${version}，点击查看更新内容`,
      tag: 'system-update',
      data: { type: 'system-update', version },
      requireInteraction: false,
      actions: [
        {
          action: 'view-update',
          title: '查看更新',
          icon: '/icons/action-update.png',
        },
        {
          action: 'dismiss',
          title: '忽略',
        },
      ],
    });
  }

  // 显示自定义通知
  async showCustomNotification(
    title: string,
    body: string,
    options: Partial<NotificationOptions> = {}
  ): Promise<boolean> {
    return this.showNotification({
      title,
      body,
      ...options,
    });
  }

  // 关闭所有通知
  async closeAllNotifications(): Promise<void> {
    if (!this.registration) return;

    try {
      const notifications = await this.registration.getNotifications();
      notifications.forEach(notification => notification.close());

    } catch (error) {
      console.error('[NotificationService] Failed to close notifications:', error);
    }
  }

  // 关闭特定标签的通知
  async closeNotificationsByTag(tag: string): Promise<void> {
    if (!this.registration) return;

    try {
      const notifications = await this.registration.getNotifications({ tag });
      notifications.forEach(notification => notification.close());

    } catch (error) {
      console.error('[NotificationService] Failed to close notifications by tag:', error);
    }
  }

  // 获取当前通知
  async getCurrentNotifications(): Promise<Notification[]> {
    if (!this.registration) return [];

    try {
      return await this.registration.getNotifications();
    } catch (error) {
      console.error('[NotificationService] Failed to get notifications:', error);
      return [];
    }
  }

  // 监听通知点击事件
  setupNotificationClickHandler(): void {
    if (!this.registration) return;

    // 这个事件在Service Worker中处理，这里只是提供接口

  }

  // 订阅推送通知（需要后端支持）
  async subscribeToPushNotifications(vapidPublicKey: string): Promise<PushSubscription | null> {
    if (!this.registration || !('PushManager' in window)) {
      console.warn('[NotificationService] Push notifications not supported');
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      });


      return subscription;
    } catch (error) {
      console.error('[NotificationService] Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  // 取消订阅推送通知
  async unsubscribeFromPushNotifications(): Promise<boolean> {
    if (!this.registration || !('PushManager' in window)) {
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();

        return true;
      }
      return false;
    } catch (error) {
      console.error('[NotificationService] Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  // 获取推送订阅状态
  async getPushSubscriptionStatus(): Promise<PushSubscription | null> {
    if (!this.registration || !('PushManager' in window)) {
      return null;
    }

    try {
      return await this.registration.pushManager.getSubscription();
    } catch (error) {
      console.error('[NotificationService] Failed to get push subscription status:', error);
      return null;
    }
  }
}

// 创建全局实例
export const notificationService = new NotificationService();

// 导出类型
export type { NotificationOptions, NotificationAction, NotificationPermission };
export default NotificationService;
