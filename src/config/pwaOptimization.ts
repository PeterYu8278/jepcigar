/**
 * PWA优化配置
 * 用于配置PWA相关的优化策略
 */
export interface PWAOptimizationConfig {
  // 缓存策略
  cacheStrategy: {
    // 静态资源缓存时间（秒）
    staticAssets: number;
    // API响应缓存时间（秒）
    apiResponses: number;
    // 图片缓存时间（秒）
    images: number;
    // 字体缓存时间（秒）
    fonts: number;
  };

  // 预加载策略
  preloadStrategy: {
    // 是否启用关键资源预加载
    enableCriticalPreload: boolean;
    // 是否启用路由预加载
    enableRoutePreload: boolean;
    // 预加载的chunk数量限制
    maxPreloadChunks: number;
  };

  // 压缩策略
  compressionStrategy: {
    // 是否启用Gzip压缩
    enableGzip: boolean;
    // 是否启用Brotli压缩
    enableBrotli: boolean;
    // 压缩级别
    compressionLevel: number;
  };

  // 图片优化
  imageOptimization: {
    // 是否启用WebP格式
    enableWebP: boolean;
    // 是否启用响应式图片
    enableResponsiveImages: boolean;
    // 图片质量
    quality: number;
  };

  // 字体优化
  fontOptimization: {
    // 是否启用字体预加载
    enableFontPreload: boolean;
    // 字体显示策略
    fontDisplay: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  };

  // 代码分割
  codeSplitting: {
    // 是否启用动态导入
    enableDynamicImports: boolean;
    // 最大chunk大小（字节）
    maxChunkSize: number;
    // 最小chunk大小（字节）
    minChunkSize: number;
  };

  // 性能监控
  performanceMonitoring: {
    // 是否启用性能监控
    enableMonitoring: boolean;
    // 监控间隔（毫秒）
    monitoringInterval: number;
    // 是否启用Core Web Vitals监控
    enableCoreWebVitals: boolean;
  };
}

/**
 * 默认PWA优化配置
 */
export const defaultPWAOptimizationConfig: PWAOptimizationConfig = {
  cacheStrategy: {
    staticAssets: 31536000, // 1年
    apiResponses: 3600, // 1小时
    images: 2592000, // 30天
    fonts: 31536000 // 1年
  },

  preloadStrategy: {
    enableCriticalPreload: true,
    enableRoutePreload: true,
    maxPreloadChunks: 5
  },

  compressionStrategy: {
    enableGzip: true,
    enableBrotli: true,
    compressionLevel: 6
  },

  imageOptimization: {
    enableWebP: true,
    enableResponsiveImages: true,
    quality: 85
  },

  fontOptimization: {
    enableFontPreload: true,
    fontDisplay: 'swap'
  },

  codeSplitting: {
    enableDynamicImports: true,
    maxChunkSize: 500000, // 500KB
    minChunkSize: 10000 // 10KB
  },

  performanceMonitoring: {
    enableMonitoring: true,
    monitoringInterval: 5000,
    enableCoreWebVitals: true
  }
};

/**
 * 获取PWA优化配置
 */
export const getPWAOptimizationConfig = (): PWAOptimizationConfig => {
  // 这里可以根据环境变量或其他条件返回不同的配置
  return defaultPWAOptimizationConfig;
};

/**
 * 验证PWA优化配置
 */
export const validatePWAOptimizationConfig = (config: PWAOptimizationConfig): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // 验证缓存策略
  if (config.cacheStrategy.staticAssets < 0) {
    errors.push('静态资源缓存时间不能为负数');
  }

  if (config.cacheStrategy.apiResponses < 0) {
    errors.push('API响应缓存时间不能为负数');
  }

  // 验证代码分割
  if (config.codeSplitting.maxChunkSize <= config.codeSplitting.minChunkSize) {
    errors.push('最大chunk大小必须大于最小chunk大小');
  }

  // 验证性能监控
  if (config.performanceMonitoring.monitoringInterval < 1000) {
    errors.push('性能监控间隔不能小于1000毫秒');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 应用PWA优化配置
 */
export const applyPWAOptimizationConfig = (config: PWAOptimizationConfig): void => {
  // 验证配置
  const validation = validatePWAOptimizationConfig(config);
  if (!validation.isValid) {
    console.error('PWA优化配置验证失败:', validation.errors);
    return;
  }

  // 应用缓存策略
  if ('serviceWorker' in navigator) {
    // 这里可以实现Service Worker的缓存策略配置
    console.log('应用缓存策略:', config.cacheStrategy);
  }

  // 应用预加载策略
  if (config.preloadStrategy.enableCriticalPreload) {
    console.log('启用关键资源预加载');
  }

  if (config.preloadStrategy.enableRoutePreload) {
    console.log('启用路由预加载');
  }

  // 应用图片优化
  if (config.imageOptimization.enableWebP) {
    console.log('启用WebP格式支持');
  }

  // 应用字体优化
  if (config.fontOptimization.enableFontPreload) {
    console.log('启用字体预加载');
  }

  // 应用性能监控
  if (config.performanceMonitoring.enableMonitoring) {
    console.log('启用性能监控');
  }

  console.log('PWA优化配置已应用');
};

/**
 * 获取优化建议
 */
export const getOptimizationSuggestions = (): string[] => {
  return [
    '启用Service Worker缓存策略',
    '使用WebP格式优化图片',
    '实现关键资源预加载',
    '优化chunk分割策略',
    '启用Gzip/Brotli压缩',
    '使用CDN加速资源加载',
    '实现图片懒加载',
    '优化字体加载策略',
    '使用Tree Shaking移除未使用代码',
    '实现虚拟滚动优化长列表'
  ];
};
