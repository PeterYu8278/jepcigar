// Inventory management store using Zustand
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Cigar, PriceHistory, StockTransaction, TransactionType } from '@/types';
import { InventoryService } from '@/services/firebaseService';
import { where, orderBy } from 'firebase/firestore';

interface InventoryState {
  cigars: Cigar[];
  selectedCigar: Cigar | null;
  priceHistory: PriceHistory[];
  stockTransactions: StockTransaction[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: {
    brand?: string;
    origin?: string;
    stockType?: 'retail' | 'gift' | 'both';
    minPrice?: number;
    maxPrice?: number;
    searchTerm?: string;
  };
}

interface InventoryActions {
  // Cigar management
  loadCigars: (page?: number, filters?: Partial<InventoryState['filters']>) => Promise<void>;
  getCigarById: (id: string) => Promise<Cigar | null>;
  createCigar: (cigar: Omit<Cigar, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Promise<string>;
  updateCigar: (id: string, updates: Partial<Cigar>) => Promise<void>;
  deleteCigar: (id: string) => Promise<void>;
  fetchCigars: () => Promise<void>;
  
  // Stock management
  updateStock: (cigarId: string, quantity: number, type: 'in' | 'out', reason?: string) => Promise<void>;
  getLowStockCigars: () => Promise<Cigar[]>;
  
  // Stock transactions
  fetchStockTransactions: (filters?: {
    searchTerm?: string;
    type?: TransactionType;
    startDate?: Date;
    endDate?: Date;
  }) => Promise<void>;
  createStockTransaction: (transaction: Omit<StockTransaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  
  // Price management
  updatePrice: (cigarId: string, newPrice: number, priceType: 'purchase' | 'retail' | 'gift', reason?: string) => Promise<void>;
  getPriceHistory: (cigarId: string) => Promise<void>;
  fetchPriceHistory: (filters?: {
    searchTerm?: string;
    cigarId?: string;
    dateRange?: [Date, Date];
  }) => Promise<void>;
  createPriceHistory: (priceHistory: Omit<PriceHistory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  
  // UI state
  setSelectedCigar: (cigar: Cigar | null) => void;
  setFilters: (filters: Partial<InventoryState['filters']>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useInventoryStore = create<InventoryState & InventoryActions>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    cigars: [],
    selectedCigar: null,
    priceHistory: [],
    stockTransactions: [],
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
    loadCigars: async (_page = 1, filters = {}) => {
      set({ isLoading: true, error: null });
      try {
        const currentFilters = { ...get().filters, ...filters };
        const constraints = [];
        
        // Apply filters
        if (currentFilters.brand) {
          constraints.push(where('brand', '==', currentFilters.brand));
        }
        if (currentFilters.origin) {
          constraints.push(where('origin', '==', currentFilters.origin));
        }
        if (currentFilters.stockType) {
          constraints.push(where('stockType', '==', currentFilters.stockType));
        }
        if (currentFilters.minPrice !== undefined) {
          constraints.push(where('retailPrice', '>=', currentFilters.minPrice));
        }
        if (currentFilters.maxPrice !== undefined) {
          constraints.push(where('retailPrice', '<=', currentFilters.maxPrice));
        }
        
        // Add search functionality
        if (currentFilters.searchTerm) {
          constraints.push(where('name', '>=', currentFilters.searchTerm));
          constraints.push(where('name', '<=', currentFilters.searchTerm + '\uf8ff'));
        }
        
        constraints.push(orderBy('createdAt', 'desc'));
        
        const response = await InventoryService.getPaginated(
          InventoryService.COLLECTION,
          constraints,
          get().pagination.pageSize
        );
        
        set({
          cigars: response.items as Cigar[],
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
          error: error instanceof Error ? error.message : 'Failed to load cigars',
          isLoading: false
        });
      }
    },

    getCigarById: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        const cigar = await InventoryService.getById<Cigar>(InventoryService.COLLECTION, id);
        set({ selectedCigar: cigar, isLoading: false });
        return cigar;
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to get cigar',
          isLoading: false
        });
        return null;
      }
    },

