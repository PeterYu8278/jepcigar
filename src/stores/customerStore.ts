// Customer and CRM store using Zustand
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Customer, CustomerLoyalty, Referral } from '@/types';
import { CustomerService, ReferralService } from '@/services/firebaseService';
import { where, orderBy } from 'firebase/firestore';
import { LOYALTY_TIERS } from '@/config/constants';
import { generateCardUrl } from '@/config/environment';

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  customerLoyalty: CustomerLoyalty | null;
  referrals: Referral[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: {
    tier?: string;
    searchTerm?: string;
    isActive?: boolean;
  };
}

interface CustomerActions {
  // Customer management
  loadCustomers: (page?: number, filters?: Partial<CustomerState['filters']>) => Promise<void>;
  getCustomerById: (id: string) => Promise<Customer | null>;
  createCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Promise<string>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  
  // Customer loyalty
  getCustomerLoyalty: (customerId: string) => Promise<CustomerLoyalty | null>;
  updateCustomerTier: (customerId: string, newTier: string, reason: string) => Promise<void>;
  getCustomersByTier: (tierId: string) => Promise<Customer[]>;
  
  // Referrals
  loadReferrals: (customerId?: string) => Promise<void>;
  createReferral: (referrerId: string, referralCode: string) => Promise<string>;
  trackReferralConversion: (referralId: string, refereeId: string) => Promise<void>;
  
  // Digital business card
  generateDigitalCard: (customerId: string) => Promise<string>;
  deactivateDigitalCard: (customerId: string) => Promise<void>;
  
  // UI state
  setSelectedCustomer: (customer: Customer | null) => void;
  setFilters: (filters: Partial<CustomerState['filters']>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useCustomerStore = create<CustomerState & CustomerActions>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    customers: [],
    selectedCustomer: null,
    customerLoyalty: null,
    referrals: [],
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0
    },
    filters: {},

    // Actions
    loadCustomers: async (_page = 1, filters = {}) => {
      set({ isLoading: true, error: null });
      try {
        const currentFilters = { ...get().filters, ...filters };
        const constraints = [];
        
        // Apply filters
        if (currentFilters.isActive !== undefined) {
          constraints.push(where('isActive', '==', currentFilters.isActive));
        }
        
        // Add search functionality
        if (currentFilters.searchTerm) {
          constraints.push(where('firstName', '>=', currentFilters.searchTerm));
          constraints.push(where('firstName', '<=', currentFilters.searchTerm + '\uf8ff'));
        }
        
        constraints.push(orderBy('createdAt', 'desc'));
        
        const response = await CustomerService.getPaginated(
          CustomerService.COLLECTION,
          constraints,
          get().pagination.pageSize
        );
        
        set({
          customers: response.items as Customer[],
          pagination: {
            page: response.page,
            pageSize: response.pageSize,
            total: response.total,
            totalPages: response.totalPages
          },
          isLoading: false
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to load customers',
          isLoading: false
        });
      }
    },

