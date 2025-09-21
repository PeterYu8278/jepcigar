import { globalErrorHandler } from './errorHandler';

/**
 * 智能错误预防系统
 * 用于监控和预防PWA转化中的常见错误
 */
class SmartErrorPrevention {
  private errorPatterns: Map<string, ErrorPattern> = new Map();
  private preventionStrategies: Map<string, PreventionStrategy> = new Map();
  private monitoringEnabled: boolean = true;

  constructor() {
    this.initializeErrorPatterns();
    this.initializePreventionStrategies();
    this.setupMonitoring();
  }

  /**
   * 初始化错误模式识别
   */
  private initializeErrorPatterns(): void {
    // React相关错误模式
    this.errorPatterns.set('react-context-error', {
      pattern: /Cannot read properties of undefined \(reading 'createContext'\)/,
      severity: 'critical',
      category: 'react-initialization',
      description: 'React Context初始化错误'
    });

    this.errorPatterns.set('react-forwardref-error', {
      pattern: /Cannot read properties of undefined \(reading 'forwardRef'\)/,
      severity: 'critical',
      category: 'react-initialization',
      description: 'React forwardRef初始化错误'
    });

    this.errorPatterns.set('react-version-error', {
      pattern: /Cannot read properties of undefined \(reading 'version'\)/,
      severity: 'high',
      category: 'react-initialization',
      description: 'React版本访问错误'
    });

    // 模块初始化错误模式
    this.errorPatterns.set('module-initialization-error', {
      pattern: /Cannot access '(\w+)' before initialization/,
      severity: 'high',
      category: 'module-initialization',
      description: '模块初始化顺序错误'
    });

    this.errorPatterns.set('core-js-error', {
      pattern: /Cannot read properties of undefined \(reading '__core-js_shared__'\)/,
      severity: 'high',
      category: 'core-js',
      description: 'Core-js共享对象访问错误'
    });

    this.errorPatterns.set('object-define-error', {
      pattern: /Object.defineProperty called on non-object/,
      severity: 'high',
      category: 'object-initialization',
      description: '对象属性定义错误'
    });

    // 调度器相关错误
    this.errorPatterns.set('scheduler-error', {
      pattern: /Cannot set properties of undefined \(setting 'unstable_now'\)/,
      severity: 'critical',
      category: 'scheduler',
      description: 'React调度器初始化错误'
    });

    // 路由相关错误
    this.errorPatterns.set('router-error', {
      pattern: /Cannot read properties of undefined \(reading 'createContext'\).*react-router/,
      severity: 'critical',
      category: 'routing',
      description: 'React Router初始化错误'
    });

    // React DOM内部API错误
    this.errorPatterns.set('react-dom-internals-error', {
      pattern: /Cannot read properties of undefined \(reading '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED'\)/,
      severity: 'critical',
      category: 'react-dom',
      description: 'React DOM内部API访问错误'
    });

    // 类继承错误
    this.errorPatterns.set('class-extends-error', {
      pattern: /Class extends value undefined is not a constructor or null/,
      severity: 'critical',
      category: 'class-inheritance',
      description: '类继承错误，父类未正确初始化'
    });

    // 版本访问错误
    this.errorPatterns.set('version-access-error', {
      pattern: /Cannot read properties of undefined \(reading 'version'\)/,
      severity: 'critical',
      category: 'version-check',
      description: '版本检查错误，对象未正确初始化'
    });
  }

