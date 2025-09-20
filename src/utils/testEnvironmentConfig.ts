/**
 * 环境配置测试工具
 * 用于验证不同环境下的域名获取是否正确
 */

import { getCurrentOrigin, generateCardUrl, envConfig } from '@/config/environment';

/**
 * 测试环境配置
 */
export const testEnvironmentConfig = () => {
  console.log('=== 环境配置测试 ===');
  
  // 显示当前环境配置
  console.log('环境配置:', envConfig);
  
  // 测试域名获取
  const origin = getCurrentOrigin();
  console.log('当前域名:', origin);
  
  // 测试卡片URL生成
  const testCustomerId = 'test-customer-123';
  const cardUrl = generateCardUrl(testCustomerId);
  console.log('生成的卡片URL:', cardUrl);
  
  // 测试不同环境下的URL
  console.log('\n=== 不同环境测试 ===');
  
  // 模拟不同环境
  const testEnvironments = [
    { name: '开发环境', baseUrl: 'http://localhost:3000' },
    { name: '测试环境', baseUrl: 'https://staging.jepcigar.com' },
    { name: '生产环境', baseUrl: 'https://jepcigar.netlify.app' },
  ];
  
  testEnvironments.forEach(env => {
    const testCardUrl = `${env.baseUrl}/card/${testCustomerId}`;
    console.log(`${env.name}: ${testCardUrl}`);
  });
  
  return {
    currentOrigin: origin,
    cardUrl,
    config: envConfig,
  };
};

/**
 * 验证卡片URL格式
 */
export const validateCardUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.startsWith('/card/');
  } catch {
    return false;
  }
};

/**
 * 获取环境信息
 */
export const getEnvironmentInfo = () => {
  return {
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'Server',
    protocol: typeof window !== 'undefined' ? window.location.protocol : 'Server',
    port: typeof window !== 'undefined' ? window.location.port : 'Server',
    origin: getCurrentOrigin(),
    isClient: typeof window !== 'undefined',
  };
};
