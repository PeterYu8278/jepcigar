/**
 * 更新所有现有客户数字名片URL的工具
 * 将旧的域名更新为新的环境配置域名
 */

import { CustomerService } from '@/services/firebaseService';
import { generateCardUrl } from '@/config/environment';
import { Customer } from '@/types';

interface UpdateResult {
  success: boolean;
  updated: number;
  failed: number;
  errors: string[];
}

/**
 * 更新所有客户的数字名片URL
 */
export async function updateAllCardUrls(): Promise<UpdateResult> {
  const result: UpdateResult = {
    success: false,
    updated: 0,
    failed: 0,
    errors: []
  };

  try {
    console.log('🔄 开始更新数字名片URL...');
    
    // 获取所有客户
    const customers = await CustomerService.getAll<Customer>(CustomerService.COLLECTION);
    console.log(`📊 找到 ${customers.length} 个客户`);

    // 过滤出有数字名片的客户
    const customersWithCards = customers.filter(customer => 
      customer.digitalCard?.isActive && customer.digitalCard?.cardUrl
    );
    
    console.log(`📱 其中 ${customersWithCards.length} 个客户有数字名片`);

    // 批量更新
    for (const customer of customersWithCards) {
      try {
        // 生成新的URL
        const newCardUrl = generateCardUrl(customer.id);
        
        // 检查是否需要更新
        if (customer.digitalCard?.cardUrl === newCardUrl) {
          console.log(`✅ 客户 ${customer.firstName}${customer.lastName} 的URL已是最新`);
          continue;
        }

        // 更新客户数字名片URL
        await CustomerService.update<Customer>(CustomerService.COLLECTION, customer.id, {
          digitalCard: {
            qrCode: customer.digitalCard?.qrCode || '',
            cardUrl: newCardUrl,
            isActive: customer.digitalCard?.isActive ?? true
          }
        });

        console.log(`✅ 更新客户 ${customer.firstName}${customer.lastName}:`);
        console.log(`   旧URL: ${customer.digitalCard?.cardUrl}`);
        console.log(`   新URL: ${newCardUrl}`);
        
        result.updated++;
      } catch (error) {
        const errorMsg = `更新客户 ${customer.firstName}${customer.lastName} 失败: ${error}`;
        console.error(`❌ ${errorMsg}`);
        result.errors.push(errorMsg);
        result.failed++;
      }
    }

    result.success = result.failed === 0;
    
    console.log(`\n🎉 更新完成:`);
    console.log(`   成功更新: ${result.updated} 个客户`);
    console.log(`   更新失败: ${result.failed} 个客户`);
    console.log(`   总体状态: ${result.success ? '✅ 成功' : '⚠️ 部分失败'}`);

    return result;
  } catch (error) {
    const errorMsg = `批量更新失败: ${error}`;
    console.error(`❌ ${errorMsg}`);
    result.errors.push(errorMsg);
    return result;
  }
}

/**
 * 检查当前环境配置
 */
export function checkEnvironmentConfig() {
  const config = {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    baseUrl: generateCardUrl('test-customer-id').replace('/card/test-customer-id', ''),
    windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'unknown'
  };

  console.log('🔍 当前环境配置:');
  console.log(`   开发环境: ${config.isDevelopment}`);
  console.log(`   生产环境: ${config.isProduction}`);
  console.log(`   配置域名: ${config.baseUrl}`);
  console.log(`   当前域名: ${config.windowOrigin}`);

  return config;
}

/**
 * 验证单个客户的URL
 */
export function validateCustomerCardUrl(customer: Customer): {
  isValid: boolean;
  currentUrl: string;
  expectedUrl: string;
  needsUpdate: boolean;
} {
  const currentUrl = customer.digitalCard?.cardUrl || '';
  const expectedUrl = generateCardUrl(customer.id);
  const needsUpdate = currentUrl !== expectedUrl && currentUrl !== '';

  return {
    isValid: currentUrl.includes('/card/') && currentUrl.endsWith(customer.id),
    currentUrl,
    expectedUrl,
    needsUpdate
  };
}

/**
 * 获取需要更新的客户列表
 */
export async function getCustomersNeedingUpdate(): Promise<Customer[]> {
  try {
    const customers = await CustomerService.getAll<Customer>(CustomerService.COLLECTION);
    return customers.filter(customer => {
      const validation = validateCustomerCardUrl(customer);
      return validation.needsUpdate;
    });
  } catch (error) {
    console.error('获取客户列表失败:', error);
    return [];
  }
}

// 在开发环境中自动运行检查
if (import.meta.env.DEV) {
  // 延迟执行，确保DOM加载完成
  setTimeout(() => {
    // 只在需要时输出配置检查信息
    const config = checkEnvironmentConfig();
    if (!config.isDevelopment) {
      console.log('🔧 开发环境自动检查数字名片URL配置');
      checkEnvironmentConfig();
    }
  }, 2000);
}