  /**
   * 初始化预防策略
   */
  private initializePreventionStrategies(): void {
    // React核心库合并策略
    this.preventionStrategies.set('react-core-merge', {
      name: 'React核心库合并',
      description: '将React核心库合并到同一个chunk中',
      implementation: 'vite.config.ts manualChunks',
      effectiveness: 'high'
    });

    // React DOM合并策略
    this.preventionStrategies.set('react-dom-merge', {
      name: 'React DOM合并',
      description: '将React DOM合并到React核心chunk中，确保使用同一个实例',
      implementation: 'vite.config.ts manualChunks',
      effectiveness: 'high'
    });

    // 第三方库合并策略
    this.preventionStrategies.set('third-party-merge', {
      name: '第三方库合并',
      description: '将关键的第三方库合并到React核心chunk，确保正确的初始化顺序',
      implementation: 'vite.config.ts manualChunks',
      effectiveness: 'high'
    });

    // 版本检查错误预防策略
    this.preventionStrategies.set('version-check-merge', {
      name: '版本检查库合并',
      description: '将包含版本检查的第三方库合并到React核心chunk，解决version访问错误',
      implementation: 'vite.config.ts manualChunks',
      effectiveness: 'high'
    });

    // 模块初始化顺序策略
    this.preventionStrategies.set('module-order', {
      name: '模块初始化顺序控制',
      description: '确保模块按正确顺序初始化',
      implementation: 'optimizeDeps.include',
      effectiveness: 'medium'
    });

    // 错误边界策略
    this.preventionStrategies.set('error-boundary', {
      name: '错误边界保护',
      description: '使用React错误边界捕获错误',
      implementation: 'ErrorBoundary组件',
      effectiveness: 'high'
    });

    // 全局错误处理策略
    this.preventionStrategies.set('global-error-handling', {
      name: '全局错误处理',
      description: '全局捕获和处理未处理的错误',
      implementation: 'window.addEventListener',
      effectiveness: 'high'
    });
  }

