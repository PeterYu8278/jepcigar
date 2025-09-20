// Firestore connection test utility
import { db } from '@/config/firebase';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';

export const testFirestoreConnection = async () => {
  try {

    
    // Test reading from a collection
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
    


    
    return true;
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    return false;
  }
};

export const createTestDocument = async () => {
  try {

    
    const testData = {
      message: 'Hello from Firestore!',
      timestamp: new Date(),
      source: 'JEP Cigar System'
    };
    
    const docRef = await addDoc(collection(db, 'test'), testData);

    
    return docRef.id;
  } catch (error) {
    console.error('❌ Failed to create test document:', error);
    throw error;
  }
};

export const readTestDocument = async (docId: string) => {
  try {

    
    const docRef = doc(db, 'test', docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('✅ Test document read successfully:', docSnap.data());
      return docSnap.data();
    } else {

      return null;
    }
  } catch (error) {
    console.error('❌ Failed to read test document:', error);
    throw error;
  }
};
