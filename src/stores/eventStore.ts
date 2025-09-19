import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Event as EventType, EventRegistration } from '@/types';
import { EventService } from '@/services/firebaseService';

interface EventState {
  // Data
  events: EventType[];
  upcomingEvents: EventType[];
  currentEvent: EventType | null;
  registrations: EventRegistration[];
  currentRegistration: EventRegistration | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  selectedEventId: string | null;
  
  // Filters
  eventTypeFilter: string | null;
  statusFilter: string | null;
  dateFilter: 'upcoming' | 'past' | 'all';
  
  // Pagination
  currentPage: number;
  pageSize: number;
  totalEvents: number;
}

interface EventActions {
  // Data fetching
  fetchAllEvents: () => Promise<void>;
  fetchUpcomingEvents: () => Promise<void>;
  fetchEventById: (eventId: string) => Promise<void>;
  fetchEventRegistrations: (eventId: string) => Promise<void>;
  fetchUserRegistrations: (customerId: string) => Promise<void>;
  
  // CRUD operations
  createEvent: (eventData: Omit<EventType, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Promise<EventType>;
  updateEvent: (eventId: string, updates: Partial<EventType>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  publishEvent: (eventId: string) => Promise<void>;
  cancelEvent: (eventId: string) => Promise<void>;
  
  // Registration operations
  registerForEvent: (eventId: string, customerId: string) => Promise<void>;
  cancelRegistration: (registrationId: string) => Promise<void>;
  checkIn: (registrationId: string) => Promise<void>;
  checkOut: (registrationId: string) => Promise<void>;
  
  // Networking
  addNetworkingConnection: (
    eventId: string,
    fromCustomerId: string,
    toCustomerId: string,
    connectionType: 'met' | 'exchanged_cards' | 'follow_up',
    notes?: string
  ) => Promise<void>;
  
  // UI actions
  setSelectedEvent: (eventId: string | null) => void;
  setEventTypeFilter: (type: string | null) => void;
  setStatusFilter: (status: string | null) => void;
  setDateFilter: (filter: 'upcoming' | 'past' | 'all') => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  clearError: () => void;
  
  // Computed getters
  getFilteredEvents: () => EventType[];
  getEventStats: (eventId: string) => Promise<any>;
}

type EventStore = EventState & EventActions;

export const useEventStore = create<EventStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      events: [],
      upcomingEvents: [],
      currentEvent: null,
      registrations: [],
      currentRegistration: null,
      
      isLoading: false,
      error: null,
      selectedEventId: null,
      
      eventTypeFilter: null,
      statusFilter: null,
      dateFilter: 'all',
      
      currentPage: 1,
      pageSize: 10,
      totalEvents: 0,

      // Data fetching actions
      fetchAllEvents: async () => {
        set({ isLoading: true, error: null });
        try {
          const events = await EventService.getAllEvents() as EventType[];
          set({ 
            events, 
            totalEvents: events.length,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch events',
            isLoading: false 
          });
        }
      },

      fetchUpcomingEvents: async () => {
        set({ isLoading: true, error: null });
        try {
          const upcomingEvents = await EventService.getUpcomingEvents() as EventType[];
          set({ upcomingEvents, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch upcoming events',
            isLoading: false 
          });
        }
      },

      fetchEventById: async (eventId: string) => {
        set({ isLoading: true, error: null });
        try {
          const event = await EventService.getEventById(eventId) as EventType;
          set({ currentEvent: event, selectedEventId: eventId, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch event',
            isLoading: false 
          });
        }
      },

      fetchEventRegistrations: async (eventId: string) => {
        set({ isLoading: true, error: null });
        try {
          const registrations = await EventService.getEventRegistrations(eventId) as EventRegistration[];
          set({ registrations, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch registrations',
            isLoading: false 
          });
        }
      },

      fetchUserRegistrations: async (customerId: string) => {
        set({ isLoading: true, error: null });
        try {
          const registrations = await EventService.getUserRegistrations(customerId) as EventRegistration[];
          set({ registrations, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch user registrations',
            isLoading: false 
          });
        }
      },

      // CRUD operations
      createEvent: async (eventData) => {
        set({ isLoading: true, error: null });
        try {
          const newEvent = await EventService.createEvent(eventData) as unknown as EventType;
          const { events } = get();
          set({ 
            events: [newEvent, ...events],
            totalEvents: events.length + 1,
            isLoading: false 
          });
          return newEvent;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create event',
            isLoading: false 
          });
          throw error;
        }
      },

      updateEvent: async (eventId: string, updates) => {
        set({ isLoading: true, error: null });
        try {
          await EventService.updateEvent(eventId, updates as any);
          const { events, currentEvent } = get();
          
          // Update events array
          const updatedEvents = events.map(event => 
            event.id === eventId ? { ...event, ...updates } : event
          );
          
          // Update current event if it's the one being updated
          const updatedCurrentEvent = currentEvent?.id === eventId 
            ? { ...currentEvent, ...updates }
            : currentEvent;
          
          set({ 
            events: updatedEvents,
            currentEvent: updatedCurrentEvent,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update event',
            isLoading: false 
          });
          throw error;
        }
      },

      deleteEvent: async (eventId: string) => {
        set({ isLoading: true, error: null });
        try {
          await EventService.deleteEvent(eventId);
          const { events } = get();
          const filteredEvents = events.filter(event => event.id !== eventId);
          
          set({ 
            events: filteredEvents,
            totalEvents: filteredEvents.length,
            currentEvent: null,
            selectedEventId: null,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete event',
            isLoading: false 
          });
          throw error;
        }
      },

      publishEvent: async (eventId: string) => {
        set({ isLoading: true, error: null });
        try {
          await EventService.publishEvent(eventId);
          await get().updateEvent(eventId, { status: 'published' });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to publish event',
            isLoading: false 
          });
          throw error;
        }
      },

      cancelEvent: async (eventId: string) => {
        set({ isLoading: true, error: null });
        try {
          await EventService.cancelEvent(eventId);
          await get().updateEvent(eventId, { status: 'cancelled' });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to cancel event',
            isLoading: false 
          });
          throw error;
        }
      },

      // Registration operations
      registerForEvent: async (eventId: string, customerId: string) => {
        set({ isLoading: true, error: null });
        try {
          await EventService.registerForEvent(eventId, customerId);
          
          // Refresh event data to update attendee count
          await get().fetchEventById(eventId);
          await get().fetchEventRegistrations(eventId);
          
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to register for event',
            isLoading: false 
          });
          throw error;
        }
      },

      cancelRegistration: async (registrationId: string) => {
        set({ isLoading: true, error: null });
        try {
          await EventService.cancelRegistration(registrationId);
          
          // Refresh registrations
          const { registrations } = get();
          const updatedRegistrations = registrations.map(reg => 
            reg.id === registrationId ? { ...reg, status: 'cancelled' as const } : reg
          );
          
          set({ registrations: updatedRegistrations, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to cancel registration',
            isLoading: false 
          });
          throw error;
        }
      },

      checkIn: async (registrationId: string) => {
        set({ isLoading: true, error: null });
        try {
          await EventService.checkIn(registrationId);
          
          // Update local state
          const { registrations } = get();
          const updatedRegistrations = registrations.map(reg => 
            reg.id === registrationId 
              ? { ...reg, status: 'checked-in' as const, checkInTime: new Date() }
              : reg
          );
          
          set({ registrations: updatedRegistrations, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to check in',
            isLoading: false 
          });
          throw error;
        }
      },

      checkOut: async (registrationId: string) => {
        set({ isLoading: true, error: null });
        try {
          await EventService.checkOut(registrationId);
          
          // Update local state
          const { registrations } = get();
          const updatedRegistrations = registrations.map(reg => {
            if (reg.id === registrationId) {
              const checkOutTime = new Date();
              const attendanceDuration = reg.checkInTime 
                ? Math.floor((checkOutTime.getTime() - reg.checkInTime.getTime()) / (1000 * 60))
                : 0;
              
              return {
                ...reg,
                status: 'checked-out' as const,
                checkOutTime,
                attendanceDuration
              };
            }
            return reg;
          });
          
          set({ registrations: updatedRegistrations, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to check out',
            isLoading: false 
          });
          throw error;
        }
      },

      // Networking operations
      addNetworkingConnection: async (eventId, fromCustomerId, toCustomerId, connectionType, notes) => {
        set({ isLoading: true, error: null });
        try {
          await EventService.addNetworkingConnection(
            eventId,
            fromCustomerId,
            toCustomerId,
            connectionType,
            notes
          );
          
          // Refresh registrations to get updated networking connections
          await get().fetchEventRegistrations(eventId);
          
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add networking connection',
            isLoading: false 
          });
          throw error;
        }
      },

      // UI actions
      setSelectedEvent: (eventId) => {
        set({ selectedEventId: eventId });
      },

      setEventTypeFilter: (type) => {
        set({ eventTypeFilter: type, currentPage: 1 });
      },

      setStatusFilter: (status) => {
        set({ statusFilter: status, currentPage: 1 });
      },

      setDateFilter: (filter) => {
        set({ dateFilter: filter, currentPage: 1 });
      },

      setCurrentPage: (page) => {
        set({ currentPage: page });
      },

      setPageSize: (size) => {
        set({ pageSize: size, currentPage: 1 });
      },

      clearError: () => {
        set({ error: null });
      },

      // Computed getters
      getFilteredEvents: () => {
        const { events, eventTypeFilter, statusFilter, dateFilter } = get();
        
        let filtered = events;
        
        // Apply type filter
        if (eventTypeFilter) {
          filtered = filtered.filter(event => event.eventType === eventTypeFilter);
        }
        
        // Apply status filter
        if (statusFilter) {
          filtered = filtered.filter(event => event.status === statusFilter);
        }
        
        // Apply date filter
        const now = new Date();
        if (dateFilter === 'upcoming') {
          filtered = filtered.filter(event => {
            const startDate = event.startDate instanceof Date ? event.startDate : new Date(event.startDate);
            return startDate >= now;
          });
        } else if (dateFilter === 'past') {
          filtered = filtered.filter(event => {
            const startDate = event.startDate instanceof Date ? event.startDate : new Date(event.startDate);
            return startDate < now;
          });
        }
        
        return filtered;
      },

      getEventStats: async (eventId: string) => {
        try {
          return await EventService.getEventStats(eventId);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to get event stats' });
          throw error;
        }
      },
    }),
    {
      name: 'event-store',
    }
  )
);

// Export actions for easier access
export const useEventActions = () => {
  const store = useEventStore();
  return {
    fetchAllEvents: store.fetchAllEvents,
    fetchUpcomingEvents: store.fetchUpcomingEvents,
    fetchEventById: store.fetchEventById,
    fetchEventRegistrations: store.fetchEventRegistrations,
    fetchUserRegistrations: store.fetchUserRegistrations,
    createEvent: store.createEvent,
    updateEvent: store.updateEvent,
    deleteEvent: store.deleteEvent,
    publishEvent: store.publishEvent,
    cancelEvent: store.cancelEvent,
    registerForEvent: store.registerForEvent,
    cancelRegistration: store.cancelRegistration,
    checkIn: store.checkIn,
    checkOut: store.checkOut,
    addNetworkingConnection: store.addNetworkingConnection,
    setSelectedEvent: store.setSelectedEvent,
    setEventTypeFilter: store.setEventTypeFilter,
    setStatusFilter: store.setStatusFilter,
    setDateFilter: store.setDateFilter,
    setCurrentPage: store.setCurrentPage,
    setPageSize: store.setPageSize,
    clearError: store.clearError,
    getFilteredEvents: store.getFilteredEvents,
    getEventStats: store.getEventStats,
  };
};
