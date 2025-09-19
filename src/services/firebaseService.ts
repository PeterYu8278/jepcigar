// Firebase service layer for cigar business system
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
  startAfter,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  QueryConstraint,
  DocumentReference
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import { BaseEntity, PaginatedResponse, Event as EventType, EventRegistration } from '@/types';

export class FirebaseService {
  // ===== GENERIC CRUD OPERATIONS =====
  
  /**
   * Create a new document in Firestore
   */
  static async create<T extends BaseEntity>(
    collectionName: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>
  ): Promise<string> {
    try {
      // Filter out undefined values and validate dates to prevent Firebase errors
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          if (value === undefined) return false;
          
          // Validate Date objects
          if (value instanceof Date) {
            if (isNaN(value.getTime())) {
              console.warn(`Invalid date value for field ${key}:`, value);
              return false;
            }
          }
          
          return true;
        })
      );
      
      const docRef = await addDoc(collection(db, collectionName), {
        ...cleanData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: this.getCurrentUserId(),
        updatedBy: this.getCurrentUserId()
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get a single document by ID
   */
  static async getById<T extends BaseEntity>(
    collectionName: string,
    id: string
  ): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as T;
        return {
          ...data,
          id: docSnap.id,
          // Convert Firestore timestamps to Date objects
          createdAt: (data.createdAt as any)?.toDate?.() || new Date(),
          updatedAt: (data.updatedAt as any)?.toDate?.() || new Date()
        };
      }
      return null;
    } catch (error) {
      console.error(`Error getting document ${id} from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Update a document by ID
   */
  static async update<T extends BaseEntity>(
    collectionName: string,
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt' | 'createdBy'>>
  ): Promise<void> {
    try {
      // Filter out undefined values and validate dates to prevent Firebase errors
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          if (value === undefined) return false;
          
          // Validate Date objects
          if (value instanceof Date) {
            if (isNaN(value.getTime())) {
              console.warn(`Invalid date value for field ${key}:`, value);
              return false;
            }
          }
          
          return true;
        })
      );
      
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...cleanData,
        updatedAt: serverTimestamp(),
        updatedBy: this.getCurrentUserId()
      });
    } catch (error) {
      console.error(`Error updating document ${id} in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document by ID
   */
  static async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document ${id} from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get multiple documents with pagination
   */
  static async getPaginated<T extends BaseEntity>(
    collectionName: string,
    constraints: QueryConstraint[] = [],
    pageSize: number = 20,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<PaginatedResponse<T>> {
    try {
      let q = query(collection(db, collectionName), ...constraints);
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      q = query(q, limit(pageSize));
      
      const snapshot = await getDocs(q);
      const items: T[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data() as T;
        items.push({
          ...data,
          id: doc.id,
          createdAt: (data.createdAt as any)?.toDate?.() || new Date(),
          updatedAt: (data.updatedAt as any)?.toDate?.() || new Date()
        });
      });

      // Get total count (this is expensive, consider caching)
      const countQuery = query(collection(db, collectionName), ...constraints);
      const countSnapshot = await getDocs(countQuery);
      const total = countSnapshot.size;

      return {
        items,
        total,
        page: lastDoc ? Math.floor(items.length / pageSize) + 1 : 1,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      };
    } catch (error) {
      console.error(`Error getting paginated documents from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get all documents matching constraints
   */
  static async getAll<T extends BaseEntity>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const snapshot = await getDocs(q);
      const items: T[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data() as T;
        
        // Convert Firestore Timestamps to Date objects for common date fields
        const processedData = {
          ...data,
          id: doc.id,
          createdAt: (data.createdAt as any)?.toDate?.() || new Date(),
          updatedAt: (data.updatedAt as any)?.toDate?.() || new Date(),
          // Handle event-specific date fields
          startDate: (data as any).startDate?.toDate?.() || (data as any).startDate,
          endDate: (data as any).endDate?.toDate?.() || (data as any).endDate,
        };
        
        items.push(processedData);
      });

      return items;
    } catch (error) {
      console.error(`Error getting all documents from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Batch write operations
   */
  static async batchWrite(operations: Array<{
    type: 'create' | 'update' | 'delete';
    collection: string;
    id?: string;
    data?: any;
  }>): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      for (const operation of operations) {
        const { type, collection: collectionName, id, data } = operation;
        
        switch (type) {
          case 'create':
            const docRef = doc(collection(db, collectionName));
            batch.set(docRef, {
              ...data,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              createdBy: this.getCurrentUserId(),
              updatedBy: this.getCurrentUserId()
            });
            break;
            
          case 'update':
            if (id) {
              const updateRef = doc(db, collectionName, id);
              batch.update(updateRef, {
                ...data,
                updatedAt: serverTimestamp(),
                updatedBy: this.getCurrentUserId()
              });
            }
            break;
            
          case 'delete':
            if (id) {
              const deleteRef = doc(db, collectionName, id);
              batch.delete(deleteRef);
            }
            break;
        }
      }
      
      await batch.commit();
    } catch (error) {
      console.error('Error in batch write operation:', error);
      throw error;
    }
  }

  // ===== REAL-TIME LISTENERS =====

  /**
   * Subscribe to real-time updates for a collection
   */
  static subscribe<T extends BaseEntity>(
    collectionName: string,
    constraints: QueryConstraint[] = [],
    callback: (items: T[]) => void
  ): () => void {
    const q = query(collection(db, collectionName), ...constraints);
    
    return onSnapshot(q, (snapshot) => {
      const items: T[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as T;
        
        // Convert Firestore Timestamps to Date objects for common date fields
        const processedData = {
          ...data,
          id: doc.id,
          createdAt: (data.createdAt as any)?.toDate?.() || new Date(),
          updatedAt: (data.updatedAt as any)?.toDate?.() || new Date(),
          // Handle event-specific date fields
          startDate: (data as any).startDate?.toDate?.() || (data as any).startDate,
          endDate: (data as any).endDate?.toDate?.() || (data as any).endDate,
        };
        
        items.push(processedData);
      });
      callback(items);
    });
  }

  /**
   * Subscribe to real-time updates for a single document
   */
  static subscribeToDocument<T extends BaseEntity>(
    collectionName: string,
    id: string,
    callback: (item: T | null) => void
  ): () => void {
    const docRef = doc(db, collectionName, id);
    
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as T;
        
        // Convert Firestore Timestamps to Date objects for common date fields
        const processedData = {
          ...data,
          id: doc.id,
          createdAt: (data.createdAt as any)?.toDate?.() || new Date(),
          updatedAt: (data.updatedAt as any)?.toDate?.() || new Date(),
          // Handle event-specific date fields
          startDate: (data as any).startDate?.toDate?.() || (data as any).startDate,
          endDate: (data as any).endDate?.toDate?.() || (data as any).endDate,
        };
        
        callback(processedData);
      } else {
        callback(null);
      }
    });
  }

  // ===== FILE STORAGE OPERATIONS =====

  /**
   * Upload a file to Firebase Storage
   */
  static async uploadFile(
    file: File,
    path: string,
    metadata?: any
  ): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Delete a file from Firebase Storage
   */
  static async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  /**
   * Get current user ID (implement based on your auth system)
   */
  private static getCurrentUserId(): string {
    // This should be implemented based on your authentication system
    // For now, return a placeholder
    return 'current-user-id';
  }

  /**
   * Convert Firestore document to typed object
   */
  static convertDocument<T extends BaseEntity>(
    doc: QueryDocumentSnapshot<DocumentData>
  ): T {
    const data = doc.data() as T;
    return {
      ...data,
      id: doc.id,
      createdAt: (data.createdAt as any)?.toDate?.() || new Date(),
      updatedAt: (data.updatedAt as any)?.toDate?.() || new Date()
    };
  }

  /**
   * Create a reference to a document
   */
  static createDocRef(collectionName: string, id?: string): DocumentReference {
    if (id) {
      return doc(db, collectionName, id);
    }
    return doc(collection(db, collectionName));
  }

  /**
   * Create a reference to a collection
   */
  static createCollectionRef(collectionName: string) {
    return collection(db, collectionName);
  }
}

