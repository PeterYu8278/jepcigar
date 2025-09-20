// 全局变量安全访问工具
import { globalErrorHandler } from './errorHandler';

/**
 * 安全地访问全局变量，带错误处理
 */
export function safeGlobalAccess<T>(
  accessor: () => T,
  fallback: T,
  context?: string
): T {
  try {
    const result = accessor();
    return result !== undefined && result !== null ? result : fallback;
  } catch (error) {
    globalErrorHandler.handleError(
      error as Error,
      `Global Variable Access - ${context || 'Unknown'}`,
      { accessor: accessor.toString() }
    );
    return fallback;
  }
}

/**
 * 安全地设置全局变量
 */
export function safeGlobalSet<T>(
  setter: (value: T) => void,
  value: T,
  context?: string
): boolean {
  try {
    setter(value);
    return true;
  } catch (error) {
    globalErrorHandler.handleError(
      error as Error,
      `Global Variable Set - ${context || 'Unknown'}`,
      { value, setter: setter.toString() }
    );
    return false;
  }
}

/**
 * 检查全局变量是否存在
 */
export function safeGlobalCheck(
  checker: () => boolean,
  context?: string
): boolean {
  try {
    return checker();
  } catch (error) {
    globalErrorHandler.handleError(
      error as Error,
      `Global Variable Check - ${context || 'Unknown'}`,
      { checker: checker.toString() }
    );
    return false;
  }
}

/**
 * 安全的window对象访问
 */
export const safeWindow = {
  get: <T>(key: string, fallback: T, context?: string): T => {
    return safeGlobalAccess(
      () => (window as any)[key],
      fallback,
      `window.${key} - ${context || 'Unknown'}`
    );
  },

  set: <T>(key: string, value: T, context?: string): boolean => {
    return safeGlobalSet(
      (val: T) => { (window as any)[key] = val; },
      value,
      `window.${key} - ${context || 'Unknown'}`
    );
  },

  has: (key: string, context?: string): boolean => {
    return safeGlobalCheck(
      () => key in window,
      `window.has(${key}) - ${context || 'Unknown'}`
    );
  }
};

/**
 * 安全的localStorage访问
 */
export const safeLocalStorage = {
  get: (key: string, fallback: string = '', context?: string): string => {
    return safeGlobalAccess(
      () => localStorage.getItem(key) || fallback,
      fallback,
      `localStorage.getItem(${key}) - ${context || 'Unknown'}`
    );
  },

  set: (key: string, value: string, context?: string): boolean => {
    return safeGlobalSet(
      (val: string) => localStorage.setItem(key, val),
      value,
      `localStorage.setItem(${key}) - ${context || 'Unknown'}`
    );
  },

  remove: (key: string, context?: string): boolean => {
    return safeGlobalSet(
      () => localStorage.removeItem(key),
      undefined,
      `localStorage.removeItem(${key}) - ${context || 'Unknown'}`
    );
  },

  clear: (context?: string): boolean => {
    return safeGlobalSet(
      () => localStorage.clear(),
      undefined,
      `localStorage.clear() - ${context || 'Unknown'}`
    );
  }
};

/**
 * 安全的sessionStorage访问
 */
export const safeSessionStorage = {
  get: (key: string, fallback: string = '', context?: string): string => {
    return safeGlobalAccess(
      () => sessionStorage.getItem(key) || fallback,
      fallback,
      `sessionStorage.getItem(${key}) - ${context || 'Unknown'}`
    );
  },

  set: (key: string, value: string, context?: string): boolean => {
    return safeGlobalSet(
      (val: string) => sessionStorage.setItem(key, val),
      value,
      `sessionStorage.setItem(${key}) - ${context || 'Unknown'}`
    );
  },

  remove: (key: string, context?: string): boolean => {
    return safeGlobalSet(
      () => sessionStorage.removeItem(key),
      undefined,
      `sessionStorage.removeItem(${key}) - ${context || 'Unknown'}`
    );
  },

  clear: (context?: string): boolean => {
    return safeGlobalSet(
      () => sessionStorage.clear(),
      undefined,
      `sessionStorage.clear() - ${context || 'Unknown'}`
    );
  }
};

/**
 * 安全的navigator访问
 */
export const safeNavigator = {
  get: <T>(key: string, fallback: T, context?: string): T => {
    return safeGlobalAccess(
      () => (navigator as any)[key],
      fallback,
      `navigator.${key} - ${context || 'Unknown'}`
    );
  },

  has: (key: string, context?: string): boolean => {
    return safeGlobalCheck(
      () => key in navigator,
      `navigator.has(${key}) - ${context || 'Unknown'}`
    );
  },

  // 常用属性访问
  userAgent: (context?: string): string => {
    return safeNavigator.get('userAgent', '', context);
  },

  language: (context?: string): string => {
    return safeNavigator.get('language', 'en-US', context);
  },

  onLine: (context?: string): boolean => {
    return safeNavigator.get('onLine', true, context);
  }
};

/**
 * 安全的document访问
 */
export const safeDocument = {
  get: <T>(key: string, fallback: T, context?: string): T => {
    return safeGlobalAccess(
      () => (document as any)[key],
      fallback,
      `document.${key} - ${context || 'Unknown'}`
    );
  },

  has: (key: string, context?: string): boolean => {
    return safeGlobalCheck(
      () => key in document,
      `document.has(${key}) - ${context || 'Unknown'}`
    );
  },

  // 常用方法访问
  getElementById: (id: string, context?: string): HTMLElement | null => {
    return safeGlobalAccess(
      () => document.getElementById(id),
      null,
      `document.getElementById(${id}) - ${context || 'Unknown'}`
    );
  },

  querySelector: (selector: string, context?: string): Element | null => {
    return safeGlobalAccess(
      () => document.querySelector(selector),
      null,
      `document.querySelector(${selector}) - ${context || 'Unknown'}`
    );
  }
};

/**
 * 初始化全局变量安全访问
 */
export const initializeGlobalAccess = () => {
  // 为window对象添加安全的全局函数
  safeWindow.set('safeGlobalAccess', safeGlobalAccess, 'Initialize');
  safeWindow.set('safeLocalStorage', safeLocalStorage, 'Initialize');
  safeWindow.set('safeSessionStorage', safeSessionStorage, 'Initialize');
  safeWindow.set('safeNavigator', safeNavigator, 'Initialize');
  safeWindow.set('safeDocument', safeDocument, 'Initialize');
  
  console.log('Global access safety initialized');
};