  /**
   * 设置监控
   */
  private setupMonitoring(): void {
    if (!this.monitoringEnabled) return;

    // 监控未处理的错误
    window.addEventListener('error', (event) => {
      this.analyzeError(event.error || new Error(event.message));
    });

    // 监控未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.analyzeError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
    });

    // 监控模块加载错误
    window.addEventListener('error', (event) => {
      if (event.target && (event.target as any).tagName === 'SCRIPT') {
        this.analyzeError(event.error || new Error('Module load error'));
      }
    });
  }

  /**
   * 分析错误
   */
  private analyzeError(error: Error): void {
    const errorMessage = error.message;
    const stack = error.stack || '';

    // 匹配错误模式
    for (const [patternId, pattern] of this.errorPatterns) {
      if (pattern.pattern.test(errorMessage)) {
        this.handleMatchedError(patternId, pattern, error, stack);
        return;
      }
    }

    // 如果没有匹配的模式，记录未知错误
    this.handleUnknownError(error);
  }

  /**
   * 处理匹配的错误
   */
  private handleMatchedError(
    patternId: string,
    pattern: ErrorPattern,
    error: Error,
    stack: string
  ): void {
    const errorInfo = {
      patternId,
      category: pattern.category,
      severity: pattern.severity,
      description: pattern.description,
      message: error.message,
      stack: stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // 记录错误信息
    console.error(`[SmartErrorPrevention] 检测到错误模式: ${patternId}`, errorInfo);

    // 根据严重程度采取不同措施
    switch (pattern.severity) {
      case 'critical':
        this.handleCriticalError(patternId, errorInfo);
        break;
      case 'high':
        this.handleHighSeverityError(patternId, errorInfo);
        break;
      case 'medium':
        this.handleMediumSeverityError(patternId, errorInfo);
        break;
      default:
        this.handleLowSeverityError(patternId, errorInfo);
    }

    // 发送到全局错误处理器
    globalErrorHandler.handleError(error, `SmartErrorPrevention: ${pattern.description}`, errorInfo);
  }

  /**
   * 处理关键错误
   */
  private handleCriticalError(patternId: string, errorInfo: any): void {
    console.error(`[SmartErrorPrevention] 关键错误: ${patternId}`, errorInfo);
    
    // 尝试自动修复
    this.attemptAutoFix(patternId);
    
    // 显示用户友好的错误信息
    this.showUserFriendlyError(patternId, errorInfo);
  }

  /**
   * 处理高严重性错误
   */
  private handleHighSeverityError(patternId: string, errorInfo: any): void {
    console.warn(`[SmartErrorPrevention] 高严重性错误: ${patternId}`, errorInfo);
    
    // 尝试自动修复
    this.attemptAutoFix(patternId);
  }

  /**
   * 处理中等严重性错误
   */
  private handleMediumSeverityError(patternId: string, errorInfo: any): void {
    console.info(`[SmartErrorPrevention] 中等严重性错误: ${patternId}`, errorInfo);
  }

  /**
   * 处理低严重性错误
   */
  private handleLowSeverityError(patternId: string, errorInfo: any): void {
    console.debug(`[SmartErrorPrevention] 低严重性错误: ${patternId}`, errorInfo);
  }

  /**
   * 处理未知错误
   */
  private handleUnknownError(error: Error): void {
    console.warn('[SmartErrorPrevention] 未知错误模式:', error);
    
    // 记录到错误统计中
    this.recordUnknownError(error);
  }

  /**
   * 尝试自动修复
   */
  private attemptAutoFix(patternId: string): void {
    let strategyId = patternId;
    
    // 根据错误模式映射到对应的策略
    if (patternId === 'react-dom-internals-error') {
      strategyId = 'react-dom-merge';
    } else if (patternId === 'react-context-error' || patternId === 'react-forwardref-error') {
      strategyId = 'react-core-merge';
    } else if (patternId === 'class-extends-error') {
      strategyId = 'third-party-merge';
    } else if (patternId === 'version-access-error') {
      strategyId = 'version-check-merge';
    }
    
    const strategy = this.preventionStrategies.get(strategyId);
    if (strategy) {
      console.info(`[SmartErrorPrevention] 尝试自动修复: ${strategy.name}`);
      // 这里可以实现具体的自动修复逻辑
      this.executeAutoFix(strategy);
    }
  }

  /**
   * 执行自动修复
   */
  private executeAutoFix(strategy: PreventionStrategy): void {
    switch (strategy.implementation) {
      case 'vite.config.ts manualChunks':
        console.info('[SmartErrorPrevention] 建议检查vite.config.ts中的chunk分割策略');
        break;
      case 'optimizeDeps.include':
        console.info('[SmartErrorPrevention] 建议检查optimizeDeps.include配置');
        break;
      case 'ErrorBoundary组件':
        console.info('[SmartErrorPrevention] 建议检查ErrorBoundary组件是否正确包装');
        break;
      case 'window.addEventListener':
        console.info('[SmartErrorPrevention] 建议检查全局错误处理是否正确设置');
        break;
    }
  }

  /**
   * 显示用户友好的错误信息
   */
  private showUserFriendlyError(patternId: string, _errorInfo: any): void {
    // 这里可以实现用户友好的错误提示
    console.info(`[SmartErrorPrevention] 显示用户友好错误信息: ${patternId}`);
  }

  /**
   * 记录未知错误
   */
  private recordUnknownError(error: Error): void {
    // 这里可以实现未知错误的记录逻辑
    console.debug('[SmartErrorPrevention] 记录未知错误:', error.message);
  }

  /**
   * 获取错误统计
   */
  public getErrorStatistics(): ErrorStatistics {
    // 这里可以实现错误统计逻辑
    return {
      totalErrors: 0,
      criticalErrors: 0,
      highSeverityErrors: 0,
      mediumSeverityErrors: 0,
      lowSeverityErrors: 0,
      unknownErrors: 0
    };
  }

  /**
   * 启用/禁用监控
   */
  public setMonitoringEnabled(enabled: boolean): void {
    this.monitoringEnabled = enabled;
    console.info(`[SmartErrorPrevention] 监控${enabled ? '已启用' : '已禁用'}`);
  }
}

// 类型定义
interface ErrorPattern {
  pattern: RegExp;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
}

interface PreventionStrategy {
  name: string;
  description: string;
  implementation: string;
  effectiveness: 'high' | 'medium' | 'low';
}

interface ErrorStatistics {
  totalErrors: number;
  criticalErrors: number;
  highSeverityErrors: number;
  mediumSeverityErrors: number;
  lowSeverityErrors: number;
  unknownErrors: number;
}

// 创建全局实例
export const smartErrorPrevention = new SmartErrorPrevention();

// 导出类型
export type { ErrorPattern, PreventionStrategy, ErrorStatistics };
