/**
 * 性能监控和优化系统
 * 用于监控PWA性能指标并提供优化建议
 */
class PerformanceOptimizer {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private optimizationSuggestions: Map<string, OptimizationSuggestion> = new Map();
  private monitoringEnabled: boolean = true;

  constructor() {
    this.initializeMetrics();
    this.initializeOptimizationSuggestions();
    this.setupPerformanceMonitoring();
  }

  /**
   * 初始化性能指标
   */
  private initializeMetrics(): void {
    // 核心Web指标
    this.metrics.set('fcp', {
      name: 'First Contentful Paint',
      description: '首次内容绘制时间',
      target: 1800, // 1.8秒
      critical: 3000, // 3秒
      unit: 'ms'
    });

    this.metrics.set('lcp', {
      name: 'Largest Contentful Paint',
      description: '最大内容绘制时间',
      target: 2500, // 2.5秒
      critical: 4000, // 4秒
      unit: 'ms'
    });

    this.metrics.set('fid', {
      name: 'First Input Delay',
      description: '首次输入延迟',
      target: 100, // 100ms
      critical: 300, // 300ms
      unit: 'ms'
    });

    this.metrics.set('cls', {
      name: 'Cumulative Layout Shift',
      description: '累积布局偏移',
      target: 0.1, // 0.1
      critical: 0.25, // 0.25
      unit: 'score'
    });

    // 自定义指标
    this.metrics.set('chunk-load-time', {
      name: 'Chunk Load Time',
      description: 'Chunk加载时间',
      target: 1000, // 1秒
      critical: 3000, // 3秒
      unit: 'ms'
    });

    this.metrics.set('bundle-size', {
      name: 'Bundle Size',
      description: 'Bundle大小',
      target: 500000, // 500KB
      critical: 1000000, // 1MB
      unit: 'bytes'
    });
  }

  /**
   * 初始化优化建议
   */
  private initializeOptimizationSuggestions(): void {
    // Chunk大小优化
    this.optimizationSuggestions.set('chunk-size-optimization', {
      id: 'chunk-size-optimization',
      title: 'Chunk大小优化',
      description: '优化chunk分割策略，减少单个chunk大小',
      impact: 'high',
      effort: 'medium',
      suggestions: [
        '使用更精细的chunk分割策略',
        '将大型库拆分为更小的chunks',
        '实现动态导入和代码分割',
        '使用Tree Shaking移除未使用的代码'
      ]
    });

    // 加载性能优化
    this.optimizationSuggestions.set('loading-performance', {
      id: 'loading-performance',
      title: '加载性能优化',
      description: '优化资源加载性能',
      impact: 'high',
      effort: 'low',
      suggestions: [
        '启用资源预加载',
        '使用CDN加速资源加载',
        '实现资源压缩和缓存',
        '优化图片和字体加载'
      ]
    });

    // 运行时性能优化
    this.optimizationSuggestions.set('runtime-performance', {
      id: 'runtime-performance',
      title: '运行时性能优化',
      description: '优化应用运行时性能',
      impact: 'medium',
      effort: 'high',
      suggestions: [
        '使用React.memo优化组件渲染',
        '实现虚拟滚动优化长列表',
        '使用Web Workers处理重型任务',
        '优化状态管理和数据流'
      ]
    });
  }

  /**
   * 设置性能监控
   */
  private setupPerformanceMonitoring(): void {
    if (!this.monitoringEnabled) return;

    // 监控Core Web Vitals
    this.monitorCoreWebVitals();

    // 监控资源加载
    this.monitorResourceLoading();

    // 监控长任务
    this.monitorLongTasks();

    // 监控内存使用
    this.monitorMemoryUsage();
  }

  /**
   * 监控Core Web Vitals
   */
  private monitorCoreWebVitals(): void {
    // 监控FCP
    if ('PerformanceObserver' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.recordMetric('fcp', entry.startTime);
          }
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // 监控LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('lcp', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // 监控FID
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any; // 类型断言，因为PerformanceEntry没有processingStart属性
          if (fidEntry.processingStart) {
            this.recordMetric('fid', fidEntry.processingStart - fidEntry.startTime);
          }
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // 监控CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.recordMetric('cls', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  /**
   * 监控资源加载
   */
  private monitorResourceLoading(): void {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            const loadTime = resourceEntry.responseEnd - resourceEntry.startTime;
            
            // 监控chunk加载时间
            if (resourceEntry.name.includes('.js') && resourceEntry.name.includes('chunk')) {
              this.recordMetric('chunk-load-time', loadTime);
            }
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
    }
  }

