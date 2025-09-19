// Firebase configuration for cigar business system
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPqg8bUXs7KuN1_aofBE8yLNRHGL-WwHc",
  authDomain: "cigar-56871.firebaseapp.com",
  projectId: "cigar-56871",
  storageBucket: "cigar-56871.firebasestorage.app",
  messagingSenderId: "866808564072",
  appId: "1:866808564072:web:54021622fc7fc9a8b22edd",
  measurementId: "G-XXXXXXXXXX" // Add your analytics ID if needed
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in production)
let analytics: any = null;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  analytics = getAnalytics(app);
}
export { analytics };

// Development emulators (uncomment for local development)
// if (process.env.NODE_ENV === 'development') {
//   try {
//     connectAuthEmulator(auth, 'http://localhost:9099');
//     connectFirestoreEmulator(db, 'localhost', 8080);
//     connectStorageEmulator(storage, 'localhost', 9199);
//   } catch (error) {
//     console.log('Emulators already connected or not available');
//   }
// }

export default app;
