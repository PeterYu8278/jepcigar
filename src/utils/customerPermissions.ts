// 顾客端权限控制系统
import { User } from '@/types';

export interface CustomerPermission {
  id: string;
  name: string;
  description: string;
  category: 'profile' | 'events' | 'marketplace' | 'social' | 'system';
}

export interface CustomerRolePermissions {
  role: string;
  permissions: CustomerPermission[];
  restrictions: string[];
}

// 权限定义
export const CUSTOMER_PERMISSIONS: Record<string, CustomerPermission> = {
  // 个人资料权限
  'profile:view': {
    id: 'profile:view',
    name: '查看个人资料',
    description: '查看自己的个人资料信息',
    category: 'profile'
  },
  'profile:edit': {
    id: 'profile:edit',
    name: '编辑个人资料',
    description: '修改个人资料信息',
    category: 'profile'
  },
  'profile:delete': {
    id: 'profile:delete',
    name: '删除个人资料',
    description: '删除自己的账户',
    category: 'profile'
  },

  // 活动权限
  'events:view': {
    id: 'events:view',
    name: '查看活动',
    description: '浏览和查看活动信息',
    category: 'events'
  },
  'events:register': {
    id: 'events:register',
    name: '报名活动',
    description: '报名参加活动',
    category: 'events'
  },
  'events:cancel': {
    id: 'events:cancel',
    name: '取消报名',
    description: '取消已报名的活动',
    category: 'events'
  },
  'events:rate': {
    id: 'events:rate',
    name: '评价活动',
    description: '对参加过的活动进行评价',
    category: 'events'
  },

  // 商城权限
  'marketplace:view': {
    id: 'marketplace:view',
    name: '查看商城',
    description: '浏览积分商城商品',
    category: 'marketplace'
  },
  'marketplace:purchase': {
    id: 'marketplace:purchase',
    name: '购买商品',
    description: '使用积分购买商品',
    category: 'marketplace'
  },
  'marketplace:redeem': {
    id: 'marketplace:redeem',
    name: '兑换奖品',
    description: '兑换抽奖奖品',
    category: 'marketplace'
  },

  // 社交权限
  'social:view': {
    id: 'social:view',
    name: '查看社交',
    description: '查看其他用户的公开信息',
    category: 'social'
  },
  'social:connect': {
    id: 'social:connect',
    name: '建立连接',
    description: '与其他用户建立社交连接',
    category: 'social'
  },
  'social:share': {
    id: 'social:share',
    name: '分享内容',
    description: '分享活动和商品信息',
    category: 'social'
  },
  'social:refer': {
    id: 'social:refer',
    name: '推荐好友',
    description: '推荐新用户注册',
    category: 'social'
  },

  // 系统权限
  'system:notifications': {
    id: 'system:notifications',
    name: '接收通知',
    description: '接收系统通知和推送',
    category: 'system'
  },
  'system:feedback': {
    id: 'system:feedback',
    name: '提交反馈',
    description: '向系统提交反馈和建议',
    category: 'system'
  },
  'system:help': {
    id: 'system:help',
    name: '获取帮助',
    description: '访问帮助文档和客服',
    category: 'system'
  }
};

// 角色权限配置
export const CUSTOMER_ROLE_PERMISSIONS: Record<string, CustomerRolePermissions> = {
  customer: {
    role: 'customer',
    permissions: [
      CUSTOMER_PERMISSIONS['profile:view'],
      CUSTOMER_PERMISSIONS['profile:edit'],
      CUSTOMER_PERMISSIONS['events:view'],
      CUSTOMER_PERMISSIONS['events:register'],
      CUSTOMER_PERMISSIONS['events:cancel'],
      CUSTOMER_PERMISSIONS['events:rate'],
      CUSTOMER_PERMISSIONS['marketplace:view'],
      CUSTOMER_PERMISSIONS['marketplace:purchase'],
      CUSTOMER_PERMISSIONS['marketplace:redeem'],
      CUSTOMER_PERMISSIONS['social:view'],
      CUSTOMER_PERMISSIONS['social:connect'],
      CUSTOMER_PERMISSIONS['social:share'],
      CUSTOMER_PERMISSIONS['social:refer'],
      CUSTOMER_PERMISSIONS['system:notifications'],
      CUSTOMER_PERMISSIONS['system:feedback'],
      CUSTOMER_PERMISSIONS['system:help']
    ],
    restrictions: [
      'profile:delete' // 普通顾客不能删除账户，需要联系客服
    ]
  },
  vip: {
    role: 'vip',
    permissions: [
      ...CUSTOMER_ROLE_PERMISSIONS.customer.permissions,
      // VIP额外权限可以在这里添加
    ],
    restrictions: []
  },
  staff: {
    role: 'staff',
    permissions: [
      ...CUSTOMER_ROLE_PERMISSIONS.customer.permissions,
      // 员工权限可以在这里添加
    ],
    restrictions: []
  },
  manager: {
    role: 'manager',
    permissions: [
      ...CUSTOMER_ROLE_PERMISSIONS.customer.permissions,
      // 管理员权限可以在这里添加
    ],
    restrictions: []
  },
  admin: {
    role: 'admin',
    permissions: Object.values(CUSTOMER_PERMISSIONS), // 管理员拥有所有权限
    restrictions: []
  }
};

