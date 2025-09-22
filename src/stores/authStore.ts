// Authentication store using Zustand
import { create } from 'zustand';
import { subscribeWithSelector, persist } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { User } from '@/types';
import { UserService } from '@/services/userService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: { email: string; password: string; displayName?: string }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  initializeAuth: () => void;
}

// Helper function to get user from Firestore by Firebase UID
const getUserFromFirestore = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  try {
    const user = await UserService.getUserByFirebaseUid(firebaseUser.uid);
    if (user) {
      // Update last login
      try {
        await UserService.updateLastLogin(user.id);
      } catch (error) {
        console.warn('Failed to update last login:', error);
      }
      return user;
    }
    
        // If user doesn't exist in Firestore, create a default one
        console.warn('User not found in Firestore, creating default user');
        return {
          id: firebaseUser.uid,
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          role: 'customer', // Default role for new users (customer)
          permissions: ['read'], // Default permissions
          isActive: true,
          lastLogin: new Date(),
          createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
          updatedAt: new Date(firebaseUser.metadata.lastSignInTime || Date.now()),
          createdBy: 'system',
          updatedBy: 'system'
        };
  } catch (error: any) {
    console.error('Error getting user from Firestore:', error);
    
    // If it's a permissions error, provide a fallback user
    if (error.code === 'permission-denied' || error.message?.includes('permissions')) {
      console.warn('Firestore permissions error, using fallback user data');
      return {
        id: firebaseUser.uid,
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        role: 'customer',
        permissions: ['read'],
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
        updatedAt: new Date(firebaseUser.metadata.lastSignInTime || Date.now()),
        createdBy: 'system',
        updatedBy: 'system'
      };
    }
    
    return null;
  }
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    subscribeWithSelector((set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading true to check auth state
      error: null,

      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        error: null 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = await getUserFromFirestore(userCredential.user);
          
          if (!user) {
            throw new Error('无法获取用户信息');
          }
          
          set({ 
            user, 
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          const errorMessage = error.code === 'auth/user-not-found' 
            ? '用户不存在，请检查邮箱地址'
            : error.code === 'auth/wrong-password'
            ? '密码错误，请重新输入'
            : error.code === 'auth/invalid-email'
            ? '邮箱格式不正确'
            : error.code === 'auth/too-many-requests'
            ? '登录尝试次数过多，请稍后再试'
            : error.message || '登录失败，请检查您的邮箱和密码';
            
          set({ 
            error: errorMessage,
            isLoading: false 
          });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await signOut(auth);
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '登出失败',
            isLoading: false 
          });
        }
      },

    register: async (userData: { email: string; password: string; displayName?: string }) => {
      set({ isLoading: true, error: null });
      try {
        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        
        // Try to create user in Firestore, but don't fail if it doesn't work
        let userId: string;
        try {
            userId = await UserService.createUser({
              firebaseUid: userCredential.user.uid,
              email: userData.email,
              displayName: userData.displayName || userData.email.split('@')[0],
              role: 'customer', // Default role for new users (customer)
              permissions: ['read']
            });

            // For customer users, also create a Customer record
            try {
              const { CustomerService } = await import('@/services/customerService');
              await CustomerService.createCustomerFromUser(userId, userCredential.user.uid, {
                email: userData.email,
                displayName: userData.displayName || userData.email.split('@')[0]
              });
            } catch (customerError: any) {
              console.warn('Failed to create customer record:', customerError);
              // Don't fail registration if customer creation fails
            }
        } catch (firestoreError: any) {
          console.warn('Failed to create user in Firestore:', firestoreError);
          // Continue with authentication even if Firestore creation fails
          userId = userCredential.user.uid;
        }

        // Try to get the complete user data from Firestore
        let user = await UserService.getUserById(userId);
        
        // If Firestore user doesn't exist, create a fallback user
        if (!user) {
          user = {
            id: userCredential.user.uid,
            firebaseUid: userCredential.user.uid,
            email: userData.email,
            displayName: userData.displayName || userData.email.split('@')[0],
            role: 'customer',
            permissions: ['read'],
            isActive: true,
            lastLogin: new Date(),
            createdAt: new Date(userCredential.user.metadata.creationTime || Date.now()),
            updatedAt: new Date(userCredential.user.metadata.lastSignInTime || Date.now()),
            createdBy: 'system',
            updatedBy: 'system'
          };
        }
        
        set({ 
          user, 
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } catch (error: any) {
        const errorMessage = error.code === 'auth/email-already-in-use'
          ? '该邮箱已被注册，请使用其他邮箱或直接登录'
          : error.code === 'auth/invalid-email'
          ? '邮箱格式不正确'
          : error.code === 'auth/weak-password'
          ? '密码强度不够，请使用至少6位字符的密码'
          : error.code === 'auth/operation-not-allowed'
          ? '邮箱注册功能未启用，请联系管理员'
          : error.message || '注册失败，请稍后重试';
          
        set({ 
          error: errorMessage,
          isLoading: false 
        });
        
        // Re-throw the error so the component can handle it
        throw error;
      }
    },

      resetPassword: async (_email) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Implement Firebase password reset
          // await sendPasswordResetEmail(auth, email);
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '密码重置失败',
            isLoading: false 
          });
        }
      },

      clearError: () => set({ error: null }),

      initializeAuth: () => {
        // Set up Firebase auth state listener
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const user = await getUserFromFirestore(firebaseUser);
              if (user) {
                set({ 
                  user, 
                  isAuthenticated: true,
                  isLoading: false,
                  error: null
                });
              } else {
                set({ 
                  user: null, 
                  isAuthenticated: false,
                  isLoading: false,
                  error: '用户数据获取失败'
                });
              }
            } catch (error) {
              console.error('Error initializing auth:', error);
              set({ 
                user: null, 
                isAuthenticated: false,
                isLoading: false,
                error: '认证初始化失败'
              });
            }
          } else {
            set({ 
              user: null, 
              isAuthenticated: false,
              isLoading: false,
              error: null
            });
          }
        });
      }
    })),
    {
      name: 'auth-storage', // 持久化存储的key
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }), // 只持久化用户信息和认证状态
    }
  )
);

// Selectors for common use cases
export const useAuth = () => useAuthStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  error: state.error
}));

export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  logout: state.logout,
  register: state.register,
  resetPassword: state.resetPassword,
  clearError: state.clearError,
  initializeAuth: state.initializeAuth
}));
