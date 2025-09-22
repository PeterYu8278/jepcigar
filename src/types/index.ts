// Core types for the cigar business system

// ===== BASE TYPES =====
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// ===== INVENTORY TYPES =====
export interface Cigar extends BaseEntity {
  // Basic Info
  brand: string;
  name: string;
  origin: string;
  agingYear: number;
  
  // Physical Properties
  gaugeRing: number; // 环径
  length: number; // 长度 (mm)
  size: string; // 尺寸描述
  
  // Stock Management
  stockType: 'retail' | 'gift' | 'both';
  packingType: 'box' | 'tube' | 'loose';
  currentStock: number;
  minStock: number;
  
  // Pricing
  purchasePrice: number;
  retailPrice: number;
  giftPrice?: number;
  
  // Additional Info
  description?: string;
  imageUrl?: string;
  tags: string[];
  isActive: boolean;
}

export interface PriceHistory extends BaseEntity {
  cigarId: string;
  cigarBrand: string;
  cigarModel: string;
  price: number;
  priceType: 'retail' | 'wholesale' | 'cost' | 'market' | 'gift' | 'purchase';
  date: Date;
  source?: string;
  reason?: string;
  notes?: string;
}

export interface StockTransaction extends BaseEntity {
  cigarId: string;
  cigarBrand: string;
  cigarModel: string;
  type: TransactionType;
  quantity: number;
  unitPrice?: number;
  date: Date;
  operator: string;
  location?: string;
  batchNumber?: string;
  supplier?: string;
  reason?: string;
  reference?: string; // PO number, sale ID, etc.
  notes?: string;
}

export type TransactionType = 'purchase' | 'sale' | 'transfer' | 'adjustment' | 'loss' | 'return';

// ===== CUSTOMER & CRM TYPES =====
export interface Customer extends BaseEntity {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  avatar?: string;
  address?: string;
  
  // Preferences
  tastePreferences: TastePreference[];
  budgetRange: {
    min: number;
    max: number;
  };
  giftOccasions: GiftOccasion[];
  
  // Relationship
  referralSource?: string;
  referredBy?: string;
  relationshipNotes: string;
  lastContactDate?: Date;
  
  // Digital Business Card
  digitalCard?: {
    qrCode: string;
    cardUrl: string;
    isActive: boolean;
  };
  
  // Status
  isActive: boolean;
  tags: string[];
}

export interface TastePreference {
  category: string; // 'strength', 'flavor', 'origin'
  value: string;
  importance: 'low' | 'medium' | 'high';
}

export interface GiftOccasion {
  occasion: string; // 'business', 'birthday', 'wedding', 'holiday'
  frequency: 'once' | 'annual' | 'seasonal';
  budget?: number;
}

// ===== REFERRAL & LOYALTY TYPES =====
export interface Referral extends BaseEntity {
  referrerId: string; // Customer who made the referral
  refereeId?: string; // Customer who was referred (optional if not yet converted)
  referralCode: string;
  status: 'pending' | 'converted' | 'expired';
  rewardStatus: 'pending' | 'awarded' | 'redeemed';
  pointsAwarded?: number;
  conversionDate?: Date;
  notes?: string;
}

export interface LoyaltyTier {
  id: string;
  name: 'Silver' | 'Gold' | 'Platinum' | 'Royal';
  level: number;
  minSpending: number;
  minReferrals: number;
  minEvents: number;
  benefits: string[];
  color: string;
  icon: string;
}

export interface CustomerLoyalty extends BaseEntity {
  customerId: string;
  currentTier: string;
  totalSpent: number;
  totalReferrals: number;
  totalEvents: number;
  totalPoints: number;
  availablePoints: number;
  tierHistory: TierHistory[];
}

export interface TierHistory {
  tierId: string;
  achievedAt: Date;
  reason: 'spending' | 'referrals' | 'events' | 'manual';
  points: number;
}

// ===== GAMIFICATION TYPES =====
export interface LuckySpin extends BaseEntity {
  name: string;
  description: string;
  isActive: boolean;
  maxSpinsPerDay: number;
  costPerSpin: number; // points required
  prizes: SpinPrize[];
}

