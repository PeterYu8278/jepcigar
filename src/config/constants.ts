// Application constants and configuration

// ===== LOYALTY TIER CONFIGURATION =====
export const LOYALTY_TIERS = {
  SILVER: {
    id: 'silver',
    name: 'Silver',
    level: 1,
    minSpending: 0,
    minReferrals: 0,
    minEvents: 0,
    benefits: ['基础折扣', '生日礼品', '新品尝鲜'],
    color: '#C0C0C0',
    icon: '🥈'
  },
  GOLD: {
    id: 'gold',
    name: 'Gold',
    level: 2,
    minSpending: 5000,
    minReferrals: 2,
    minEvents: 3,
    benefits: ['高级折扣', '专属活动邀请', '优先客服', '礼品包装'],
    color: '#FFD700',
    icon: '🥇'
  },
  PLATINUM: {
    id: 'platinum',
    name: 'Platinum',
    level: 3,
    minSpending: 15000,
    minReferrals: 5,
    minEvents: 8,
    benefits: ['VIP折扣', '私人品鉴会', '限量版优先购买', '专属礼品'],
    color: '#E5E4E2',
    icon: '💎'
  },
  ROYAL: {
    id: 'royal',
    name: 'Royal',
    level: 4,
    minSpending: 30000,
    minReferrals: 10,
    minEvents: 15,
    benefits: ['最高折扣', '私人定制服务', '全球限量版', '专属顾问'],
    color: '#8B4513',
    icon: '👑'
  }
} as const;

// ===== POINTS SYSTEM =====
export const POINTS_CONFIG = {
  PURCHASE_MULTIPLIER: 1, // 1 point per 1 yuan spent
  REFERRAL_BONUS: 500, // Points for successful referral
  EVENT_ATTENDANCE: 100, // Points for attending event
  SPIN_COST: 50, // Points required for one spin
  POINTS_EXPIRY_MONTHS: 12 // Points expire after 12 months
} as const;

// ===== LUCKY SPIN PRIZES =====
export const DEFAULT_SPIN_PRIZES = [
  { id: 'discount_5', name: '5%折扣券', type: 'discount', value: 5, probability: 30 },
  { id: 'discount_10', name: '10%折扣券', type: 'discount', value: 10, probability: 20 },
  { id: 'discount_20', name: '20%折扣券', type: 'discount', value: 20, probability: 10 },
  { id: 'points_100', name: '100积分', type: 'points', value: 100, probability: 25 },
  { id: 'points_200', name: '200积分', type: 'points', value: 200, probability: 10 },
  { id: 'premium_cigar', name: '高端雪茄', type: 'cigar', value: 500, probability: 4 },
  { id: 'accessory', name: '雪茄配件', type: 'accessory', value: 200, probability: 1 }
] as const;

// ===== CIGAR CATEGORIES =====
export const CIGAR_CATEGORIES = {
  ORIGINS: ['古巴', '多米尼加', '尼加拉瓜', '洪都拉斯', '厄瓜多尔', '墨西哥', '巴西'],
  STRENGTHS: ['轻度', '中度', '强度', '极强'],
  FLAVORS: ['木香', '果香', '花香', '香料', '巧克力', '咖啡', '坚果', '奶油'],
  SIZES: ['小号', '中号', '大号', '特大号'],
  AGING_YEARS: [2020, 2021, 2022, 2023, 2024]
} as const;

// ===== GIFT OCCASIONS =====
export const GIFT_OCCASIONS = [
  '商务礼品',
  '生日庆祝',
  '婚礼纪念',
  '节日祝福',
  '感谢礼品',
  '升职庆祝',
  '周年纪念',
  '私人收藏'
] as const;

// ===== EVENT TYPES =====
export const EVENT_TYPES = [
  { id: 'tasting', name: '品鉴会', icon: '🍷' },
  { id: 'networking', name: '商务聚会', icon: '🤝' },
  { id: 'educational', name: '雪茄学院', icon: '🎓' },
  { id: 'celebration', name: '庆祝活动', icon: '🎉' }
] as const;

