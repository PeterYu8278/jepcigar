// 全局错误处理工具
export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorQueue: Array<{ error: Error; timestamp: number; context?: string }> = [];
  private maxQueueSize = 100;

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  private setupGlobalErrorHandlers() {
    // 捕获未处理的JavaScript错误
    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'JavaScript Error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // 捕获未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        'Promise Rejection',
        { reason: event.reason }
      );
    });

    // 捕获资源加载错误
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleError(
          new Error(`Resource Load Error: ${event.target}`),
          'Resource Load Error',
          { target: event.target }
        );
      }
    }, true);
  }

  public handleError(error: Error, context?: string, metadata?: any) {
    // 过滤浏览器扩展错误
    if (this.isBrowserExtensionError(error)) {
      return;
    }

    const errorEntry = {
      error,
      timestamp: Date.now(),
      context
    };

    // 添加到错误队列
    this.errorQueue.push(errorEntry);
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift(); // 移除最旧的错误
    }

    // 记录错误
    console.error(`[${context || 'Unknown'}]`, error, metadata);

    // 发送到错误监控服务
    this.reportError(error, context, metadata);
  }

  /**
   * 检查是否为浏览器扩展错误
   */
  private isBrowserExtensionError(error: Error): boolean {
    const message = error.message || '';
    
    // 常见的浏览器扩展错误模式
    const extensionErrorPatterns = [
      'runtime.lastError',
      'message port closed',
      'Extension context invalidated',
      'Receiving end does not exist',
      'Could not establish connection'
    ];

    return extensionErrorPatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  private async reportError(error: Error, context?: string, metadata?: any) {
    try {
      // 这里可以集成实际的错误监控服务
      // 例如：Sentry, LogRocket, Bugsnag等
      
      const errorReport = {
        message: error.message,
        stack: error.stack,
        context,
        metadata,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.getCurrentUserId()
      };

      // 示例：发送到错误监控服务
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // });

      console.log('Error reported:', errorReport);
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  }

  private getCurrentUserId(): string | null {
    // 从localStorage或其他地方获取当前用户ID
    try {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.state?.user?.uid || null;
      }
    } catch (error) {
      // 忽略解析错误
    }
    return null;
  }

  public getErrorHistory(): Array<{ error: Error; timestamp: number; context?: string }> {
    return [...this.errorQueue];
  }

  public clearErrorHistory() {
    this.errorQueue = [];
  }

  // 检查是否是已知的错误模式
  public isKnownError(error: Error): boolean {
    const knownPatterns = [
      /Cannot read properties of undefined \(reading 'version'\)/,
      /Cannot access '.*' before initialization/,
      /Cannot read properties of undefined \(reading 'createContext'\)/,
      /Cannot read properties of undefined \(reading 'forwardRef'\)/
    ];

    return knownPatterns.some(pattern => pattern.test(error.message));
  }

  // 获取错误建议
  public getErrorSuggestion(error: Error): string {
    if (this.isKnownError(error)) {
      return '这是一个已知的模块初始化错误，通常由chunk分割问题引起。建议刷新页面或联系技术支持。';
    }

    if (error.message.includes('Network')) {
      return '网络连接问题，请检查您的网络连接。';
    }

    if (error.message.includes('Firebase')) {
      return 'Firebase服务问题，请稍后重试。';
    }

    return '未知错误，请联系技术支持。';
  }
}

// 导出单例实例
export const globalErrorHandler = GlobalErrorHandler.getInstance();

// 初始化全局错误处理
export const initializeErrorHandling = () => {
  globalErrorHandler;
  console.log('Global error handling initialized');
};