// ===== SPECIALIZED SERVICES =====

export class InventoryService extends FirebaseService {
  static readonly COLLECTION = 'cigars';
  static readonly PRICE_HISTORY_COLLECTION = 'priceHistory';
  static readonly STOCK_TRANSACTIONS_COLLECTION = 'stockTransactions';

  // Cigar-specific methods
  static async getCigarsByBrand(brand: string) {
    return this.getAll(this.COLLECTION, [where('brand', '==', brand)]);
  }

  static async getLowStockCigars() {
    return this.getAll(
      this.COLLECTION,
      [where('currentStock', '<=', 10)] // Assuming 10 is low stock threshold
    );
  }

  static async updateStock(cigarId: string, quantity: number, type: 'in' | 'out') {
    const cigar = await this.getById(this.COLLECTION, cigarId) as any;
    if (!cigar) throw new Error('Cigar not found');

    const newStock = type === 'in' 
      ? cigar.currentStock + quantity 
      : cigar.currentStock - quantity;

    if (newStock < 0) throw new Error('Insufficient stock');

    await this.update(this.COLLECTION, cigarId, { currentStock: newStock } as any);
    
    // Record stock transaction
    await this.create(this.STOCK_TRANSACTIONS_COLLECTION, {
      cigarId,
      type,
      quantity,
      batchNumber: `BATCH-${Date.now()}`,
      reason: type === 'in' ? 'Stock replenishment' : 'Sale'
    });
  }
}