// ===== ACADEMY COURSE CATEGORIES =====
export const ACADEMY_CATEGORIES = [
  { id: 'etiquette', name: '雪茄礼仪', icon: '🎩' },
  { id: 'tasting', name: '品鉴技巧', icon: '👃' },
  { id: 'history', name: '雪茄历史', icon: '📚' },
  { id: 'pairing', name: '搭配艺术', icon: '🍽️' }
] as const;

// ===== PACKAGING OPTIONS =====
export const PACKAGING_OPTIONS = [
  {
    id: 'standard',
    name: '标准包装',
    description: '精美礼品盒包装',
    price: 0
  },
  {
    id: 'premium',
    name: '高级包装',
    description: '木质礼品盒配丝带',
    price: 50
  },
  {
    id: 'luxury',
    name: '奢华包装',
    description: '定制礼盒配证书',
    price: 150
  }
] as const;

// ===== SYSTEM SETTINGS =====
export const SYSTEM_SETTINGS = {
  COMPANY_NAME: 'JEP Cigar',
  COMPANY_DESCRIPTION: 'JEP Cigar - 高端雪茄与商务社交的完美结合',
  COMPANY_LOGO: '/logo.png',
  DEFAULT_CURRENCY: 'CNY',
  DEFAULT_LANGUAGE: 'zh-CN',
  TIMEZONE: 'Asia/Kuala_Lumpur',
  TAX_RATE: 0.13, // 13% tax rate
  FREE_SHIPPING_THRESHOLD: 1000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp']
} as const;

// ===== VALIDATION RULES =====
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^1[3-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  CIGAR_GAUGE_RING: { min: 30, max: 70 },
  CIGAR_LENGTH: { min: 100, max: 300 }, // mm
  PRICE: { min: 0.01, max: 99999.99 }
} as const;

// ===== UI CONSTANTS =====
export const UI_CONFIG = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 3000
} as const;

// ===== API ENDPOINTS =====
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  INVENTORY: {
    CIGARS: '/inventory/cigars',
    PRICE_HISTORY: '/inventory/price-history',
    STOCK_TRANSACTIONS: '/inventory/stock-transactions'
  },
  CUSTOMERS: {
    LIST: '/customers',
    DETAIL: '/customers/:id',
    PREFERENCES: '/customers/:id/preferences',
    DIGITAL_CARD: '/customers/:id/digital-card'
  },
  REFERRALS: {
    LIST: '/referrals',
    CREATE: '/referrals',
    TRACK: '/referrals/track'
  },
  EVENTS: {
    LIST: '/events',
    REGISTER: '/events/:id/register',
    CHECK_IN: '/events/:id/check-in',
    CHECK_OUT: '/events/:id/check-out'
  },
  GAMIFICATION: {
    SPIN: '/gamification/spin',
    PRIZES: '/gamification/prizes',
    TIER_STATUS: '/gamification/tier-status'
  }
} as const;

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接错误，请检查您的网络连接',
  UNAUTHORIZED: '未授权访问，请重新登录',
  FORBIDDEN: '权限不足，无法执行此操作',
  NOT_FOUND: '请求的资源不存在',
  VALIDATION_ERROR: '输入数据验证失败',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
  FILE_TOO_LARGE: '文件大小超过限制',
  INVALID_FILE_TYPE: '不支持的文件类型',
  INSUFFICIENT_STOCK: '库存不足',
  INSUFFICIENT_POINTS: '积分不足'
} as const;

// ===== SUCCESS MESSAGES =====
export const SUCCESS_MESSAGES = {
  SAVED: '保存成功',
  DELETED: '删除成功',
  UPDATED: '更新成功',
  CREATED: '创建成功',
  LOGIN_SUCCESS: '登录成功',
  LOGOUT_SUCCESS: '退出成功',
  REGISTRATION_SUCCESS: '注册成功',
  REFERRAL_SENT: '推荐链接已发送',
  POINTS_EARNED: '积分已到账',
  TIER_UPGRADED: '会员等级已升级'
} as const;
