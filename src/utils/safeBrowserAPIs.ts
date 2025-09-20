// 浏览器API安全访问工具
import { globalErrorHandler } from './errorHandler';

/**
 * 检查浏览器API是否可用
 */
export function isAPIAvailable(api: string, object: any = window): boolean {
  try {
    return api in object;
  } catch (error) {
    globalErrorHandler.handleError(
      error as Error,
      `API Availability Check - ${api}`,
      { api, object: object?.constructor?.name }
    );
    return false;
  }
}

/**
 * 安全的Service Worker API访问
 */
export const safeServiceWorker = {
  isSupported: (): boolean => {
    return isAPIAvailable('serviceWorker', navigator);
  },

  register: async (scriptURL: string, options?: RegistrationOptions): Promise<ServiceWorkerRegistration | null> => {
    if (!safeServiceWorker.isSupported()) {
      console.warn('Service Worker not supported');
      return null;
    }

    try {
      return await navigator.serviceWorker.register(scriptURL, options);
    } catch (error) {
      globalErrorHandler.handleError(
        error as Error,
        'Service Worker Registration',
        { scriptURL, options }
      );
      return null;
    }
  },

  getRegistration: async (scope?: string): Promise<ServiceWorkerRegistration | null> => {
    if (!safeServiceWorker.isSupported()) {
      return null;
    }

    try {
      return await navigator.serviceWorker.getRegistration(scope) || null;
    } catch (error) {
      globalErrorHandler.handleError(
        error as Error,
        'Service Worker Get Registration',
        { scope }
      );
      return null;
    }
  }
};

/**
 * 安全的Notification API访问
 */
export const safeNotification = {
  isSupported: (): boolean => {
    return isAPIAvailable('Notification', window);
  },

  requestPermission: async (): Promise<NotificationPermission> => {
    if (!safeNotification.isSupported()) {
      console.warn('Notification API not supported');
      return 'denied';
    }

    try {
      return await Notification.requestPermission();
    } catch (error) {
      globalErrorHandler.handleError(
        error as Error,
        'Notification Permission Request'
      );
      return 'denied';
    }
  },

  create: (title: string, options?: NotificationOptions): Notification | null => {
    if (!safeNotification.isSupported()) {
      console.warn('Notification API not supported');
      return null;
    }

    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    try {
      return new Notification(title, options);
    } catch (error) {
      globalErrorHandler.handleError(
        error as Error,
        'Notification Creation',
        { title, options }
      );
      return null;
    }
  }
};

/**
 * 安全的Storage API访问
 */