export interface SpinPrize {
  id: string;
  name: string;
  type: 'discount' | 'cigar' | 'accessory' | 'points';
  value: number;
  probability: number; // 0-100
  isActive: boolean;
  maxRedemptions?: number;
  currentRedemptions: number;
}

export interface SpinResult {
  id: string;
  customerId: string;
  spinId: string;
  prizeId?: string;
  isWinner: boolean;
  prizeValue?: number;
  spinDate: Date;
  redeemed: boolean;
  redeemedAt?: Date;
}

// ===== GIFTING TYPES =====
export interface GiftOrder extends BaseEntity {
  customerId: string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  
  // Gift Details
  occasion: string;
  message: string;
  packaging: PackagingOption;
  deliveryDate?: Date;
  
  // Items
  items: GiftItem[];
  
  // Status
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  
  // Tracking
  trackingNumber?: string;
  deliveryNotes?: string;
}

export interface GiftItem {
  cigarId: string;
  quantity: number;
  unitPrice: number;
  giftMessage?: string;
}

export interface PackagingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
}

// ===== EVENTS & NETWORKING TYPES =====
export interface Event extends BaseEntity {
  title: string;
  description: string;
  eventType: 'tasting' | 'networking' | 'educational' | 'celebration';
  
  // Timing
  startDate: Date;
  endDate: Date;
  timezone: string;
  
  // Location
  location: string;
  address?: string;
  isVirtual: boolean;
  meetingLink?: string;
  
  // Capacity
  maxAttendees: number;
  currentAttendees: number;
  
  // Pricing
  price: number;
  memberDiscount: number;
  
  // Status
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  isActive: boolean;
  
  // QR Code
  qrCode?: string;
}

export interface EventRegistration extends BaseEntity {
  eventId: string;
  customerId: string;
  status: 'registered' | 'checked-in' | 'checked-out' | 'no-show' | 'cancelled';
  
  // Check-in/out
  checkInTime?: Date;
  checkOutTime?: Date;
  attendanceDuration?: number; // minutes
  
  // Engagement
  engagementScore: number; // 0-100
  networkingConnections: NetworkingConnection[];
  
  // Payment
  amountPaid: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface NetworkingConnection extends BaseEntity {
  eventId: string;
  fromCustomerId: string;
  toCustomerId: string;
  connectionType: 'met' | 'exchanged_cards' | 'follow_up';
  notes?: string;
  followUpDate?: Date;
  isMutual: boolean;
}

export interface NetworkConnection extends BaseEntity {
  fromCustomerId: string;
  toCustomerId: string;
  connectionType: 'business' | 'personal' | 'referral';
  strength: number; // 1-5 rating
  eventId: string;
  notes?: string;
  date: Date;
  status: 'active' | 'inactive' | 'pending';
  tags: string[];
  interactions: number;
}

// ===== POINTS & MARKETPLACE TYPES =====
export interface PointsTransaction extends BaseEntity {
  customerId: string;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  source: 'purchase' | 'referral' | 'event' | 'spin' | 'manual';
  amount: number;
  balance: number;
  description: string;
  referenceId?: string; // Related purchase, referral, etc.
  expiresAt?: Date;
}

export interface MarketplaceItem extends BaseEntity {
  name: string;
  description: string;
  type: 'accessory' | 'experience' | 'spin_chance' | 'discount';
  pointsCost: number;
  cashValue?: number;
  imageUrl?: string;
  isActive: boolean;
  stockQuantity?: number;
  maxPerCustomer?: number;
}

export interface PointsRedemption extends BaseEntity {
  customerId: string;
  itemId: string;
  pointsUsed: number;
  status: 'pending' | 'fulfilled' | 'cancelled';
  fulfillmentNotes?: string;
}

// ===== ACADEMY TYPES =====
export interface AcademyCourse extends BaseEntity {
  title: string;
  description: string;
  category: 'etiquette' | 'tasting' | 'history' | 'pairing';
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  lessons: AcademyLesson[];
  badges: AcademyBadge[];
  isActive: boolean;
}

export interface AcademyLesson extends BaseEntity {
  courseId: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'quiz' | 'interactive';
  order: number;
  duration: number; // minutes
  isCompleted?: boolean;
}

export interface AcademyBadge extends BaseEntity {
  name: string;
  description: string;
  iconUrl?: string;
  requirements: BadgeRequirement[];
  pointsAward: number;
  tierUpgrade?: string;
}

export interface BadgeRequirement {
  type: 'course_completion' | 'lesson_completion' | 'time_spent' | 'quiz_score';
  value: number;
  target: string; // course ID, lesson ID, etc.
}

export interface CustomerProgress extends BaseEntity {
  customerId: string;
  courseId: string;
  progress: number; // 0-100
  lessonsCompleted: string[];
  badgesEarned: string[];
  timeSpent: number; // minutes
  lastAccessed: Date;
}

// ===== AI RECOMMENDATION TYPES =====
export interface Recommendation extends BaseEntity {
  customerId: string;
  cigarId: string;
  type: 'business_gift' | 'personal_enjoyment' | 'special_occasion';
  confidence: number; // 0-100
  reason: string;
  context: RecommendationContext;
  isActive: boolean;
}

export interface RecommendationContext {
  occasion?: string;
  budget?: number;
  preferences?: string[];
  history?: string[];
  season?: string;
}

// ===== ANALYTICS & FINANCE TYPES =====
export interface Sale extends BaseEntity {
  customerId: string;
  type: 'retail' | 'gift' | 'event';
  
