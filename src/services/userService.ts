// User service for Firestore operations
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { User, UserProfile } from '@/types';

export class UserService {
  private static readonly COLLECTION_NAME = 'users';
  private static readonly PROFILES_COLLECTION = 'userProfiles';

  /**
   * Create a new user in Firestore
   */
  static async createUser(userData: {
    firebaseUid: string;
    email: string;
    displayName: string;
    role?: 'admin' | 'manager' | 'staff';
    permissions?: string[];
  }): Promise<string> {
    try {
      const userDoc = {
        firebaseUid: userData.firebaseUid,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role || 'staff',
        permissions: userData.permissions || ['read'],
        isActive: true,
        lastLogin: new Date(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: 'system',
        updatedBy: 'system'
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), userDoc);
      
      // Create default user profile
      await this.createUserProfile(docRef.id, userData.firebaseUid);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Get user by Firebase UID
   */
  static async getUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('firebaseUid', '==', firebaseUid),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const userData = doc.data();
      
      // Convert Firestore data to User type
      return {
        id: doc.id,
        firebaseUid: userData.firebaseUid,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        permissions: userData.permissions,
        isActive: userData.isActive,
        lastLogin: userData.lastLogin?.toDate(),
        avatar: userData.avatar,
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date(),
        createdBy: userData.createdBy,
        updatedBy: userData.updatedBy,
        profile: await this.getUserProfile(doc.id) || undefined
      };
    } catch (error) {
      console.error('Error getting user by Firebase UID:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      const userData = docSnap.data();
      
      return {
        id: docSnap.id,
        firebaseUid: userData.firebaseUid,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        permissions: userData.permissions,
        isActive: userData.isActive,
        lastLogin: userData.lastLogin?.toDate(),
        avatar: userData.avatar,
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date(),
        createdBy: userData.createdBy,
        updatedBy: userData.updatedBy,
        profile: await this.getUserProfile(docSnap.id) || undefined
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  static async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, userId);
      
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
        updatedBy: updates.updatedBy || 'system'
      };

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.createdAt;
      delete updateData.createdBy;
      delete updateData.profile; // Handle profile separately
      delete updateData.firebaseUid; // Firebase UID should never change

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Update user last login
   */
  static async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.updateUser(userId, {
        lastLogin: new Date(),
        updatedBy: userId
      });
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }

  /**
   * Create user profile
   */
  static async createUserProfile(userId: string, firebaseUid: string): Promise<string> {
    try {
      const defaultProfile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'> = {
        userId,
        preferences: {
          theme: 'auto',
          dashboard: {
            defaultView: 'overview',
            widgets: ['stats', 'recent_activities', 'top_customers'],
            refreshInterval: 30
          },
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true
        },
        notifications: {
          newCustomers: true,
          lowStock: true,
          events: true,
          sales: true,
          systemUpdates: true,
          marketingEmails: false
        },
        timezone: 'Asia/Kuala_Lumpur',
        language: 'zh-CN'
      };

      const docRef = await addDoc(collection(db, this.PROFILES_COLLECTION), {
        ...defaultProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: firebaseUid,
        updatedBy: firebaseUid
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const q = query(
        collection(db, this.PROFILES_COLLECTION),
        where('userId', '==', userId),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const profileData = doc.data();
      
      return {
        id: doc.id,
        userId: profileData.userId,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        address: profileData.address,
        company: profileData.company,
        position: profileData.position,
        bio: profileData.bio,
        preferences: profileData.preferences,
        notifications: profileData.notifications,
        timezone: profileData.timezone,
        language: profileData.language,
        createdAt: profileData.createdAt?.toDate() || new Date(),
        updatedAt: profileData.updatedAt?.toDate() || new Date(),
        createdBy: profileData.createdBy,
        updatedBy: profileData.updatedBy
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(profileId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, this.PROFILES_COLLECTION, profileId);
      
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
        updatedBy: updates.updatedBy || 'system'
      };

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.createdAt;
      delete updateData.createdBy;
      delete updateData.userId; // User ID should never change

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, this.COLLECTION_NAME),
          orderBy('createdAt', 'desc')
        )
      );

      const users: User[] = [];
      
      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
        const user: User = {
          id: doc.id,
          firebaseUid: userData.firebaseUid,
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role,
          permissions: userData.permissions,
          isActive: userData.isActive,
          lastLogin: userData.lastLogin?.toDate(),
          avatar: userData.avatar,
          createdAt: userData.createdAt?.toDate() || new Date(),
          updatedAt: userData.updatedAt?.toDate() || new Date(),
          createdBy: userData.createdBy,
          updatedBy: userData.updatedBy
        };
        
        users.push(user);
      }

      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  /**
   * Delete user (admin only)
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      // Delete user profile first
      const profileQuery = query(
        collection(db, this.PROFILES_COLLECTION),
        where('userId', '==', userId)
      );
      const profileSnapshot = await getDocs(profileQuery);
      
      for (const profileDoc of profileSnapshot.docs) {
        await deleteDoc(doc(db, this.PROFILES_COLLECTION, profileDoc.id));
      }

      // Delete user
      await deleteDoc(doc(db, this.COLLECTION_NAME, userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Check if user exists by Firebase UID
   */
  static async userExists(firebaseUid: string): Promise<boolean> {
    try {
      const user = await this.getUserByFirebaseUid(firebaseUid);
      return user !== null;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  }
}