    getCustomerById: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        const customer = await CustomerService.getById<Customer>(CustomerService.COLLECTION, id);
        set({ selectedCustomer: customer, isLoading: false });
        return customer;
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to get customer',
          isLoading: false
        });
        return null;
      }
    },

    createCustomer: async (customerData) => {
      set({ isLoading: true, error: null });
      try {
        const id = await CustomerService.create<Customer>(CustomerService.COLLECTION, customerData);
        
        // Initialize loyalty record
        await CustomerService.create<CustomerLoyalty>(CustomerService.LOYALTY_COLLECTION, {
          customerId: id,
          currentTier: LOYALTY_TIERS.SILVER.id,
          totalSpent: 0,
          totalReferrals: 0,
          totalEvents: 0,
          totalPoints: 0,
          availablePoints: 0,
          tierHistory: []
        });
        
        await get().loadCustomers();
        set({ isLoading: false });
        return id;
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to create customer',
          isLoading: false
        });
        throw error;
      }
    },

    updateCustomer: async (id, updates) => {
      set({ isLoading: true, error: null });
      try {
        await CustomerService.update<Customer>(CustomerService.COLLECTION, id, updates);
        
        // Update local state
        set((state) => ({
          customers: state.customers.map(customer => 
            customer.id === id ? { ...customer, ...updates } : customer
          ),
          selectedCustomer: state.selectedCustomer?.id === id 
            ? { ...state.selectedCustomer, ...updates }
            : state.selectedCustomer,
          isLoading: false
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to update customer',
          isLoading: false
        });
      }
    },

    deleteCustomer: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await CustomerService.delete(CustomerService.COLLECTION, id);
        
        // Update local state
        set((state) => ({
          customers: state.customers.filter(customer => customer.id !== id),
          selectedCustomer: state.selectedCustomer?.id === id ? null : state.selectedCustomer,
          isLoading: false
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to delete customer',
          isLoading: false
        });
      }
    },

    getCustomerLoyalty: async (customerId) => {
      set({ isLoading: true, error: null });
      try {
        const loyalty = await CustomerService.getById<CustomerLoyalty>(
          CustomerService.LOYALTY_COLLECTION, 
          customerId
        );
        set({ customerLoyalty: loyalty, isLoading: false });
        return loyalty;
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to get customer loyalty',
          isLoading: false
        });
        return null;
      }
    },

    updateCustomerTier: async (customerId, newTier, reason) => {
      set({ isLoading: true, error: null });
      try {
        await CustomerService.updateCustomerTier(customerId, newTier, reason);
        
        // Update local state
        set((state) => ({
          customerLoyalty: state.customerLoyalty?.customerId === customerId 
            ? { ...state.customerLoyalty, currentTier: newTier }
            : state.customerLoyalty,
          isLoading: false
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to update customer tier',
          isLoading: false
        });
      }
    },

    getCustomersByTier: async (tierId) => {
      set({ isLoading: true, error: null });
      try {
        const customers = await CustomerService.getCustomersByTier(tierId);
        set({ isLoading: false });
        return customers as Customer[];
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to get customers by tier',
          isLoading: false
        });
        return [];
      }
    },

    loadReferrals: async (customerId) => {
      set({ isLoading: true, error: null });
      try {
        const referrals = customerId 
          ? await ReferralService.getReferralsByCustomer(customerId)
          : await ReferralService.getAll<Referral>(ReferralService.COLLECTION);
        
        set({ referrals: referrals as Referral[], isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to load referrals',
          isLoading: false
        });
      }
    },

    createReferral: async (referrerId, referralCode) => {
      set({ isLoading: true, error: null });
      try {
        const id = await ReferralService.createReferral(referrerId, referralCode);
        await get().loadReferrals(referrerId);
        set({ isLoading: false });
        return id;
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to create referral',
          isLoading: false
        });
        throw error;
      }
    },

    trackReferralConversion: async (referralId, refereeId) => {
      set({ isLoading: true, error: null });
      try {
        await ReferralService.awardReferralPoints(refereeId, 500, referralId);
        await get().loadReferrals();
        set({ isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to track referral conversion',
          isLoading: false
        });
      }
    },

    generateDigitalCard: async (customerId) => {
      set({ isLoading: true, error: null });
      try {
        // 生成名片URL
        const cardUrl = generateCardUrl(customerId);
        
        // 动态导入二维码生成工具
        const { generateQRCodeData } = await import('@/utils');
        const qrCode = await generateQRCodeData(cardUrl);
        
        // 更新客户数字名片信息
        await CustomerService.update<Customer>(CustomerService.COLLECTION, customerId, {
          digitalCard: {
            qrCode,
            cardUrl,
            isActive: true
          }
        });
        
        // 刷新客户列表
        await get().loadCustomers();
        
        set({ isLoading: false });
        return cardUrl;
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : '生成数字名片失败',
          isLoading: false
        });
        throw error;
      }
    },

    deactivateDigitalCard: async (customerId) => {
      set({ isLoading: true, error: null });
      try {
        // 停用数字名片
        await CustomerService.update<Customer>(CustomerService.COLLECTION, customerId, {
          digitalCard: {
            qrCode: '',
            cardUrl: '',
            isActive: false
          }
        });
        
        // 刷新客户列表
        await get().loadCustomers();
        
        set({ isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : '停用数字名片失败',
          isLoading: false
        });
        throw error;
      }
    },

    setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
    
    setFilters: (filters) => set((state) => ({ 
      filters: { ...state.filters, ...filters } 
    })),
    
    clearFilters: () => set({ filters: {} }),
    
    setLoading: (isLoading) => set({ isLoading }),
    
    setError: (error) => set({ error }),
    
    clearError: () => set({ error: null })
  }))
);

// Selectors for common use cases
export const useCustomers = () => useCustomerStore((state) => ({
  customers: state.customers,
  selectedCustomer: state.selectedCustomer,
  customerLoyalty: state.customerLoyalty,
  referrals: state.referrals,
  isLoading: state.isLoading,
  error: state.error,
  pagination: state.pagination,
  filters: state.filters
}));

export const useCustomerActions = () => useCustomerStore((state) => ({
  loadCustomers: state.loadCustomers,
  getCustomerById: state.getCustomerById,
  createCustomer: state.createCustomer,
  updateCustomer: state.updateCustomer,
  deleteCustomer: state.deleteCustomer,
  getCustomerLoyalty: state.getCustomerLoyalty,
  updateCustomerTier: state.updateCustomerTier,
  loadReferrals: state.loadReferrals,
  createReferral: state.createReferral,
  generateDigitalCard: state.generateDigitalCard,
  deactivateDigitalCard: state.deactivateDigitalCard,
  setSelectedCustomer: state.setSelectedCustomer,
  setFilters: state.setFilters,
  clearFilters: state.clearFilters,
  clearError: state.clearError
}));