  /**
   * 监控长任务
   */
  private monitorLongTasks(): void {
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // 50ms以上的任务
            // 只在开发环境且任务时间超过200ms时输出警告
            if (import.meta.env.DEV && entry.duration > 200) {
              console.warn(`[PerformanceOptimizer] 检测到长任务: ${entry.duration}ms`);
            }
            this.recordMetric('long-task', entry.duration);
          }
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
  }

  /**
   * 监控内存使用
   */
  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.recordMetric('memory-used', memory.usedJSHeapSize);
      this.recordMetric('memory-total', memory.totalJSHeapSize);
      this.recordMetric('memory-limit', memory.jsHeapSizeLimit);
    }
  }

  /**
   * 记录性能指标
   */
  private recordMetric(metricId: string, value: number): void {
    const metric = this.metrics.get(metricId);
    if (metric) {
      const performanceData = {
        value,
        timestamp: Date.now(),
        isTargetMet: value <= metric.target,
        isCritical: value > metric.critical
      };

      // 只在开发环境且性能不达标时输出日志
      if (import.meta.env.DEV && !performanceData.isTargetMet) {
        console.log(`[PerformanceOptimizer] ${metric.name}: ${value}${metric.unit}`, performanceData);
      }

      // 如果性能不达标，提供优化建议
      if (!performanceData.isTargetMet) {
        this.provideOptimizationSuggestions(metricId, value);
      }
    }
  }

  /**
   * 提供优化建议
   */
  private provideOptimizationSuggestions(metricId: string, value: number): void {
    const metric = this.metrics.get(metricId);
    if (!metric) return;

    console.warn(`[PerformanceOptimizer] ${metric.name}不达标: ${value}${metric.unit} > ${metric.target}${metric.unit}`);

    // 根据指标类型提供具体建议
    switch (metricId) {
      case 'fcp':
      case 'lcp':
        this.showLoadingOptimizationSuggestions();
        break;
      case 'fid':
        this.showInputOptimizationSuggestions();
        break;
      case 'cls':
        this.showLayoutOptimizationSuggestions();
        break;
      case 'chunk-load-time':
        this.showChunkOptimizationSuggestions();
        break;
      case 'bundle-size':
        this.showBundleOptimizationSuggestions();
        break;
    }
  }

  /**
   * 显示加载优化建议
   */
  private showLoadingOptimizationSuggestions(): void {
    const suggestion = this.optimizationSuggestions.get('loading-performance');
    if (suggestion) {
      console.info(`[PerformanceOptimizer] 加载性能优化建议:`, suggestion);
    }
  }

  /**
   * 显示输入优化建议
   */
  private showInputOptimizationSuggestions(): void {
    console.info('[PerformanceOptimizer] 输入延迟优化建议:');
    console.info('- 减少主线程阻塞任务');
    console.info('- 使用Web Workers处理重型计算');
    console.info('- 优化事件处理逻辑');
  }

  /**
   * 显示布局优化建议
   */
  private showLayoutOptimizationSuggestions(): void {
    console.info('[PerformanceOptimizer] 布局偏移优化建议:');
    console.info('- 为图片和广告预留空间');
    console.info('- 避免动态插入内容');
    console.info('- 使用CSS aspect-ratio');
  }

  /**
   * 显示Chunk优化建议
   */
  private showChunkOptimizationSuggestions(): void {
    const suggestion = this.optimizationSuggestions.get('chunk-size-optimization');
    if (suggestion) {
      console.info(`[PerformanceOptimizer] Chunk优化建议:`, suggestion);
    }
  }

  /**
   * 显示Bundle优化建议
   */
  private showBundleOptimizationSuggestions(): void {
    const suggestion = this.optimizationSuggestions.get('chunk-size-optimization');
    if (suggestion) {
      console.info(`[PerformanceOptimizer] Bundle优化建议:`, suggestion);
    }
  }

  /**
   * 获取性能报告
   */
  public getPerformanceReport(): PerformanceReport {
    const report: PerformanceReport = {
      timestamp: new Date().toISOString(),
      metrics: {},
      suggestions: [],
      overallScore: 0
    };

    // 收集所有指标
    for (const [metricId, metric] of this.metrics) {
      report.metrics[metricId] = {
        name: metric.name,
        description: metric.description,
        target: metric.target,
        critical: metric.critical,
        unit: metric.unit
      };
    }

    // 收集优化建议
    for (const [, suggestion] of this.optimizationSuggestions) {
      report.suggestions.push(suggestion);
    }

    // 计算总体分数
    report.overallScore = this.calculateOverallScore();

    return report;
  }

  /**
   * 计算总体分数
   */
  private calculateOverallScore(): number {
    // 这里可以实现更复杂的评分算法
    return 85; // 示例分数
  }

  /**
   * 启用/禁用监控
   */
  public setMonitoringEnabled(enabled: boolean): void {
    this.monitoringEnabled = enabled;
    console.info(`[PerformanceOptimizer] 性能监控${enabled ? '已启用' : '已禁用'}`);
  }
}

// 类型定义
interface PerformanceMetric {
  name: string;
  description: string;
  target: number;
  critical: number;
  unit: string;
}

interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  suggestions: string[];
}

interface PerformanceReport {
  timestamp: string;
  metrics: Record<string, PerformanceMetric>;
  suggestions: OptimizationSuggestion[];
  overallScore: number;
}

// 创建全局实例
export const performanceOptimizer = new PerformanceOptimizer();

// 导出类型
export type { PerformanceMetric, OptimizationSuggestion, PerformanceReport };