    createCigar: async (cigarData) => {
      set({ isLoading: true, error: null });
      try {
        const id = await InventoryService.create<Cigar>(InventoryService.COLLECTION, cigarData);
        await get().loadCigars();
        set({ isLoading: false });
        return id;
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to create cigar',
          isLoading: false
        });
        throw error;
      }
    },

    updateCigar: async (id, updates) => {
      set({ isLoading: true, error: null });
      try {
        await InventoryService.update<Cigar>(InventoryService.COLLECTION, id, updates);
        
        // Update local state
        set((state) => ({
          cigars: state.cigars.map(cigar => 
            cigar.id === id ? { ...cigar, ...updates } : cigar
          ),
          selectedCigar: state.selectedCigar?.id === id 
            ? { ...state.selectedCigar, ...updates }
            : state.selectedCigar,
          isLoading: false
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to update cigar',
          isLoading: false
        });
      }
    },

    deleteCigar: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await InventoryService.delete(InventoryService.COLLECTION, id);
        
        // Update local state
        set((state) => ({
          cigars: state.cigars.filter(cigar => cigar.id !== id),
          selectedCigar: state.selectedCigar?.id === id ? null : state.selectedCigar,
          isLoading: false
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to delete cigar',
          isLoading: false
        });
      }
    },

    updateStock: async (cigarId, quantity, type, _reason = 'Manual adjustment') => {
      set({ isLoading: true, error: null });
      try {
        await InventoryService.updateStock(cigarId, quantity, type);
        
        // Update local state
        set((state) => ({
          cigars: state.cigars.map(cigar => {
            if (cigar.id === cigarId) {
              const newStock = type === 'in' 
                ? cigar.currentStock + quantity 
                : cigar.currentStock - quantity;
              return { ...cigar, currentStock: newStock };
            }
            return cigar;
          }),
          isLoading: false
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to update stock',
          isLoading: false
        });
      }
    },

    getLowStockCigars: async () => {
      set({ isLoading: true, error: null });
      try {
        const lowStockCigars = await InventoryService.getLowStockCigars();
        set({ isLoading: false });
        return lowStockCigars as Cigar[];
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to get low stock cigars',
          isLoading: false
        });
        return [];
      }
    },

    updatePrice: async (cigarId, newPrice, priceType, reason = 'Price update') => {
      set({ isLoading: true, error: null });
      try {
        // Update cigar price
        const priceField = priceType === 'purchase' ? 'purchasePrice' : 
                          priceType === 'gift' ? 'giftPrice' : 'retailPrice';
        
        await InventoryService.update<Cigar>(InventoryService.COLLECTION, cigarId, {
          [priceField]: newPrice
        });
        
        // Record price history
        await InventoryService.create<PriceHistory>(InventoryService.PRICE_HISTORY_COLLECTION, {
          cigarId,
          price: newPrice,
          priceType,
          effectiveDate: new Date(),
          reason
        });
        
        // Update local state
        set((state) => ({
          cigars: state.cigars.map(cigar => {
            if (cigar.id === cigarId) {
              return { ...cigar, [priceField]: newPrice };
            }
            return cigar;
          }),
          selectedCigar: state.selectedCigar?.id === cigarId 
            ? { ...state.selectedCigar, [priceField]: newPrice }
            : state.selectedCigar,
          isLoading: false
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to update price',
          isLoading: false
        });
      }
    },

    getPriceHistory: async (cigarId) => {
      set({ isLoading: true, error: null });
      try {
        const history = await InventoryService.getAll<PriceHistory>(
          InventoryService.PRICE_HISTORY_COLLECTION,
          [where('cigarId', '==', cigarId), orderBy('effectiveDate', 'desc')]
        );
        set({ priceHistory: history, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to get price history',
          isLoading: false
        });
      }
    },

    fetchCigars: async () => {
      set({ isLoading: true, error: null });
      try {
        const cigars = await InventoryService.getAll<Cigar>(InventoryService.COLLECTION);
        set({ cigars, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch cigars',
          isLoading: false
        });
      }
    },

    fetchStockTransactions: async (filters = {}) => {
      set({ isLoading: true, error: null });
      try {
        const constraints = [];
        
        if (filters.searchTerm) {
          // Note: Firestore doesn't support full-text search natively
          // This is a simplified implementation
          constraints.push(where('cigarBrand', '>=', filters.searchTerm));
        }
        
        if (filters.type) {
          constraints.push(where('type', '==', filters.type));
        }
        
        if (filters.startDate && filters.endDate) {
          constraints.push(where('date', '>=', filters.startDate));
          constraints.push(where('date', '<=', filters.endDate));
        }
        
        constraints.push(orderBy('date', 'desc'));
        
        const transactions = await InventoryService.getAll<StockTransaction>(
          InventoryService.STOCK_TRANSACTIONS_COLLECTION,
          constraints
        );
        
        set({ stockTransactions: transactions, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch stock transactions',
          isLoading: false
        });
      }
    },

    createStockTransaction: async (transactionData) => {
      set({ isLoading: true, error: null });
      try {
        await InventoryService.create<StockTransaction>(
          InventoryService.STOCK_TRANSACTIONS_COLLECTION,
          transactionData
        );
        set({ isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to create stock transaction',
          isLoading: false
        });
        throw error;
      }
    },

    fetchPriceHistory: async (filters = {}) => {
      set({ isLoading: true, error: null });
      try {
        const constraints = [];
        
        if (filters.cigarId) {
          constraints.push(where('cigarId', '==', filters.cigarId));
        }
        
        if (filters.dateRange) {
          constraints.push(where('date', '>=', filters.dateRange[0]));
          constraints.push(where('date', '<=', filters.dateRange[1]));
        }
        
        constraints.push(orderBy('date', 'desc'));
        
        const history = await InventoryService.getAll<PriceHistory>(
          InventoryService.PRICE_HISTORY_COLLECTION,
          constraints
        );
        
        set({ priceHistory: history, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch price history',
          isLoading: false
        });
      }
    },

    createPriceHistory: async (priceHistoryData) => {
      set({ isLoading: true, error: null });
      try {
        await InventoryService.create<PriceHistory>(
          InventoryService.PRICE_HISTORY_COLLECTION,
          priceHistoryData
        );
        set({ isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to create price history',
          isLoading: false
        });
        throw error;
      }
    },

    setSelectedCigar: (cigar) => set({ selectedCigar: cigar }),
    
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
export const useInventory = () => useInventoryStore((state) => ({
  cigars: state.cigars,
  selectedCigar: state.selectedCigar,
  isLoading: state.isLoading,
  error: state.error,
  pagination: state.pagination,
  filters: state.filters
}));

export const useInventoryActions = () => useInventoryStore((state) => ({
  loadCigars: state.loadCigars,
  getCigarById: state.getCigarById,
  createCigar: state.createCigar,
  updateCigar: state.updateCigar,
  deleteCigar: state.deleteCigar,
  updateStock: state.updateStock,
  updatePrice: state.updatePrice,
  setSelectedCigar: state.setSelectedCigar,
  setFilters: state.setFilters,
  clearFilters: state.clearFilters,
  clearError: state.clearError
}));