// 权限检查工具类
export class CustomerPermissionManager {
  /**
   * 检查用户是否具有特定权限
   */
  static hasPermission(user: User, permissionId: string): boolean {
    if (!user || !user.role) {
      return false;
    }

    const rolePermissions = CUSTOMER_ROLE_PERMISSIONS[user.role];
    if (!rolePermissions) {
      return false;
    }

    // 检查是否在限制列表中
    if (rolePermissions.restrictions.includes(permissionId)) {
      return false;
    }

    // 检查是否在权限列表中
    return rolePermissions.permissions.some(permission => permission.id === permissionId);
  }

  /**
   * 检查用户是否具有多个权限中的任意一个
   */
  static hasAnyPermission(user: User, permissionIds: string[]): boolean {
    return permissionIds.some(permissionId => this.hasPermission(user, permissionId));
  }

  /**
   * 检查用户是否具有所有指定权限
   */
  static hasAllPermissions(user: User, permissionIds: string[]): boolean {
    return permissionIds.every(permissionId => this.hasPermission(user, permissionId));
  }

  /**
   * 获取用户的所有权限
   */
  static getUserPermissions(user: User): CustomerPermission[] {
    if (!user || !user.role) {
      return [];
    }

    const rolePermissions = CUSTOMER_ROLE_PERMISSIONS[user.role];
    return rolePermissions ? rolePermissions.permissions : [];
  }

  /**
   * 获取用户权限按类别分组
   */
  static getUserPermissionsByCategory(user: User): Record<string, CustomerPermission[]> {
    const permissions = this.getUserPermissions(user);
    const grouped: Record<string, CustomerPermission[]> = {};

    permissions.forEach(permission => {
      if (!grouped[permission.category]) {
        grouped[permission.category] = [];
      }
      grouped[permission.category].push(permission);
    });

    return grouped;
  }

  /**
   * 检查用户是否可以执行特定操作
   */
  static canPerformAction(user: User, action: string, resource?: string): boolean {
    const permissionId = resource ? `${resource}:${action}` : action;
    return this.hasPermission(user, permissionId);
  }

  /**
   * 获取用户角色显示名称
   */
  static getRoleDisplayName(role: string): string {
    const roleNames: Record<string, string> = {
      'customer': '普通会员',
      'vip': 'VIP会员',
      'staff': '员工',
      'manager': '经理',
      'admin': '管理员'
    };

    return roleNames[role] || role;
  }

  /**
   * 检查用户是否为VIP
   */
  static isVIP(user: User): boolean {
    return user?.role === 'vip' || user?.role === 'manager' || user?.role === 'admin';
  }

  /**
   * 检查用户是否为管理员
   */
  static isAdmin(user: User): boolean {
    return user?.role === 'admin' || user?.role === 'manager';
  }

  /**
   * 获取用户可访问的功能列表
   */
  static getAccessibleFeatures(user: User): string[] {
    const features: string[] = [];

    if (this.hasPermission(user, 'profile:view')) {
      features.push('profile');
    }
    if (this.hasPermission(user, 'events:view')) {
      features.push('events');
    }
    if (this.hasPermission(user, 'marketplace:view')) {
      features.push('marketplace');
    }
    if (this.hasPermission(user, 'social:view')) {
      features.push('social');
    }

    return features;
  }
}

// React Hook for permissions
export const useCustomerPermissions = (user: User) => {
  const hasPermission = (permissionId: string) => 
    CustomerPermissionManager.hasPermission(user, permissionId);
  
  const hasAnyPermission = (permissionIds: string[]) => 
    CustomerPermissionManager.hasAnyPermission(user, permissionIds);
  
  const hasAllPermissions = (permissionIds: string[]) => 
    CustomerPermissionManager.hasAllPermissions(user, permissionIds);
  
  const canPerformAction = (action: string, resource?: string) => 
    CustomerPermissionManager.canPerformAction(user, action, resource);
  
  const isVIP = () => CustomerPermissionManager.isVIP(user);
  
  const isAdmin = () => CustomerPermissionManager.isAdmin(user);
  
  const getRoleDisplayName = () => CustomerPermissionManager.getRoleDisplayName(user.role);
  
  const getAccessibleFeatures = () => CustomerPermissionManager.getAccessibleFeatures(user);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canPerformAction,
    isVIP,
    isAdmin,
    getRoleDisplayName,
    getAccessibleFeatures,
    permissions: CustomerPermissionManager.getUserPermissions(user),
    permissionsByCategory: CustomerPermissionManager.getUserPermissionsByCategory(user)
  };
};
