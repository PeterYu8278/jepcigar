/**
 * 测试环境配置的工具函数
 */
import { getEnvironmentConfig, getCurrentOrigin, generateCardUrl } from '@/config/environment';

export const testEnvironmentConfig = () => {
  console.log('=== 环境配置测试 ===');
  
  // 显示环境变量
  console.log('import.meta.env.DEV:', import.meta.env.DEV);
  console.log('import.meta.env.PROD:', import.meta.env.PROD);
  console.log('import.meta.env.VITE_APP_BASE_URL:', import.meta.env.VITE_APP_BASE_URL);
  console.log('window.location.origin:', typeof window !== 'undefined' ? window.location.origin : 'N/A');
  
  // 获取配置
  const config = getEnvironmentConfig();
  console.log('环境配置:', config);
  
  // 获取当前域名
  const origin = getCurrentOrigin();
  console.log('当前域名:', origin);
  
  // 生成测试URL
  const testCustomerId = 'test-customer-123';
  const cardUrl = generateCardUrl(testCustomerId);
  console.log('生成的卡片URL:', cardUrl);
  
  // 验证结果
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  const isValidDevUrl = isDevelopment && cardUrl.includes('localhost:3000');
  const isValidProdUrl = isProduction && cardUrl.includes('jepcigar.netlify.app');
  
  console.log('✅ 环境验证:');
  console.log('  - 开发环境:', isDevelopment);
  console.log('  - 生产环境:', isProduction);
  console.log('  - 开发域名正确:', isValidDevUrl);
  console.log('  - 生产域名正确:', isValidProdUrl);
  
  return {
    config,
    origin,
    cardUrl,
    isDevelopment,
    isProduction,
    isValidDevUrl,
    isValidProdUrl,
    envBaseUrl: import.meta.env.VITE_APP_BASE_URL,
    windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'N/A'
  };
};

// 在开发环境中自动运行测试（仅在需要时启用）
// if (import.meta.env.DEV) {
//   // 延迟执行，确保DOM加载完成
//   setTimeout(() => {
//     console.log('🔍 自动环境配置测试:');
//     testEnvironmentConfig();
//   }, 1000);
// }
