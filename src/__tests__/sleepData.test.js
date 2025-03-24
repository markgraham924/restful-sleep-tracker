import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getUserSleepData, 
  addSleepEntry, 
  generateDefaultSleepDataForUser, 
  checkUserHasSleepData 
} from '../pages/sleepData';

// Create mock functions for Firestore
const mockCollection = vi.fn();
const mockQuery = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockLimit = vi.fn();
const mockGetDocs = vi.fn();
const mockAddDoc = vi.fn();
const mockTimestampFromDate = vi.fn(date => ({ toDate: () => date }));
const mockServerTimestamp = vi.fn();

// Mock Firebase Firestore with the functions we created
vi.mock('firebase/firestore', () => ({
  collection: mockCollection,
  query: mockQuery,
  where: mockWhere,
  getDocs: mockGetDocs,
  addDoc: mockAddDoc,
  orderBy: mockOrderBy,
  limit: mockLimit,
  Timestamp: {
    fromDate: mockTimestampFromDate,
    now: vi.fn()
  },
  serverTimestamp: mockServerTimestamp
}));

// Mock Firebase config
vi.mock('../firebase-config', () => ({
  db: {},
  auth: {}
}));

// Mock sleep score predictor
vi.mock('../utils/sleepScorePredictor', async () => {
  return {
    default: {
      initialize: vi.fn().mockResolvedValue(undefined),
      predict: vi.fn().mockResolvedValue({
        score: 75,
        confidence: 0.85,
        confidenceLevel: 'high',
        message: 'KNN prediction with high confidence'
      })
    }
  };
});

describe('Sleep Data Functions', () => {
  const userId = 'testUser123';
  const mockSleepEntries = [
    {
      id: 'entry1',
      date: '2023-01-01',
      sleepDuration: 7.5,
      deepSleep: 2.0,
      remSleep: 1.5,
      lightSleep: 4.0,
      quality: 75,
      interruptions: 1,
      bedtime: '22:30',
      wakeTime: '06:00',
      notes: 'Slept well'
    },
    {
      id: 'entry2',
      date: '2023-01-02',
      sleepDuration: 8.0,
      deepSleep: 2.2,
      remSleep: 1.8,
      lightSleep: 4.0,
      quality: 80,
      interruptions: 0,
      bedtime: '22:00',
      wakeTime: '06:00',
      notes: 'Great sleep'
    }
  ];

  beforeEach(() => {
    // Clear all mock function calls
    vi.clearAllMocks();
    
    // Mock query snapshot for getDocs
    const mockQuerySnapshot = {
      empty: false,
      forEach: callback => {
        mockSleepEntries.forEach((entry, index) => {
          callback({
            id: `entry${index + 1}`,
            data: () => ({
              ...entry,
              date: {
                toDate: () => new Date(entry.date)
              }
            })
          });
        });
      }
    };
    
    // Set up mock implementations using our mock functions
    mockCollection.mockReturnValue('sleepEntriesRef');
    mockQuery.mockReturnValue('queryObj');
    mockGetDocs.mockResolvedValue(mockQuerySnapshot);
    mockAddDoc.mockResolvedValue({ id: 'newEntryId' });
  });

  describe('getUserSleepData', () => {
    it('should fetch and format sleep data for a user', async () => {
      const result = await getUserSleepData(userId);
      
      // Verify the query was constructed correctly
      const { collection, where, getDocs } = require('firebase/firestore');
      const { db } = require('../firebase-config');
      expect(collection).toHaveBeenCalledWith(db, 'sleepEntries');
      expect(where).toHaveBeenCalledWith('userId', '==', userId);
      expect(getDocs).toHaveBeenCalled();
      
      // Verify the result has the expected format
      expect(result).toHaveProperty('lastNight');
      expect(result).toHaveProperty('weeklyData');
      expect(result).toHaveProperty('stats');
      expect(result).toHaveProperty('sleepDistribution');
      
      // Check specific values
      expect(result.weeklyData.length).toBe(2);
      expect(result.stats).toHaveProperty('averageSleepDuration');
      expect(result.stats).toHaveProperty('sleepScore');
    });

    it('should return default data when no sleep entries exist', async () => {
      // Mock empty query result
      const { getDocs } = require('firebase/firestore');
      getDocs.mockResolvedValueOnce({ empty: true });
      
      const result = await getUserSleepData(userId);
      
      // Should still return structured data
      expect(result).toHaveProperty('lastNight');
      expect(result).toHaveProperty('weeklyData');
      expect(result).toHaveProperty('stats');
      
      // Default data should have 7 days of generated data
      expect(result.weeklyData.length).toBe(7);
    });
  });

  describe('addSleepEntry', () => {
    it('should add a new sleep entry to Firestore', async () => {
      const sleepEntry = {
        userId,
        date: '2023-01-03',
        sleepDuration: 7.0,
        quality: 70
      };
      
      const result = await addSleepEntry(sleepEntry);
      
      const { collection, addDoc, Timestamp } = require('firebase/firestore');
      const { db } = require('../firebase-config');
      expect(collection).toHaveBeenCalledWith(db, 'sleepEntries');
      expect(addDoc).toHaveBeenCalled();
      expect(result).toBe('newEntryId');
      
      // Verify timestamp conversion
      const addDocArg = addDoc.mock.calls[0][1];
      expect(addDocArg).toHaveProperty('createdAt');
      expect(Timestamp.fromDate).toHaveBeenCalled();
    });
  });

  describe('generateDefaultSleepDataForUser', () => {
    it('should generate and upload default sleep data for a new user', async () => {
      // Mock that user has no data
      const { getDocs } = require('firebase/firestore');
      const emptySnapshot = { empty: true };
      getDocs.mockResolvedValueOnce(emptySnapshot);
      
      await generateDefaultSleepDataForUser(userId);
      
      // Should check if user has data first
      const { query, where } = require('firebase/firestore');
      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith('userId', '==', userId);
      
      // Should add entries
      const { addDoc } = require('firebase/firestore');
      expect(addDoc).toHaveBeenCalled();
    });
    
    it('should not generate data if user already has sleep entries', async () => {
      // Mock that user has data
      const { getDocs } = require('firebase/firestore');
      const nonEmptySnapshot = { empty: false };
      getDocs.mockResolvedValueOnce(nonEmptySnapshot);
      
      await generateDefaultSleepDataForUser(userId);
      
      // Should check if user has data
      const { query, where } = require('firebase/firestore');
      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith('userId', '==', userId);
      
      // Should not add any entries
      const { addDoc } = require('firebase/firestore');
      expect(addDoc).not.toHaveBeenCalled();
    });
  });

  describe('checkUserHasSleepData', () => {
    it('should return true if user has sleep data', async () => {
      const { getDocs } = require('firebase/firestore');
      getDocs.mockResolvedValueOnce({ empty: false });
      
      const result = await checkUserHasSleepData(userId);
      
      expect(result).toBe(true);
    });
    
    it('should return false if user has no sleep data', async () => {
      const { getDocs } = require('firebase/firestore');
      getDocs.mockResolvedValueOnce({ empty: true });
      
      const result = await checkUserHasSleepData(userId);
      
      expect(result).toBe(false);
    });
  });
});