  // Items
  items: SaleItem[];
  
  // Pricing
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  
  // Payment
  paymentMethod: 'cash' | 'card' | 'points' | 'mixed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  
  // Status
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  
  // Additional
  notes?: string;
  invoiceNumber?: string;
}

export interface SaleItem {
  cigarId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isGift?: boolean;
  giftMessage?: string;
}

export interface Invoice extends BaseEntity {
  saleId: string;
  customerId: string;
  invoiceNumber: string;
  
  // Billing Info
  billingAddress: Address;
  
  // Items & Pricing (same as Sale)
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  
  // Dates
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  
  // Status
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  
  // Files
  pdfUrl?: string;
  emailSent?: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// ===== SYSTEM TYPES =====
export interface User extends BaseEntity {
  email: string;
  displayName: string;
  role: 'admin' | 'manager' | 'staff' | 'customer';
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  avatar?: string;
  // Firebase Auth integration
  firebaseUid: string;
  // Extended profile
  profile?: UserProfile;
  // Customer specific fields
  customerProfile?: CustomerProfile;
}

export interface UserProfile extends BaseEntity {
  userId: string; // References User.id
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: Address;
  company?: string;
  position?: string;
  bio?: string;
  preferences: UserPreferences;
  notifications: NotificationSettings;
  timezone: string;
  language: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  dashboard: DashboardSettings;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

export interface CustomerProfile extends BaseEntity {
  userId: string; // References User.id
  phone?: string;
  birthday?: Date;
  preferences: CustomerPreferences;
  loyaltyInfo: CustomerLoyalty;
  digitalCard?: {
    qrCode: string;
    cardUrl: string;
    isActive: boolean;
  };
  referralCode?: string;
  totalSpent: number;
  totalPoints: number;
  memberSince: Date;
}

export interface CustomerPreferences {
  favoriteBrands: string[];
  tasteProfile: {
    strength: 'light' | 'medium' | 'strong';
    flavor: string[];
    origin: string[];
  };
  budgetRange: {
    min: number;
    max: number;
  };
  notificationSettings: {
    events: boolean;
    promotions: boolean;
    recommendations: boolean;
    social: boolean;
  };
  privacySettings: {
    showProfile: boolean;
    allowRecommendations: boolean;
    shareActivity: boolean;
  };
}

export interface DashboardSettings {
  defaultView: 'overview' | 'customers' | 'inventory' | 'analytics';
  widgets: string[];
  refreshInterval: number; // seconds
}

export interface NotificationSettings {
  newCustomers: boolean;
  lowStock: boolean;
  events: boolean;
  sales: boolean;
  systemUpdates: boolean;
  marketingEmails: boolean;
}

export interface SystemSettings extends BaseEntity {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object';
  description?: string;
  isPublic: boolean;
}

// ===== API RESPONSE TYPES =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ===== FORM TYPES =====
export interface FormState {
  isLoading: boolean;
  error?: string;
  success?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