export class CustomerService extends FirebaseService {
  static readonly COLLECTION = 'customers';
  static readonly LOYALTY_COLLECTION = 'customerLoyalty';

  static async getCustomerByEmail(email: string) {
    const customers = await this.getAll(this.COLLECTION, [where('email', '==', email)]);
    return customers[0] || null;
  }

  static async getCustomersByTier(tierId: string) {
    return this.getAll(this.LOYALTY_COLLECTION, [where('currentTier', '==', tierId)]);
  }

  static async updateCustomerTier(customerId: string, newTier: string, _reason: string) {
    await this.update(this.LOYALTY_COLLECTION, customerId, {
      currentTier: newTier,
      tierHistory: [] // This should be properly implemented with array operations
    } as any);
  }
}

export class EventService extends FirebaseService {
  static readonly COLLECTION = 'events';
  static readonly REGISTRATIONS_COLLECTION = 'eventRegistrations';

  // ===== EVENT CRUD OPERATIONS =====
  
  static async getAllEvents() {
    return this.getAll(this.COLLECTION, [orderBy('startDate', 'desc')]);
  }

  static async getUpcomingEvents() {
    return this.getAll(
      this.COLLECTION,
      [
        where('startDate', '>=', new Date()),
        where('status', '==', 'published'),
        orderBy('startDate', 'asc')
      ]
    );
  }

  static async getEventById(eventId: string) {
    return this.getById(this.COLLECTION, eventId);
  }

  static async createEvent(eventData: Omit<EventType, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) {
    return this.create(this.COLLECTION, {
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system', // TODO: Get from auth context
      updatedBy: 'system',
      currentAttendees: eventData.currentAttendees || 0,
      status: eventData.status || 'draft',
      isActive: true
    });
  }

  static async updateEvent(eventId: string, updates: Partial<EventType>) {
    return this.update(this.COLLECTION, eventId, {
      ...updates,
      updatedAt: new Date(),
      updatedBy: 'system' // TODO: Get from auth context
    });
  }

  static async deleteEvent(eventId: string) {
    // First, cancel all registrations
    const registrations = await this.getAll(
      this.REGISTRATIONS_COLLECTION,
      [where('eventId', '==', eventId)]
    );
    
    // Cancel all registrations
    for (const registration of registrations) {
      await this.update(this.REGISTRATIONS_COLLECTION, registration.id, {
        status: 'cancelled',
        updatedAt: new Date()
      } as any);
    }
    
    // Then delete the event
    return this.delete(this.COLLECTION, eventId);
  }

  static async publishEvent(eventId: string) {
    return this.updateEvent(eventId, { status: 'published' } as any);
  }

  static async cancelEvent(eventId: string) {
    // Cancel all registrations
    const registrations = await this.getAll(
      this.REGISTRATIONS_COLLECTION,
      [where('eventId', '==', eventId)]
    );
    
    for (const registration of registrations) {
      await this.update(this.REGISTRATIONS_COLLECTION, registration.id, {
        status: 'cancelled',
        updatedAt: new Date()
      } as any);
    }
    
    return this.updateEvent(eventId, { status: 'cancelled' } as any);
  }

  // ===== EVENT REGISTRATION OPERATIONS =====

  static async registerForEvent(eventId: string, customerId: string) {
    // Check if already registered
    const existingRegistration = await this.getAll(
      this.REGISTRATIONS_COLLECTION,
      [
        where('eventId', '==', eventId),
        where('customerId', '==', customerId)
      ]
    );

    if (existingRegistration.length > 0) {
      throw new Error('User already registered for this event');
    }

    // Get event details for pricing
    const event = await this.getEventById(eventId) as EventType;
    if (!event) {
      throw new Error('Event not found');
    }

    // Check capacity
    if (event.currentAttendees >= event.maxAttendees) {
      throw new Error('Event is full');
    }

    // Create registration
    const registration = await this.create(this.REGISTRATIONS_COLLECTION, {
      eventId,
      customerId,
      status: 'registered',
      engagementScore: 0,
      networkingConnections: [],
      amountPaid: 0,
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: customerId,
      updatedBy: customerId
    });

    // Update event attendee count
    await this.update(this.COLLECTION, eventId, {
      currentAttendees: event.currentAttendees + 1,
      updatedAt: new Date()
    } as any);

    return registration;
  }

