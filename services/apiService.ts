import type { Creation } from '../types';

const CREATIONS_KEY = 'adStudioCreations';
const CREDITS_KEY = 'adStudioCredits';
const MOCK_API_LATENCY = 500; // ms

// --- Helper Functions to simulate a database/localStorage ---

const getCreations = (): Creation[] => {
  try {
    const saved = localStorage.getItem(CREATIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to parse creations from localStorage", e);
    return [];
  }
};

const saveCreations = (creations: Creation[]): void => {
  localStorage.setItem(CREATIONS_KEY, JSON.stringify(creations));
};

const getCredits = (): number => {
  try {
    const saved = localStorage.getItem(CREDITS_KEY);
    // Give new users 20 free credits
    return saved ? JSON.parse(saved) : 20;
  } catch (e) {
    console.error("Failed to parse credits from localStorage", e);
    return 20;
  }
};

const saveCredits = (credits: number): void => {
  localStorage.setItem(CREDITS_KEY, JSON.stringify(credits));
};


// --- Mock API Service Functions ---

/**
 * Simulates fetching initial user data (creations and credits) from a backend.
 */
export const fetchInitialData = async (): Promise<{ creations: Creation[], credits: number }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        creations: getCreations(),
        credits: getCredits()
      });
    }, MOCK_API_LATENCY);
  });
};

/**
 * Simulates saving a new creation to the backend.
 */
export const saveCreation = async (creationData: Omit<Creation, 'id' | 'timestamp'>): Promise<Creation> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const creations = getCreations();
      const newCreation: Creation = {
        ...creationData,
        id: `creation-${Date.now()}`,
        timestamp: Date.now(),
      };
      const updatedCreations = [newCreation, ...creations];
      saveCreations(updatedCreations);
      resolve(newCreation);
    }, MOCK_API_LATENCY);
  });
};

/**
 * Simulates deleting a creation from the backend.
 */
export const deleteCreation = async (id: string): Promise<void> => {
   return new Promise(resolve => {
    setTimeout(() => {
      let creations = getCreations();
      creations = creations.filter(c => c.id !== id);
      saveCreations(creations);
      resolve();
    }, MOCK_API_LATENCY);
  });
};

/**
 * Simulates clearing all creations for a user from the backend.
 */
export const clearCreations = async (): Promise<void> => {
   return new Promise(resolve => {
    setTimeout(() => {
      saveCreations([]);
      resolve();
    }, MOCK_API_LATENCY);
  });
};

/**
 * Simulates a successful credit purchase on the backend.
 */
export const purchaseCredits = async (amount: number): Promise<number> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const currentCredits = getCredits();
            const newTotal = currentCredits + amount;
            saveCredits(newTotal);
            resolve(newTotal);
        }, MOCK_API_LATENCY);
    });
};

/**
 * Simulates deducting credits after a successful ad generation.
 */
export const deductCredits = async (amount: number): Promise<number> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const currentCredits = getCredits();
            if (currentCredits < amount) {
                return reject(new Error("Insufficient credits."));
            }
            const newTotal = currentCredits - amount;
            saveCredits(newTotal);
            resolve(newTotal);
        }, 100); // Shorter latency for a quick transaction
    });
};
