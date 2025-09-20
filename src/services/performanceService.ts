// 性能监控服务
// 用于监控PWA的性能指标和用户体验

interface PerformanceMetrics {
  // 页面加载性能
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  
  // 应用性能
  appLoadTime?: number;
  routeChangeTime?: number;
  componentRenderTime?: number;
  
  // 资源加载
  resourceLoadTime?: Record<string, number>;
  bundleSize?: Record<string, number>;
  
  // 用户交互
  clickResponseTime?: number;
  scrollPerformance?: number;
  touchResponseTime?: number;
  
  // 网络性能
  networkLatency?: number;
  downloadSpeed?: number;
  offlineTime?: number;
  
  // PWA特有指标
  serviceWorkerInstallTime?: number;
  cacheHitRate?: number;
  pushNotificationResponseTime?: number;
}

interface UserExperienceMetrics {
  // 用户行为
  sessionDuration?: number;
  pageViews?: number;
  bounceRate?: number;
  userEngagement?: number;
  
  // 功能使用
  featureUsage?: Record<string, number>;
  errorRate?: number;
  crashRate?: number;
  
  // 设备信息
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  browserInfo?: string;
  connectionType?: string;
}

class PerformanceService {
  private metrics: PerformanceMetrics = {};
  private userMetrics: UserExperienceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  // 初始化性能监控
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // 监控Core Web Vitals
      this.observeCoreWebVitals();
      
      // 监控资源加载
      this.observeResourceLoading();
      
      // 监控长任务
      this.observeLongTasks();
      
      // 监控内存使用
      this.observeMemoryUsage();
      
      // 监控用户交互
      this.observeUserInteractions();
      
      // 收集初始性能数据
      this.collectInitialMetrics();
      
