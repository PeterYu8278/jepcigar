// Test user creation utility
import { auth, db } from '@/config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { User } from '@/types';

export interface TestUser {
  email: string;
  password: string;
  displayName: string;
  role: 'admin' | 'manager' | 'staff';
  permissions: string[];
}

export const testUsers: TestUser[] = [
  {
    email: 'admin@jepcigar.com',
    password: 'admin123',
    displayName: '系统管理员',
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'manage']
  },
  {
    email: 'manager@jepcigar.com',
    password: 'manager123',
    displayName: '门店经理',
    role: 'manager',
    permissions: ['read', 'write', 'manage']
  },
  {
    email: 'staff@jepcigar.com',
    password: 'staff123',
    displayName: '普通员工',
    role: 'staff',
    permissions: ['read']
  }
];

export const createTestUser = async (userData: TestUser): Promise<boolean> => {
  try {
    console.log(`🔨 Creating test user: ${userData.email}`);
    
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const firebaseUser = userCredential.user;
    
    // Create user document in Firestore
    const userDoc: Omit<User, 'id' | 'profile'> = {
      firebaseUid: firebaseUser.uid,
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role,
      permissions: userData.permissions,
      isActive: true,
      lastLogin: serverTimestamp() as any,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      createdBy: 'system',
      updatedBy: 'system'
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), userDoc);
    
    // Create user profile
    const profileDoc = {
      userId: firebaseUser.uid,
      firstName: userData.displayName.split(' ')[0] || userData.displayName,
      lastName: userData.displayName.split(' ').slice(1).join(' ') || '',
      preferences: {
        theme: 'auto' as const,
        dashboard: { 
          defaultView: 'overview' as const, 
          widgets: [], 
          refreshInterval: 300 
        },
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
      },
      notifications: {
        newCustomers: true,
        lowStock: true,
        events: true,
        sales: true,
        systemUpdates: true,
        marketingEmails: false,
      },
      timezone: 'Asia/Kuala_Lumpur',
      language: 'zh-CN',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: 'system',
      updatedBy: 'system'
    };
    
    await setDoc(doc(db, 'userProfiles', firebaseUser.uid), profileDoc);
    
    console.log(`✅ Test user created successfully: ${userData.email}`);
    return true;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`⚠️ User already exists: ${userData.email}`);
      return true; // Consider this as success since user exists
    }
    console.error(`❌ Failed to create test user ${userData.email}:`, error);
    return false;
  }
};

export const createAllTestUsers = async (): Promise<{ success: number; failed: number }> => {
  console.log('🚀 Starting test user creation process...');
  
  let success = 0;
  let failed = 0;
  
  for (const userData of testUsers) {
    const result = await createTestUser(userData);
    if (result) {
      success++;
    } else {
      failed++;
    }
    
    // Small delay between user creations
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n📊 Test user creation completed:`);
  console.log(`✅ Successfully created/verified: ${success} users`);
  console.log(`❌ Failed to create: ${failed} users`);
  
  return { success, failed };
};

export const verifyTestUser = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log(`🔍 Verifying test user: ${email}`);
    
    // Try to sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if user document exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (userDoc.exists()) {
      console.log(`✅ Test user verified: ${email}`);
      await signOut(auth); // Sign out after verification
      return true;
    } else {
      console.log(`⚠️ User exists in Auth but not in Firestore: ${email}`);
      await signOut(auth);
      return false;
    }
  } catch (error: any) {
    console.error(`❌ Failed to verify test user ${email}:`, error);
    return false;
  }
};

export const verifyAllTestUsers = async (): Promise<{ verified: number; failed: number }> => {
  console.log('🔍 Starting test user verification...');
  
  let verified = 0;
  let failed = 0;
  
  for (const userData of testUsers) {
    const result = await verifyTestUser(userData.email, userData.password);
    if (result) {
      verified++;
    } else {
      failed++;
    }
  }
  
  console.log(`\n📊 Test user verification completed:`);
  console.log(`✅ Verified: ${verified} users`);
  console.log(`❌ Failed: ${failed} users`);
  
  return { verified, failed };
};

// Development helper function
export const setupTestEnvironment = async () => {
  console.log('🛠️ Setting up test environment...');
  
  // Create test users
  const createResult = await createAllTestUsers();
  
  // Verify test users
  const verifyResult = await verifyAllTestUsers();
  
  console.log('\n🎉 Test environment setup completed!');
  console.log('You can now use the following test accounts:');
  testUsers.forEach(user => {
    console.log(`📧 ${user.email} (${user.role}) - Password: ${user.password}`);
  });
  
  return {
    create: createResult,
    verify: verifyResult
  };
};
