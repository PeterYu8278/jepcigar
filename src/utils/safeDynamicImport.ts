// 安全的动态导入工具
import React from 'react';
import { globalErrorHandler } from './errorHandler';

interface ImportResult<T> {
  success: boolean;
  module?: T;
  error?: Error;
  fallback?: T;
}

/**
 * 安全地动态导入模块，带有错误处理和重试机制
 */
export async function safeDynamicImport<T>(
  importFn: () => Promise<T>,
  options: {
    retries?: number;
    retryDelay?: number;
    fallback?: T;
    timeout?: number;
    context?: string;
  } = {}
): Promise<ImportResult<T>> {
  const {
    retries = 3,
    retryDelay = 1000,
    fallback,
    timeout = 10000,
    context = 'Dynamic Import'
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // 设置超时
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Import timeout after ${timeout}ms`)), timeout);
      });

      // 执行导入
      const module = await Promise.race([importFn(), timeoutPromise]);

      return {
        success: true,
        module
      };
    } catch (error) {
      lastError = error as Error;
      
      // 记录错误
      globalErrorHandler.handleError(
        lastError,
        `${context} - Attempt ${attempt + 1}/${retries + 1}`,
        { attempt, retries, timeout }
      );

      // 如果不是最后一次尝试，等待后重试
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }

  // 所有重试都失败了
  return {
    success: false,
    error: lastError,
    fallback
  };
}

/**
 * 创建带错误边界的动态导入组件
 */
export function createSafeLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    fallback?: React.ComponentType;
    errorBoundary?: React.ComponentType<{ error: Error; retry: () => void }>;
    context?: string;
  } = {}
): T {
  const {
    fallback: FallbackComponent,
    errorBoundary: ErrorBoundary,
    context = 'Lazy Component'
  } = options;

  const LazyComponent = React.lazy(async () => {
    const result = await safeDynamicImport(importFn, { context });
    
    if (result.success && result.module) {
      return result.module;
    }
    
    // 如果导入失败，返回错误组件
    if (FallbackComponent) {
      return { default: FallbackComponent };
    }
    
    // 默认错误组件
    const DefaultErrorComponent = () => {
      return React.createElement('div', { 
        style: { padding: 20, textAlign: 'center' } 
      }, [
        React.createElement('p', { key: 'error-text' }, '模块加载失败'),
        React.createElement('button', { 
          key: 'reload-btn',
          onClick: () => window.location.reload() 
        }, '刷新页面')
      ]);
    };
    
    return { default: DefaultErrorComponent as unknown as T };
  });

  // 包装错误边界
  if (ErrorBoundary) {
    const WrappedComponent = (props: any) => {
      return React.createElement(ErrorBoundary, null,
        React.createElement(LazyComponent, props)
      );
    };
    return WrappedComponent as T;
  }

  return LazyComponent as unknown as T;
}

/**
 * 预加载模块，带错误处理
 */
export async function preloadModule<T>(
  importFn: () => Promise<T>,
  options: {
    context?: string;
    onSuccess?: (module: T) => void;
    onError?: (error: Error) => void;
  } = {}
): Promise<boolean> {
  const { context = 'Module Preload', onSuccess, onError } = options;

  try {
    const result = await safeDynamicImport(importFn, { context });
    
    if (result.success && result.module) {
      onSuccess?.(result.module);
      return true;
    } else {
      onError?.(result.error!);
      return false;
    }
  } catch (error) {
    onError?.(error as Error);
    return false;
  }
}

/**
 * 批量预加载模块
 */
export async function preloadModules<T>(
  imports: Array<() => Promise<T>>,
  options: {
    context?: string;
    parallel?: boolean;
    onProgress?: (completed: number, total: number) => void;
  } = {}
): Promise<Array<{ success: boolean; module?: T; error?: Error }>> {
  const { context = 'Batch Module Preload', parallel = true, onProgress } = options;

  if (parallel) {
    // 并行加载
    const promises = imports.map((importFn, index) =>
      safeDynamicImport(importFn, { context: `${context} - Module ${index + 1}` })
    );

    const results = await Promise.allSettled(promises);
    
    return results.map(result => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          success: false,
          error: result.reason
        };
      }
    });
  } else {
    // 串行加载
    const results: Array<{ success: boolean; module?: T; error?: Error }> = [];
    
    for (let i = 0; i < imports.length; i++) {
      const result = await safeDynamicImport(imports[i], { 
        context: `${context} - Module ${i + 1}` 
      });
      results.push(result);
      onProgress?.(i + 1, imports.length);
    }
    
    return results;
  }
}