export const safeStorage = {
  // LocalStorage
  localStorage: {
    isSupported: (): boolean => {
      try {
        return isAPIAvailable('localStorage', window) && window.localStorage !== null;
      } catch {
        return false;
      }
    },

    getItem: (key: string): string | null => {
      if (!safeStorage.localStorage.isSupported()) {
        return null;
      }

      try {
        return localStorage.getItem(key);
      } catch (error) {
        globalErrorHandler.handleError(
          error as Error,
          'LocalStorage Get Item',
          { key }
        );
        return null;
      }
    },

    setItem: (key: string, value: string): boolean => {
      if (!safeStorage.localStorage.isSupported()) {
        return false;
      }

      try {
        localStorage.setItem(key, value);
        return true;
      } catch (error) {
        globalErrorHandler.handleError(
          error as Error,
          'LocalStorage Set Item',
          { key, value }
        );
        return false;
      }
    },

    removeItem: (key: string): boolean => {
      if (!safeStorage.localStorage.isSupported()) {
        return false;
      }

      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        globalErrorHandler.handleError(
          error as Error,
          'LocalStorage Remove Item',
          { key }
        );
        return false;
      }
    }
  },

  // SessionStorage
  sessionStorage: {
    isSupported: (): boolean => {
      try {
        return isAPIAvailable('sessionStorage', window) && window.sessionStorage !== null;
      } catch {
        return false;
      }
    },

    getItem: (key: string): string | null => {
      if (!safeStorage.sessionStorage.isSupported()) {
        return null;
      }

      try {
        return sessionStorage.getItem(key);
      } catch (error) {
        globalErrorHandler.handleError(
          error as Error,
          'SessionStorage Get Item',
          { key }
        );
        return null;
      }
    },

    setItem: (key: string, value: string): boolean => {
      if (!safeStorage.sessionStorage.isSupported()) {
        return false;
      }

      try {
        sessionStorage.setItem(key, value);
        return true;
      } catch (error) {
        globalErrorHandler.handleError(
          error as Error,
          'SessionStorage Set Item',
          { key, value }
        );
        return false;
      }
    },

    removeItem: (key: string): boolean => {
      if (!safeStorage.sessionStorage.isSupported()) {
        return false;
      }

      try {
        sessionStorage.removeItem(key);
        return true;
      } catch (error) {
        globalErrorHandler.handleError(
          error as Error,
          'SessionStorage Remove Item',
          { key }
        );
        return false;
      }
    }
  },

  // IndexedDB
  indexedDB: {
    isSupported: (): boolean => {
      return isAPIAvailable('indexedDB', window);
    },

    open: (name: string, version?: number): IDBOpenDBRequest | null => {
      if (!safeStorage.indexedDB.isSupported()) {
        console.warn('IndexedDB not supported');
        return null;
      }

      try {
        return indexedDB.open(name, version);
      } catch (error) {
        globalErrorHandler.handleError(
          error as Error,
          'IndexedDB Open',
          { name, version }
        );
        return null;
      }
    }
  }
};

/**
 * 安全的Fetch API访问
 */
export const safeFetch = {
  isSupported: (): boolean => {
    return isAPIAvailable('fetch', window);
  },

  fetch: async (input: RequestInfo | URL, init?: RequestInit): Promise<Response | null> => {
    if (!safeFetch.isSupported()) {
      console.warn('Fetch API not supported');
      return null;
    }

    try {
      return await fetch(input, init);
    } catch (error) {
      globalErrorHandler.handleError(
        error as Error,
        'Fetch Request',
        { input, init }
      );
      return null;
    }
  }
};

/**
 * 安全的Geolocation API访问
 */
export const safeGeolocation = {
  isSupported: (): boolean => {
    return isAPIAvailable('geolocation', navigator);
  },

  getCurrentPosition: (
    successCallback: PositionCallback,
    errorCallback?: PositionErrorCallback,
    options?: PositionOptions
  ): void => {
    if (!safeGeolocation.isSupported()) {
      console.warn('Geolocation API not supported');
      errorCallback?.({
        code: 0,
        message: 'Geolocation not supported',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3
      } as GeolocationPositionError);
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    } catch (error) {
      globalErrorHandler.handleError(
        error as Error,
        'Geolocation Get Current Position',
        { options }
      );
      errorCallback?.({
        code: 0,
        message: 'Geolocation error',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3
      } as GeolocationPositionError);
    }
  }
};

/**
 * 初始化浏览器API安全检查
 */
export const initializeBrowserAPIs = () => {
  // 检查关键API的可用性

  const results = {
    'Service Worker': safeServiceWorker.isSupported(),
    'Notification': safeNotification.isSupported(),
    'LocalStorage': safeStorage.localStorage.isSupported(),
    'SessionStorage': safeStorage.sessionStorage.isSupported(),
    'IndexedDB': safeStorage.indexedDB.isSupported(),
    'Fetch': safeFetch.isSupported(),
    'Geolocation': safeGeolocation.isSupported()
  };

  console.log('Browser API Availability:', results);

  // 为window对象添加安全的API访问器
  if (typeof window !== 'undefined') {
    (window as any).safeServiceWorker = safeServiceWorker;
    (window as any).safeNotification = safeNotification;
    (window as any).safeStorage = safeStorage;
    (window as any).safeFetch = safeFetch;
    (window as any).safeGeolocation = safeGeolocation;
  }

  return results;
};
