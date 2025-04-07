import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  // Game state
  dirtCount: number;
  totalDirtCollected: number;
  
  // Upgrades
  clickPower: number;
  autoClickerCount: number;
  multiClickPower: number;
  multiAutoClickPower: number;
  
  // Costs
  clickPowerCost: number;
  autoClickerCost: number;
  multiClickCost: number;
  multiAutoClickCost: number;
  
  // Actions
  increaseDirtCount: (amount: number) => void;
  purchaseClickPower: (quantity: number) => void;
  purchaseAutoClicker: (quantity: number) => void;
  purchaseMultiClick: (quantity: number) => void;
  purchaseMultiAutoClick: (quantity: number) => void;
  
  // Helper to check if player can afford an upgrade
  canAfford: (cost: number) => boolean;
  
  // Helper to calculate total price for multiple purchases
  calculateTotalPrice: (baseCost: number, quantity: number, growthRate: number) => number;
  
  // Reset game (for testing)
  resetGame: () => void;
}

// Calculates cost for a specific quantity of upgrades
const calculateCost = (baseCost: number, growthRate: number, quantity: number): number => {
  let totalCost = 0;
  for (let i = 0; i < quantity; i++) {
    totalCost += Math.floor(baseCost * Math.pow(1 + growthRate, i));
  }
  return totalCost;
};

// Create the store with persistence
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      dirtCount: 0,
      totalDirtCollected: 0,
      
      // Upgrades initial values
      clickPower: 1,
      autoClickerCount: 0,
      multiClickPower: 1.0,
      multiAutoClickPower: 1.0,
      
      // Base costs
      clickPowerCost: 10,
      autoClickerCost: 25,
      multiClickCost: 100,
      multiAutoClickCost: 200,
      
      // Actions
      increaseDirtCount: (amount) => {
        set((state) => ({ 
          dirtCount: state.dirtCount + amount,
          totalDirtCollected: state.totalDirtCollected + amount
        }));
      },
      
      canAfford: (cost) => {
        return get().dirtCount >= cost;
      },
      
      purchaseClickPower: (quantity) => {
        const state = get();
        const baseCost = 10; // Starting cost
        const growthRate = 0.15; // 15% increase per level
        
        // Calculate cost for quantity upgrades from current level
        const totalCost = calculateCost(
          baseCost * Math.pow(1 + growthRate, state.clickPower - 1), 
          growthRate, 
          quantity
        );
        
        // Check if player can afford
        if (state.canAfford(totalCost)) {
          set({
            dirtCount: state.dirtCount - totalCost,
            clickPower: state.clickPower + quantity,
            clickPowerCost: Math.floor(baseCost * Math.pow(1 + growthRate, state.clickPower + quantity - 1))
          });
        }
      },
      
      purchaseAutoClicker: (quantity) => {
        const state = get();
        const baseCost = 25; // Starting cost
        const growthRate = 0.15; // 15% increase per auto-clicker
        
        // Calculate cost for quantity upgrades from current level
        const totalCost = calculateCost(
          baseCost * Math.pow(1 + growthRate, state.autoClickerCount), 
          growthRate, 
          quantity
        );
        
        // Check if player can afford
        if (state.canAfford(totalCost)) {
          set({
            dirtCount: state.dirtCount - totalCost,
            autoClickerCount: state.autoClickerCount + quantity,
            autoClickerCost: Math.floor(baseCost * Math.pow(1 + growthRate, state.autoClickerCount + quantity))
          });
        }
      },
      
      purchaseMultiClick: (quantity) => {
        const state = get();
        const baseCost = 100; // Starting cost
        const growthRate = 0.3; // 30% increase per level
        
        // Calculate cost for quantity upgrades from current level
        const currentLevel = Math.round((state.multiClickPower - 1) * 10); // Convert to level (1.0 = 0, 1.1 = 1, etc)
        const totalCost = calculateCost(
          baseCost * Math.pow(1 + growthRate, currentLevel), 
          growthRate, 
          quantity
        );
        
        // Check if player can afford
        if (state.canAfford(totalCost)) {
          set({
            dirtCount: state.dirtCount - totalCost,
            multiClickPower: state.multiClickPower + (quantity * 0.1), // Each level adds +0.1 to multiplier
            multiClickCost: Math.floor(baseCost * Math.pow(1 + growthRate, currentLevel + quantity))
          });
        }
      },
      
      purchaseMultiAutoClick: (quantity) => {
        const state = get();
        const baseCost = 200; // Starting cost
        const growthRate = 0.3; // 30% increase per level
        
        // Calculate cost for quantity upgrades from current level
        const currentLevel = Math.round((state.multiAutoClickPower - 1) * 10); // Convert to level (1.0 = 0, 1.1 = 1, etc)
        const totalCost = calculateCost(
          baseCost * Math.pow(1 + growthRate, currentLevel), 
          growthRate, 
          quantity
        );
        
        // Check if player can afford
        if (state.canAfford(totalCost)) {
          set({
            dirtCount: state.dirtCount - totalCost,
            multiAutoClickPower: state.multiAutoClickPower + (quantity * 0.1), // Each level adds +0.1 to multiplier
            multiAutoClickCost: Math.floor(baseCost * Math.pow(1 + growthRate, currentLevel + quantity))
          });
        }
      },
      
      // Helper to calculate total price for multiple purchases
      calculateTotalPrice: (baseCost, quantity, growthRate) => {
        let total = 0;
        for (let i = 0; i < quantity; i++) {
          total += Math.floor(baseCost * Math.pow(1 + growthRate, i));
        }
        return total;
      },
      
      // Reset game (for testing)
      resetGame: () => {
        set({
          dirtCount: 0,
          totalDirtCollected: 0,
          clickPower: 1,
          autoClickerCount: 0,
          multiClickPower: 1.0,
          multiAutoClickPower: 1.0,
          clickPowerCost: 10,
          autoClickerCost: 25,
          multiClickCost: 100,
          multiAutoClickCost: 200,
        });
      },
    }),
    {
      name: 'dirt-clicker-storage', // Name for localStorage
    }
  )
);