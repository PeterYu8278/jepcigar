// 创建带有数字名片的测试客户数据
import { CustomerService } from '@/services/firebaseService';
import { Customer } from '@/types';
import { generateQRCodeData } from './index';
import { generateCardUrl } from '@/config/environment';

export const createTestCustomerWithDigitalCard = async () => {
  try {

    
    // 创建测试客户数据
    const testCustomerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'> = {
      userId: 'test-user-001',
      firebaseUid: 'test-firebase-001',
      firstName: '测试',
      lastName: '客户',
      email: 'test@example.com',
      phone: '+86 138 0000 0000',
      company: '测试公司',
      title: '测试职位',
      tastePreferences: [
        { category: 'strength', value: '中度', importance: 'high' },
        { category: 'flavor', value: '木香', importance: 'medium' },
        { category: 'origin', value: '古巴', importance: 'high' },
      ],
      budgetRange: { min: 1000, max: 5000 },
      giftOccasions: [
        { occasion: '商务礼品', frequency: 'annual' },
        { occasion: '节日祝福', frequency: 'seasonal' },
      ],
      referralSource: '测试创建',
      relationshipNotes: '这是一个测试客户，用于验证数字名片功能',
      lastContactDate: new Date(),
      loyaltyTier: 'Silver',
      totalSpent: 0,
      totalPoints: 0,
      availablePoints: 0,
      memberSince: new Date(),
      isActive: true,
      tags: ['测试', '数字名片'],
    };

    // 创建客户
    const customerId = await CustomerService.create(CustomerService.COLLECTION, testCustomerData);


    // 生成数字名片
    const cardUrl = generateCardUrl(customerId);
    const qrCode = await generateQRCodeData(cardUrl);

    // 更新客户数据，添加数字名片信息
    await CustomerService.update(CustomerService.COLLECTION, customerId, {
      digitalCard: {
        qrCode,
        cardUrl,
        isActive: true
      }
    } as Partial<Customer>);






    return {
      customerId,
      cardUrl,
      qrCode
    };

  } catch (error) {
    console.error('创建测试客户失败:', error);
    throw error;
  }
};

// 为现有客户生成数字名片
export const generateDigitalCardForExistingCustomer = async (customerId: string) => {
  try {

    
    // 获取客户信息
    const customer = await CustomerService.getById<Customer>(CustomerService.COLLECTION, customerId);
    if (!customer) {
      throw new Error('客户不存在');
    }

    // 生成数字名片
    const cardUrl = generateCardUrl(customerId);
    const qrCode = await generateQRCodeData(cardUrl);

    // 更新客户数据
    await CustomerService.update(CustomerService.COLLECTION, customerId, {
      digitalCard: {
        qrCode,
        cardUrl,
        isActive: true
      }
    } as Partial<Customer>);





    return {
      customerId,
      cardUrl,
      qrCode,
      customer
    };

  } catch (error) {
    console.error('生成数字名片失败:', error);
    throw error;
  }
};

// 列出所有客户及其数字名片状态
export const listCustomersWithDigitalCards = async () => {
  try {
    const customers = await CustomerService.getAll(CustomerService.COLLECTION) as Customer[];
    

    customers.forEach((customer, index) => {
      console.log(`${index + 1}. ${customer.firstName}${customer.lastName} (${customer.email})`);


      if (customer.digitalCard?.cardUrl) {

      }

    });

    return customers;
  } catch (error) {
    console.error('获取客户列表失败:', error);
    throw error;
  }
};

// 将函数添加到全局对象，方便在浏览器控制台中使用
if (typeof window !== 'undefined') {
  (window as any).createTestCustomerWithDigitalCard = createTestCustomerWithDigitalCard;
  (window as any).generateDigitalCardForExistingCustomer = generateDigitalCardForExistingCustomer;
  (window as any).listCustomersWithDigitalCards = listCustomersWithDigitalCards;
}
