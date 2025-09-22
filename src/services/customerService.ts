// 顾客端专用服务层
import { FirebaseService } from './firebaseService';
import { Customer, CustomerProfile, CustomerPreferences, Event, EventRegistration, PointsTransaction, MarketplaceItem } from '@/types';
import { where, orderBy, limit } from 'firebase/firestore';

export class CustomerService extends FirebaseService {
  static readonly COLLECTION = 'customers';
  static readonly PROFILES_COLLECTION = 'customerProfiles';
  static readonly EVENTS_COLLECTION = 'events';
  static readonly REGISTRATIONS_COLLECTION = 'eventRegistrations';
  static readonly POINTS_COLLECTION = 'pointsTransactions';
  static readonly MARKETPLACE_COLLECTION = 'marketplaceItems';

  // ===== 顾客资料管理 =====

  /**
   * 从User创建Customer记录（用户注册时调用）
   */
  static async createCustomerFromUser(userId: string, firebaseUid: string, userData: {
    email: string;
    displayName: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }): Promise<string> {
    try {
      const customerData: Partial<Customer> = {
        userId,
        firebaseUid,
        email: userData.email,
        firstName: userData.firstName || userData.displayName.split(' ')[0] || 'Customer',
        lastName: userData.lastName || userData.displayName.split(' ').slice(1).join(' ') || '',
        phone: userData.phone,
        
        // Default customer business data
        tastePreferences: [],
        budgetRange: { min: 0, max: 1000 },
        giftOccasions: [],
        relationshipNotes: '',
        
        // Default loyalty data
        loyaltyTier: 'Silver',
        totalSpent: 0,
        totalPoints: 0,
        availablePoints: 0,
        memberSince: new Date(),
        
        // Status
        isActive: true,
        tags: ['new-customer']
      };

      return await this.create(this.COLLECTION, customerData);
    } catch (error) {
      console.error('Error creating customer from user:', error);
      throw error;
    }
  }

  /**
   * 获取顾客完整资料
   * @param customerId - Customer ID or User ID (for backward compatibility)
   */
  static async getCustomerProfile(customerId: string): Promise<Customer & { profile?: CustomerProfile } | null> {
    try {
      // First try to get customer by ID
      let customer = await this.getById(this.COLLECTION, customerId) as Customer;
      
      // If not found, try to find by userId (in case customerId is actually userId)
      if (!customer) {
        const customers = await this.getAll(this.COLLECTION, [
          where('userId', '==', customerId)
        ]) as Customer[];
        customer = customers[0] || null;
      }

      if (!customer) {
        return null;
      }

      // Get additional profile data if exists
      const profiles = await this.getAll(this.PROFILES_COLLECTION, [
        where('customerId', '==', customer.id)
      ]) as CustomerProfile[];
      const profile = profiles[0] || null;

      return { ...customer, profile };
    } catch (error) {
      console.error('Error getting customer profile:', error);
      throw error;
    }
  }

  /**
   * 更新顾客资料
   */
  static async updateCustomerProfile(customerId: string, updates: Partial<CustomerProfile>): Promise<void> {
    try {
      await this.update(this.PROFILES_COLLECTION, customerId, updates);
    } catch (error) {
      console.error('Error updating customer profile:', error);
      throw error;
    }
  }

  /**
   * 更新顾客偏好设置
   */
  static async updateCustomerPreferences(customerId: string, preferences: Partial<CustomerPreferences>): Promise<void> {
    try {
      await this.update(this.PROFILES_COLLECTION, customerId, {
        preferences
      } as any);
    } catch (error) {
      console.error('Error updating customer preferences:', error);
      throw error;
    }
  }

  // ===== 活动管理 =====

