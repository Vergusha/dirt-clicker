import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Define types for our store
interface GameState {
  dirtCount: number
  clickPower: number
  autoClickerCount: number
  multiClickPower: number
  multiAutoClickPower: number
  clickPowerPrice: number
  autoClickerPrice: number
  multiClickPrice: number
  multiAutoClickPrice: number
  
  // Actions
  increaseDirtCount: (amount: number) => void
  buyClickPower: (quantity: number) => void
  buyAutoClicker: (quantity: number) => void
  buyMultiClick: (quantity: number) => void
  buyMultiAutoClick: (quantity: number) => void
  
  // Calculate total price for multiple upgrades
  calculateTotalPrice: (basePrice: number, quantity: number, growth: number) => number
}

// Helper function to calculate price for multiple upgrades
const calculatePrice = (basePrice: number, quantity: number, growth: number = 1.15): number => {
  if (quantity === 1) return basePrice;
  
  // For multiple upgrades, use the sum of geometric series formula
  // total = basePrice * (1 - growth^quantity) / (1 - growth)
  return Math.floor(basePrice * (1 - Math.pow(growth, quantity)) / (1 - growth));
};

// Create the store with persistence
export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      dirtCount: 0,
      clickPower: 1,
      autoClickerCount: 0,
      multiClickPower: 1,
      multiAutoClickPower: 1,
      clickPowerPrice: 10,
      autoClickerPrice: 50,
      multiClickPrice: 100,
      multiAutoClickPrice: 200,
      
      // Calculate total price for multiple upgrades
      calculateTotalPrice: (basePrice: number, quantity: number, growth: number = 1.15) => {
        return calculatePrice(basePrice, quantity, growth);
      },
      
      // Add dirt to the counter
      increaseDirtCount: (amount) => set((state) => ({ dirtCount: state.dirtCount + amount })),
      
      // Buy click power upgrades
      buyClickPower: (quantity) => set((state) => {
        // Calculate the total price for quantity upgrades
        let totalPrice = 0;
        let nextPrice = state.clickPowerPrice;
        
        for (let i = 0; i < quantity; i++) {
          totalPrice += nextPrice;
          nextPrice = Math.floor(nextPrice * 1.15); // 15% increase per level
        }
        
        // Check if player can afford it
        if (state.dirtCount < totalPrice) return state;
        
        // Apply the purchase
        return {
          dirtCount: state.dirtCount - totalPrice,
          clickPower: state.clickPower + quantity,
          clickPowerPrice: nextPrice
        };
      }),
      
      // Buy auto clicker upgrades
      buyAutoClicker: (quantity) => set((state) => {
        // Calculate the total price for quantity upgrades
        let totalPrice = 0;
        let nextPrice = state.autoClickerPrice;
        
        for (let i = 0; i < quantity; i++) {
          totalPrice += nextPrice;
          nextPrice = Math.floor(nextPrice * 1.15); // 15% increase per level
        }
        
        // Check if player can afford it
        if (state.dirtCount < totalPrice) return state;
        
        // Apply the purchase
        return {
          dirtCount: state.dirtCount - totalPrice,
          autoClickerCount: state.autoClickerCount + quantity,
          autoClickerPrice: nextPrice
        };
      }),
      
      // Buy multi-click upgrades
      buyMultiClick: (quantity) => set((state) => {
        // Calculate the total price for quantity upgrades
        let totalPrice = 0;
        let nextPrice = state.multiClickPrice;
        
        for (let i = 0; i < quantity; i++) {
          totalPrice += nextPrice;
          nextPrice = Math.floor(nextPrice * 1.25); // 25% increase per level
        }
        
        // Check if player can afford it
        if (state.dirtCount < totalPrice) return state;
        
        // Apply the purchase
        return {
          dirtCount: state.dirtCount - totalPrice,
          multiClickPower: state.multiClickPower + quantity,
          multiClickPrice: nextPrice
        };
      }),
      
      // Buy multi-autoclick upgrades
      buyMultiAutoClick: (quantity) => set((state) => {
        // Calculate the total price for quantity upgrades
        let totalPrice = 0;
        let nextPrice = state.multiAutoClickPrice;
        
        for (let i = 0; i < quantity; i++) {
          totalPrice += nextPrice;
          nextPrice = Math.floor(nextPrice * 1.25); // 25% increase per level
        }
        
        // Check if player can afford it
        if (state.dirtCount < totalPrice) return state;
        
        // Apply the purchase
        return {
          dirtCount: state.dirtCount - totalPrice,
          multiAutoClickPower: state.multiAutoClickPower + quantity,
          multiAutoClickPrice: nextPrice
        };
      })
    }),
    {
      name: 'dirt-clicker-storage'
    }
  )
)