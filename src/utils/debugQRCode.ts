/**
 * 二维码调试工具
 * 用于检查和修复二维码显示问题
 */

import { CustomerService } from '@/services/firebaseService';
import { generateQRCodeData } from '@/utils';
import { Customer } from '@/types';

/**
 * 检查客户的二维码数据
 */
export async function checkCustomerQRCode(customerId: string): Promise<{
  hasQRCode: boolean;
  qrCodeData: string | null;
  cardUrl: string | null;
  isDataURL: boolean;
  isValidImage: boolean;
  error?: string;
}> {
  try {
    const customer = await CustomerService.getById<Customer>(
      CustomerService.COLLECTION, 
      customerId
    );

    if (!customer) {
      return {
        hasQRCode: false,
        qrCodeData: null,
        cardUrl: null,
        isDataURL: false,
        isValidImage: false,
        error: '客户不存在'
      };
    }

    const qrCodeData = customer.digitalCard?.qrCode;
    const cardUrl = customer.digitalCard?.cardUrl;

    return {
      hasQRCode: !!qrCodeData,
      qrCodeData,
      cardUrl,
      isDataURL: qrCodeData?.startsWith('data:image/') || false,
      isValidImage: qrCodeData?.startsWith('data:image/png;base64,') || false,
    };
  } catch (error) {
    return {
      hasQRCode: false,
      qrCodeData: null,
      cardUrl: null,
      isDataURL: false,
      isValidImage: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

/**
 * 重新生成客户的二维码
 */
export async function regenerateCustomerQRCode(customerId: string): Promise<{
  success: boolean;
  newQRCode?: string;
  error?: string;
}> {
  try {
    // 获取客户信息
    const customer = await CustomerService.getById<Customer>(
      CustomerService.COLLECTION, 
      customerId
    );

    if (!customer) {
      return {
        success: false,
        error: '客户不存在'
      };
    }

    // 重新生成二维码
    const cardUrl = customer.digitalCard?.cardUrl;
    if (!cardUrl) {
      return {
        success: false,
        error: '客户没有数字名片URL'
      };
    }

    const newQRCode = await generateQRCodeData(cardUrl);

    // 更新客户数据
    await CustomerService.update<Customer>(CustomerService.COLLECTION, customerId, {
      digitalCard: {
        ...customer.digitalCard,
        qrCode: newQRCode
      }
    });

    return {
      success: true,
      newQRCode
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '重新生成失败'
    };
  }
}

/**
 * 测试二维码生成功能
 */
export async function testQRCodeGeneration(): Promise<{
  success: boolean;
  testData?: string;
  error?: string;
}> {
  try {
    const testUrl = 'https://jepcigar.netlify.app/card/test-customer';
    const qrCodeData = await generateQRCodeData(testUrl);
    
    return {
      success: true,
      testData: qrCodeData
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '二维码生成失败'
    };
  }
}

/**
 * 检查所有客户的二维码状态
 */
export async function checkAllCustomersQRCode(): Promise<{
  total: number;
  withQRCode: number;
  withoutQRCode: number;
  invalidQRCode: number;
  customers: Array<{
    id: string;
    name: string;
    hasQRCode: boolean;
    isValidQRCode: boolean;
    cardUrl?: string;
  }>;
}> {
  try {
    const customers = await CustomerService.getAll<Customer>(CustomerService.COLLECTION);
    
    const result = {
      total: customers.length,
      withQRCode: 0,
      withoutQRCode: 0,
      invalidQRCode: 0,
      customers: [] as Array<{
        id: string;
        name: string;
        hasQRCode: boolean;
        isValidQRCode: boolean;
        cardUrl?: string;
      }>
    };

    for (const customer of customers) {
      const qrCodeData = customer.digitalCard?.qrCode;
      const hasQRCode = !!qrCodeData;
      const isValidQRCode = qrCodeData?.startsWith('data:image/png;base64,') || false;

      if (hasQRCode) {
        result.withQRCode++;
        if (!isValidQRCode) {
          result.invalidQRCode++;
        }
      } else {
        result.withoutQRCode++;
      }

      result.customers.push({
        id: customer.id,
        name: `${customer.firstName}${customer.lastName}`,
        hasQRCode,
        isValidQRCode,
        cardUrl: customer.digitalCard?.cardUrl
      });
    }

    return result;
  } catch (error) {
    throw new Error(`检查客户二维码状态失败: ${error}`);
  }
}

/**
 * 修复所有无效的二维码
 */
export async function fixAllInvalidQRCodes(): Promise<{
  success: boolean;
  fixed: number;
  failed: number;
  errors: string[];
}> {
  const result = {
    success: false,
    fixed: 0,
    failed: 0,
    errors: [] as string[]
  };

  try {
    const status = await checkAllCustomersQRCode();
    
    for (const customer of status.customers) {
      if (!customer.hasQRCode || !customer.isValidQRCode) {
        try {
          await regenerateCustomerQRCode(customer.id);
          result.fixed++;
          console.log(`✅ 修复客户 ${customer.name} 的二维码`);
        } catch (error) {
          result.failed++;
          const errorMsg = `修复客户 ${customer.name} 失败: ${error}`;
          result.errors.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
        }
      }
    }

    result.success = result.failed === 0;
    return result;
  } catch (error) {
    result.errors.push(`批量修复失败: ${error}`);
    return result;
  }
}