  static async cancelRegistration(registrationId: string) {
    const registration = await this.getById(this.REGISTRATIONS_COLLECTION, registrationId) as EventRegistration;
    if (!registration) {
      throw new Error('Registration not found');
    }

    // Update registration status
    await this.update(this.REGISTRATIONS_COLLECTION, registrationId, {
      status: 'cancelled',
      updatedAt: new Date()
    } as any);

    // Decrease event attendee count
    const event = await this.getEventById(registration.eventId) as EventType;
    if (event) {
      await this.update(this.COLLECTION, registration.eventId, {
        currentAttendees: Math.max(0, event.currentAttendees - 1),
        updatedAt: new Date()
      } as any);
    }

    return registration;
  }

  static async getEventRegistrations(eventId: string) {
    return this.getAll(
      this.REGISTRATIONS_COLLECTION,
      [where('eventId', '==', eventId)]
    );
  }

  static async getUserRegistrations(customerId: string) {
    return this.getAll(
      this.REGISTRATIONS_COLLECTION,
      [where('customerId', '==', customerId)]
    );
  }

  // ===== CHECK-IN/OUT OPERATIONS =====

  static async checkIn(registrationId: string) {
    return this.update(this.REGISTRATIONS_COLLECTION, registrationId, {
      status: 'checked-in',
      checkInTime: new Date(),
      updatedAt: new Date()
    } as any);
  }

  static async checkOut(registrationId: string) {
    const registration = await this.getById(this.REGISTRATIONS_COLLECTION, registrationId) as EventRegistration;
    if (!registration || !registration.checkInTime) {
      throw new Error('Cannot check out without checking in first');
    }

    const checkOutTime = new Date();
    const attendanceDuration = Math.floor(
      (checkOutTime.getTime() - registration.checkInTime.getTime()) / (1000 * 60)
    ); // minutes

    return this.update(this.REGISTRATIONS_COLLECTION, registrationId, {
      status: 'checked-out',
      checkOutTime,
      attendanceDuration,
      updatedAt: new Date()
    } as any);
  }

  // ===== NETWORKING CONNECTIONS =====

  static async addNetworkingConnection(
    eventId: string,
    fromCustomerId: string,
    toCustomerId: string,
    connectionType: 'met' | 'exchanged_cards' | 'follow_up',
    notes?: string
  ) {
    // Add to both registrations
    const registrations = await this.getAll(
      this.REGISTRATIONS_COLLECTION,
      [
        where('eventId', '==', eventId),
        where('customerId', 'in', [fromCustomerId, toCustomerId])
      ]
    );

    const connection = {
      id: `${Date.now()}-${fromCustomerId}-${toCustomerId}`,
      eventId,
      fromCustomerId,
      toCustomerId,
      connectionType,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: fromCustomerId,
      updatedBy: fromCustomerId,
      isMutual: false
    };

    for (const registration of registrations) {
      const existingConnections = (registration as EventRegistration).networkingConnections || [];
      existingConnections.push(connection);
      
      await this.update(this.REGISTRATIONS_COLLECTION, registration.id, {
        networkingConnections: existingConnections,
        updatedAt: new Date()
      } as any);
    }

    return connection;
  }

  // ===== STATISTICS =====

  static async getEventStats(eventId: string) {
    const registrations = await this.getEventRegistrations(eventId) as EventRegistration[];
    
    const stats = {
      totalRegistrations: registrations.length,
      checkedIn: registrations.filter(r => r.status === 'checked-in' || r.status === 'checked-out').length,
      checkedOut: registrations.filter(r => r.status === 'checked-out').length,
      noShows: registrations.filter(r => r.status === 'no-show').length,
      cancelled: registrations.filter(r => r.status === 'cancelled').length,
      averageEngagement: registrations.reduce((sum, r) => sum + (r.engagementScore || 0), 0) / registrations.length || 0,
      totalConnections: registrations.reduce((sum, r) => sum + (r.networkingConnections?.length || 0), 0)
    };

    return stats;
  }
}

export class ReferralService extends FirebaseService {
  static readonly COLLECTION = 'referrals';
  static readonly POINTS_COLLECTION = 'pointsTransactions';

  static async getReferralsByCustomer(customerId: string) {
    return this.getAll(this.COLLECTION, [where('referrerId', '==', customerId)]);
  }

  static async createReferral(referrerId: string, referralCode: string) {
    return this.create(this.COLLECTION, {
      referrerId,
      referralCode,
      status: 'pending',
      rewardStatus: 'pending'
    });
  }

  static async awardReferralPoints(customerId: string, points: number, referralId: string) {
    // Award points
    await this.create(this.POINTS_COLLECTION, {
      customerId,
      type: 'earned',
      source: 'referral',
      amount: points,
      balance: 0, // This should be calculated based on current balance
      description: 'Referral bonus',
      referenceId: referralId
    });

    // Update referral status
    await this.update(this.COLLECTION, referralId, {
      status: 'converted',
      rewardStatus: 'awarded',
      pointsAwarded: points,
      conversionDate: new Date()
    } as any);
  }
}
