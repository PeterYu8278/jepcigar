// Firestore connection test utility
import { db } from '@/config/firebase';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';

export const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');
    
    // Test reading from a collection
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    
    console.log('✅ Firestore connection successful');
    console.log(`Found ${snapshot.size} documents in test collection`);
    
    return true;
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    return false;
  }
};

export const createTestDocument = async () => {
  try {
    console.log('Creating test document...');
    
    const testData = {
      message: 'Hello from Firestore!',
      timestamp: new Date(),
      source: 'JEP Cigar System'
    };
    
    const docRef = await addDoc(collection(db, 'test'), testData);
    console.log('✅ Test document created with ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Failed to create test document:', error);
    throw error;
  }
};

export const readTestDocument = async (docId: string) => {
  try {
    console.log('Reading test document...');
    
    const docRef = doc(db, 'test', docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('✅ Test document read successfully:', docSnap.data());
      return docSnap.data();
    } else {
      console.log('❌ Test document not found');
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to read test document:', error);
    throw error;
  }
};
