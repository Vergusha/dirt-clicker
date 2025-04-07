import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameState {
  dirtCount: number
  clickPower: number
  autoClickerCount: number
  multiClickPower: number
  clickPowerPrice: number
  autoClickerPrice: number
  multiClickPrice: number
  
  // Actions
  increaseDirtCount: (amount: number) => void
  buyClickPower: () => void
  buyAutoClicker: () => void
  buyMultiClick: () => void
  resetGame: () => void
}

// Initial state values
const initialState = {
  dirtCount: 0,
  clickPower: 1,
  autoClickerCount: 0,
  multiClickPower: 1,
  clickPowerPrice: 10,
  autoClickerPrice: 50,
  multiClickPrice: 100,
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...initialState,
      
      increaseDirtCount: (amount) => set((state) => ({ 
        dirtCount: state.dirtCount + amount 
      })),
      
      buyClickPower: () => set((state) => {
        if (state.dirtCount < state.clickPowerPrice) return state
        
        return {
          dirtCount: state.dirtCount - state.clickPowerPrice,
          clickPower: state.clickPower + 1,
          clickPowerPrice: Math.floor(state.clickPowerPrice * 1.5)
        }
      }),
      
      buyAutoClicker: () => set((state) => {
        if (state.dirtCount < state.autoClickerPrice) return state
        
        return {
          dirtCount: state.dirtCount - state.autoClickerPrice,
          autoClickerCount: state.autoClickerCount + 1,
          autoClickerPrice: Math.floor(state.autoClickerPrice * 1.8)
        }
      }),
      
      buyMultiClick: () => set((state) => {
        if (state.dirtCount < state.multiClickPrice) return state
        
        return {
          dirtCount: state.dirtCount - state.multiClickPrice,
          multiClickPower: state.multiClickPower + 1,
          multiClickPrice: Math.floor(state.multiClickPrice * 2.2)
        }
      }),
      
      resetGame: () => set(initialState)
    }),
    {
      name: 'dirt-clicker-storage',
    }
  )
)