/**
 * 环境配置管理
 * 根据不同的部署环境自动获取正确的域名
 */

export interface EnvironmentConfig {
  baseUrl: string;
  apiUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isStaging: boolean;
}

/**
 * 获取环境配置
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  // 获取当前环境
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  
  // 从环境变量获取配置
  const envBaseUrl = import.meta.env.VITE_APP_BASE_URL;
  const envApiUrl = import.meta.env.VITE_APP_API_URL;
  
  // 获取当前域名
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  
  // 判断是否为测试环境
  const isStaging = currentOrigin.includes('staging') || 
                   currentOrigin.includes('test') || 
                   currentOrigin.includes('preview');
  
  // 确定基础URL - 根据环境自动选择
  let baseUrl: string;
  if (envBaseUrl) {
    // 如果设置了环境变量，优先使用
    baseUrl = envBaseUrl;
  } else {
    // 根据环境自动选择域名
    if (isDevelopment) {
      baseUrl = 'http://localhost:3000';
    } else if (isStaging) {
      baseUrl = 'https://staging.jepcigar.com';
    } else {
      // 生产环境使用Netlify域名
      baseUrl = 'https://jepcigar.netlify.app';
    }
  }
  
  // 确定API URL
  let apiUrl: string;
  if (envApiUrl) {
    // 如果设置了环境变量，优先使用
    apiUrl = envApiUrl;
  } else {
    // 根据环境自动选择API URL
    if (isDevelopment) {
      apiUrl = 'http://localhost:3000/api';
    } else if (isStaging) {
      apiUrl = 'https://staging.jepcigar.com/api';
    } else {
      // 生产环境使用Netlify域名
      apiUrl = 'https://jepcigar.netlify.app/api';
    }
  }
  
  return {
    baseUrl,
    apiUrl,
    isDevelopment,
    isProduction,
    isStaging,
  };
};

/**
 * 获取当前域名（安全版本）
 */
export const getCurrentOrigin = (): string => {
  const config = getEnvironmentConfig();
  
  // 始终使用配置的baseUrl，确保环境一致性
  return config.baseUrl;
};

/**
 * 生成卡片URL
 */
export const generateCardUrl = (customerId: string): string => {
  const origin = getCurrentOrigin();
  return `${origin}/card/${customerId}`;
};

/**
 * 生成API URL
 */
export const generateApiUrl = (endpoint: string): string => {
  const config = getEnvironmentConfig();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${config.apiUrl}/${cleanEndpoint}`;
};

// 导出默认配置
export const envConfig = getEnvironmentConfig();