      this.isInitialized = true;
      console.log('[PerformanceService] Initialized successfully');
    } catch (error) {
      console.error('[PerformanceService] Initialization failed:', error);
    }
  }

  // 监控Core Web Vitals
  private observeCoreWebVitals(): void {
    // First Contentful Paint (FCP)
    if ('PerformanceObserver' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          this.metrics.fcp = fcpEntry.startTime;
          this.reportMetric('fcp', fcpEntry.startTime);
        }
      });
      
      try {
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(fcpObserver);
      } catch (error) {
        console.warn('[PerformanceService] FCP observer not supported');
      }
    }

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.metrics.lcp = lastEntry.startTime;
          this.reportMetric('lcp', lastEntry.startTime);
        }
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('[PerformanceService] LCP observer not supported');
      }
    }

    // Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.cls = clsValue;
        this.reportMetric('cls', clsValue);
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('[PerformanceService] CLS observer not supported');
      }
    }

    // First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.fid = (entry as any).processingStart - entry.startTime;
          this.reportMetric('fid', this.metrics.fid);
        }
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (error) {
        console.warn('[PerformanceService] FID observer not supported');
      }
    }
  }

  // 监控资源加载
  private observeResourceLoading(): void {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.metrics.resourceLoadTime = {};
        
        entries.forEach((entry: any) => {
          if (entry.duration) {
            this.metrics.resourceLoadTime![entry.name] = entry.duration;
          }
        });
      });
      
      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn('[PerformanceService] Resource observer not supported');
      }
    }
  }

  // 监控长任务
  private observeLongTasks(): void {
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // 长任务阈值50ms
            console.warn('[PerformanceService] Long task detected:', entry.duration + 'ms');
            this.reportMetric('longTask', entry.duration);
          }
        }
      });
      
      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (error) {
        console.warn('[PerformanceService] Long task observer not supported');
      }
    }
  }

  // 监控内存使用
  private observeMemoryUsage(): void {
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      setInterval(() => {
        const memoryMetrics = {
          usedJSHeapSize: memoryInfo.usedJSHeapSize,
          totalJSHeapSize: memoryInfo.totalJSHeapSize,
          jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
        };
        
        // 内存使用率
        const memoryUsageRatio = memoryMetrics.usedJSHeapSize / memoryMetrics.jsHeapSizeLimit;
        if (memoryUsageRatio > 0.8) {
          console.warn('[PerformanceService] High memory usage:', memoryUsageRatio);
          this.reportMetric('highMemoryUsage', memoryUsageRatio);
        }
      }, 30000); // 每30秒检查一次
    }
  }

  // 监控用户交互
  private observeUserInteractions(): void {
    let clickStartTime = 0;
    
    document.addEventListener('click', () => {
      clickStartTime = performance.now();
    }, true);
    
    document.addEventListener('click', () => {
      if (clickStartTime) {
        const clickResponseTime = performance.now() - clickStartTime;
        this.metrics.clickResponseTime = clickResponseTime;
        this.reportMetric('clickResponseTime', clickResponseTime);
        clickStartTime = 0;
      }
    }, true);

    // 监控滚动性能
    let scrollStartTime = 0;
    let scrollFrameCount = 0;
    
    const measureScrollPerformance = () => {
      scrollFrameCount++;
      if (performance.now() - scrollStartTime > 100) {
        const scrollPerformance = scrollFrameCount / ((performance.now() - scrollStartTime) / 1000);
        this.metrics.scrollPerformance = scrollPerformance;
        this.reportMetric('scrollPerformance', scrollPerformance);
        scrollStartTime = 0;
        scrollFrameCount = 0;
      }
    };

    let isScrolling = false;
    document.addEventListener('scroll', () => {
      if (!isScrolling) {
        isScrolling = true;
        scrollStartTime = performance.now();
        scrollFrameCount = 0;
        requestAnimationFrame(measureScrollPerformance);
      }
    });

    document.addEventListener('scrollend', () => {
      isScrolling = false;
    });
  }

  // 收集初始性能指标
  private collectInitialMetrics(): void {
    // 应用加载时间
    if (performance.timing) {
      const timing = performance.timing;
      this.metrics.appLoadTime = timing.loadEventEnd - timing.navigationStart;
      this.metrics.ttfb = timing.responseStart - timing.navigationStart;
    }

    // 收集用户代理信息
    this.userMetrics.deviceType = this.getDeviceType();
    this.userMetrics.browserInfo = navigator.userAgent;
    
    // 收集连接信息
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.userMetrics.connectionType = connection.effectiveType || 'unknown';
    }

    // 报告初始指标
    this.reportInitialMetrics();
  }

  // 获取设备类型
  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }

  // 报告指标到服务器或分析服务
  private reportMetric(name: string, value: number): void {
    // 这里可以集成Google Analytics、自建分析服务等
    console.log(`[PerformanceService] ${name}: ${value}`);
    
    // 示例：发送到自定义分析端点
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
        device_type: this.userMetrics.deviceType,
      });
    }
  }

  // 报告初始指标
  private reportInitialMetrics(): void {
    const initialMetrics = {
      ...this.metrics,
      ...this.userMetrics,
      timestamp: Date.now(),
    };

    console.log('[PerformanceService] Initial metrics:', initialMetrics);
  }

  // 测量组件渲染时间
  measureComponentRender(componentName: string, renderFn: () => void): void {
    const startTime = performance.now();
    renderFn();
    const endTime = performance.now();
    
    const renderTime = endTime - startTime;
    this.metrics.componentRenderTime = renderTime;
    
    if (renderTime > 16) { // 超过一帧的时间
      console.warn(`[PerformanceService] Slow component render: ${componentName} - ${renderTime}ms`);
    }
    
    this.reportMetric(`componentRender_${componentName}`, renderTime);
  }

  // 测量路由切换时间
  measureRouteChange(from: string, to: string, changeFn: () => void): void {
    const startTime = performance.now();
    changeFn();
    const endTime = performance.now();
    
    const changeTime = endTime - startTime;
    this.metrics.routeChangeTime = changeTime;
    
    this.reportMetric('routeChange', changeTime);
    console.log(`[PerformanceService] Route change: ${from} -> ${to} (${changeTime}ms)`);
  }

  // 获取当前性能指标
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // 获取用户体验指标
  getUserMetrics(): UserExperienceMetrics {
    return { ...this.userMetrics };
  }

  // 清理资源
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isInitialized = false;
  }

  // 检查性能预算
  checkPerformanceBudget(): { passed: boolean; violations: string[] } {
    const violations: string[] = [];
    
    if (this.metrics.fcp && this.metrics.fcp > 1800) {
      violations.push(`FCP too slow: ${this.metrics.fcp}ms (budget: 1800ms)`);
    }
    
    if (this.metrics.lcp && this.metrics.lcp > 2500) {
      violations.push(`LCP too slow: ${this.metrics.lcp}ms (budget: 2500ms)`);
    }
    
    if (this.metrics.fid && this.metrics.fid > 100) {
      violations.push(`FID too slow: ${this.metrics.fid}ms (budget: 100ms)`);
    }
    
    if (this.metrics.cls && this.metrics.cls > 0.1) {
      violations.push(`CLS too high: ${this.metrics.cls} (budget: 0.1)`);
    }
    
    return {
      passed: violations.length === 0,
      violations,
    };
  }
}

// 创建全局实例
export const performanceService = new PerformanceService();

// 导出类型
export type { PerformanceMetrics, UserExperienceMetrics };
export default PerformanceService;
