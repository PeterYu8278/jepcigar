// Firebase configuration check utility
import { auth, db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const checkFirebaseConfiguration = async () => {
  const results = {
    auth: false,
    firestore: false,
    errors: [] as string[]
  };

  try {
    // Test Firebase Auth
    console.log('🔍 Checking Firebase Auth...');
    if (auth) {
      console.log('✅ Firebase Auth initialized');
      results.auth = true;
    } else {
      results.errors.push('Firebase Auth not initialized');
    }
  } catch (error) {
    results.errors.push(`Firebase Auth error: ${error}`);
  }

  try {
    // Test Firestore
    console.log('🔍 Checking Firestore...');
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
    console.log('✅ Firestore connection successful');
    results.firestore = true;
  } catch (error: any) {
    const errorMsg = error.message || error.toString();
    console.warn('⚠️ Firestore connection failed:', errorMsg);
    results.errors.push(`Firestore error: ${errorMsg}`);
    
    // Check for specific permission errors
    if (error.code === 'permission-denied') {
      results.errors.push('Firestore permission denied - check security rules');
    } else if (error.code === 'unavailable') {
      results.errors.push('Firestore service unavailable - check if it\'s enabled');
    }
  }

  return results;
};

export const displayFirebaseStatus = (results: any) => {
  console.log('\n📊 Firebase Configuration Status:');
  console.log('================================');
  console.log(`Authentication: ${results.auth ? '✅ Working' : '❌ Failed'}`);
  console.log(`Firestore: ${results.firestore ? '✅ Working' : '❌ Failed'}`);
  
  if (results.errors.length > 0) {
    console.log('\n🚨 Issues found:');
    results.errors.forEach((error: string, index: number) => {
      console.log(`${index + 1}. ${error}`);
    });
    
    console.log('\n🔧 立即修复步骤:');
    console.log('1. 访问 Firebase Console: https://console.firebase.google.com/');
    console.log('2. 选择项目 "cigar-56871"');
    console.log('3. 点击左侧 "Firestore Database" -> "Rules"');
    console.log('4. 替换规则为开放规则:');
    console.log('   rules_version = \'2\';');
    console.log('   service cloud.firestore {');
    console.log('     match /databases/{database}/documents {');
    console.log('       match /{document=**} { allow read, write: if true; }');
    console.log('     }');
    console.log('   }');
    console.log('5. 点击 "Publish" 按钮');
    console.log('6. 刷新浏览器页面验证修复');
    console.log('\n📋 详细指南请查看: QUICK_FIX.md');
  } else {
    console.log('\n🎉 All Firebase services are working correctly!');
  }
};