  /**
   * 获取即将到来的活动
   */
  static async getUpcomingEvents(limitCount: number = 10): Promise<Event[]> {
    try {
      const { Timestamp } = await import('firebase/firestore');
      return this.getAll(this.EVENTS_COLLECTION, [
        where('startDate', '>=', Timestamp.fromDate(new Date())),
        where('status', '==', 'published'),
        orderBy('startDate', 'asc'),
        limit(limitCount)
      ]) as Promise<Event[]>;
    } catch (error) {
      console.error('Error getting upcoming events:', error);
      throw error;
    }
  }

  /**
   * 获取活动详情
   */
  static async getEventDetails(eventId: string): Promise<Event | null> {
    try {
      return this.getById(this.EVENTS_COLLECTION, eventId) as Promise<Event | null>;
    } catch (error) {
      console.error('Error getting event details:', error);
      throw error;
    }
  }

  /**
   * 报名参加活动
   */
  static async registerForEvent(eventId: string, customerId: string): Promise<string> {
    try {
      // 检查是否已经报名
      const existingRegistrations = await this.getAll(this.REGISTRATIONS_COLLECTION, [
        where('eventId', '==', eventId),
        where('customerId', '==', customerId)
      ]);

      if (existingRegistrations.length > 0) {
        throw new Error('您已经报名了此活动');
      }

      // 获取活动信息检查容量
      const event = await this.getEventDetails(eventId);
      if (!event) {
        throw new Error('活动不存在');
      }

      if (event.currentAttendees >= event.maxAttendees) {
        throw new Error('活动已满员');
      }

      // 创建报名记录
      const registrationId = await this.create(this.REGISTRATIONS_COLLECTION, {
        eventId,
        customerId,
        status: 'registered',
        engagementScore: 0,
        networkingConnections: [],
        amountPaid: 0,
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: customerId,
        updatedBy: customerId
      });

      // 更新活动参与人数
      await this.update(this.EVENTS_COLLECTION, eventId, {
        currentAttendees: event.currentAttendees + 1,
        updatedAt: new Date()
      } as any);

      return registrationId;
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  }

  /**
   * 取消活动报名
   */
  static async cancelEventRegistration(registrationId: string): Promise<void> {
    try {
      const registration = await this.getById(this.REGISTRATIONS_COLLECTION, registrationId) as EventRegistration;
      if (!registration) {
        throw new Error('报名记录不存在');
      }

      // 更新报名状态
      await this.update(this.REGISTRATIONS_COLLECTION, registrationId, {
        status: 'cancelled',
        updatedAt: new Date()
      } as any);

      // 更新活动参与人数
      const event = await this.getEventDetails(registration.eventId);
      if (event) {
        await this.update(this.EVENTS_COLLECTION, registration.eventId, {
          currentAttendees: Math.max(0, event.currentAttendees - 1),
          updatedAt: new Date()
        } as any);
      }
    } catch (error) {
      console.error('Error cancelling event registration:', error);
      throw error;
    }
  }

  /**
   * 获取顾客的活动报名记录
   */
  static async getCustomerRegistrations(customerId: string): Promise<EventRegistration[]> {
    try {
      return this.getAll(this.REGISTRATIONS_COLLECTION, [
        where('customerId', '==', customerId),
        orderBy('createdAt', 'desc')
      ]) as Promise<EventRegistration[]>;
    } catch (error) {
      console.error('Error getting customer registrations:', error);
      throw error;
    }
  }

  // ===== 积分管理 =====

  /**
   * 获取顾客积分余额
   */
  static async getCustomerPoints(customerId: string): Promise<number> {
    try {
      // totalPoints is now in Customer, not CustomerProfile
      const customer = await this.getById(this.COLLECTION, customerId) as Customer;
      return customer?.totalPoints || 0;
    } catch (error) {
      console.error('Error getting customer points:', error);
      return 0;
    }
  }

  /**
   * 获取顾客积分交易记录
   */
  static async getCustomerPointsHistory(customerId: string, limitCount: number = 20): Promise<PointsTransaction[]> {
    try {
      return this.getAll(this.POINTS_COLLECTION, [
        where('customerId', '==', customerId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      ]) as Promise<PointsTransaction[]>;
    } catch (error) {
      console.error('Error getting customer points history:', error);
      throw error;
    }
  }

  /**
   * 添加积分
   */
  static async addPoints(customerId: string, points: number, source: string, description: string, referenceId?: string): Promise<void> {
    try {
      const currentPoints = await this.getCustomerPoints(customerId);
      const newTotal = currentPoints + points;

      // 创建积分交易记录
      await this.create(this.POINTS_COLLECTION, {
        customerId,
        type: 'earned',
        source,
        amount: points,
        balance: newTotal,
        description,
        referenceId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: customerId,
        updatedBy: customerId
      });

      // 更新顾客积分总额
      await this.update(this.PROFILES_COLLECTION, customerId, {
        totalPoints: newTotal,
        updatedAt: new Date()
      } as any);
    } catch (error) {
      console.error('Error adding points:', error);
      throw error;
    }
  }

  /**
   * 消费积分
   */
  static async spendPoints(customerId: string, points: number, source: string, description: string, referenceId?: string): Promise<void> {
    try {
      const currentPoints = await this.getCustomerPoints(customerId);
      if (currentPoints < points) {
        throw new Error('积分余额不足');
      }

      const newTotal = currentPoints - points;

      // 创建积分交易记录
      await this.create(this.POINTS_COLLECTION, {
        customerId,
        type: 'redeemed',
        source,
        amount: -points,
        balance: newTotal,
        description,
        referenceId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: customerId,
        updatedBy: customerId
      });

      // 更新顾客积分总额
      await this.update(this.PROFILES_COLLECTION, customerId, {
        totalPoints: newTotal,
        updatedAt: new Date()
      } as any);
    } catch (error) {
      console.error('Error spending points:', error);
      throw error;
    }
  }

  // ===== 商城管理 =====

  /**
   * 获取商城商品列表
   */
  static async getMarketplaceItems(category?: string): Promise<MarketplaceItem[]> {
    try {
      let whereConstraints = [where('isActive', '==', true)];
      
      if (category) {
        whereConstraints.push(where('category', '==', category));
      }
      
      const allConstraints = [...whereConstraints, orderBy('pointsCost', 'asc')];
      
      return this.getAll(this.MARKETPLACE_COLLECTION, allConstraints) as Promise<MarketplaceItem[]>;
    } catch (error) {
      console.error('Error getting marketplace items:', error);
      throw error;
    }
  }

  /**
   * 兑换商品
   */
  static async redeemItem(customerId: string, itemId: string): Promise<void> {
    try {
      const item = await this.getById(this.MARKETPLACE_COLLECTION, itemId) as MarketplaceItem;
      if (!item) {
        throw new Error('商品不存在');
      }

      if (!item.isActive) {
        throw new Error('商品已下架');
      }

      // 检查库存
      if (item.stockQuantity !== undefined && item.stockQuantity <= 0) {
        throw new Error('商品库存不足');
      }

      // 检查积分余额
      const currentPoints = await this.getCustomerPoints(customerId);
      if (currentPoints < item.pointsCost) {
        throw new Error('积分余额不足');
      }

      // 消费积分
      await this.spendPoints(customerId, item.pointsCost, 'marketplace', `兑换商品: ${item.name}`, itemId);

      // 更新商品库存
      if (item.stockQuantity !== undefined) {
        await this.update(this.MARKETPLACE_COLLECTION, itemId, {
          stockQuantity: item.stockQuantity - 1,
          updatedAt: new Date()
        } as any);
      }

      // 这里可以添加兑换记录到另一个集合
      await this.create('itemRedemptions', {
        customerId,
        itemId,
        itemName: item.name,
        pointsUsed: item.pointsCost,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: customerId,
        updatedBy: customerId
      });
    } catch (error) {
      console.error('Error redeeming item:', error);
      throw error;
    }
  }

  // ===== 推荐系统 =====

  /**
   * 生成推荐码
   */
  static async generateReferralCode(customerId: string): Promise<string> {
    try {
      const referralCode = `REF${customerId.slice(-6)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      await this.update(this.PROFILES_COLLECTION, customerId, {
        referralCode,
        updatedAt: new Date()
      } as any);

      return referralCode;
    } catch (error) {
      console.error('Error generating referral code:', error);
      throw error;
    }
  }

  /**
   * 使用推荐码
   */
  static async useReferralCode(customerId: string, referralCode: string): Promise<void> {
    try {
      // 查找推荐人
      const profiles = await this.getAll(this.PROFILES_COLLECTION, [
        where('referralCode', '==', referralCode)
      ]);

      if (profiles.length === 0) {
        throw new Error('推荐码无效');
      }

      const referrerProfile = profiles[0] as CustomerProfile;
      
      // 检查是否已经使用过推荐码
      // referralCode is now in Customer, not CustomerProfile
      const customer = await this.getById(this.COLLECTION, customerId) as Customer;
      if (customer?.referralCode) {
        throw new Error('您已经使用过推荐码');
      }

      // 奖励推荐人和被推荐人积分
      const referralBonus = 100; // 推荐奖励积分
      
      // 奖励推荐人
      await this.addPoints(referrerProfile.userId, referralBonus, 'referral', `推荐新用户奖励`, customerId);
      
      // 奖励被推荐人
      await this.addPoints(customerId, referralBonus, 'referral', `新用户推荐奖励`, referrerProfile.userId);

      // 记录推荐关系
      await this.create('referrals', {
        referrerId: referrerProfile.userId,
        refereeId: customerId,
        referralCode,
        status: 'converted',
        rewardStatus: 'awarded',
        pointsAwarded: referralBonus,
        conversionDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: customerId,
        updatedBy: customerId
      });
    } catch (error) {
      console.error('Error using referral code:', error);
      throw error;
    }
  }

  // ===== 数字名片 =====

  /**
   * 生成数字名片
   */
  static async generateDigitalCard(customerId: string): Promise<{ qrCode: string; cardUrl: string }> {
    try {
      const customer = await this.getCustomerProfile(customerId);
      if (!customer) {
        throw new Error('顾客信息不存在');
      }

      const cardUrl = `${window.location.origin}/card/${customerId}`;
      const qrCode = `data:image/png;base64,${await this.generateQRCode(cardUrl)}`;

      // 更新顾客资料
      await this.update(this.PROFILES_COLLECTION, customerId, {
        digitalCard: {
          qrCode,
          cardUrl,
          isActive: true
        },
        updatedAt: new Date()
      } as any);

      return { qrCode, cardUrl };
    } catch (error) {
      console.error('Error generating digital card:', error);
      throw error;
    }
  }

  /**
   * 生成二维码
   */
  private static async generateQRCode(_text: string): Promise<string> {
    // 这里应该集成二维码生成库，暂时返回空字符串
    return '';
  }

  // ===== 统计信息 =====

  /**
   * 获取顾客统计信息
   */
  static async getCustomerStats(customerId: string): Promise<{
    totalPoints: number;
    eventsAttended: number;
    referrals: number;
    totalSpent: number;
    memberSince: Date;
  }> {
    try {
      const customer = await this.getById(this.COLLECTION, customerId) as Customer;
      const registrations = await this.getCustomerRegistrations(customerId);
      const referrals = await this.getAll('referrals', [
        where('referrerId', '==', customerId)
      ]);

      return {
        // These properties are now in Customer, not CustomerProfile
        totalPoints: customer?.totalPoints || 0,
        eventsAttended: registrations.filter(r => r.status === 'checked-out').length,
        referrals: referrals.length,
        totalSpent: customer?.totalSpent || 0,
        memberSince: customer?.memberSince || customer?.createdAt || new Date()
      };
    } catch (error) {
      console.error('Error getting customer stats:', error);
      throw error;
    }
  }
}
