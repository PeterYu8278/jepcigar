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

    if (auth) {

      results.auth = true;
    } else {
      results.errors.push('Firebase Auth not initialized');
    }
  } catch (error) {
    results.errors.push(`Firebase Auth error: ${error}`);
  }

  try {
    // Test Firestore

    const testCollection = collection(db, 'test');
    await getDocs(testCollection);

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




  
  if (results.errors.length > 0) {

    results.errors.forEach((_error: string, _index: number) => {

    });
    














  } else {

  }
};
