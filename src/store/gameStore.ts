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

// Функция для исправления чисел с плавающей запятой и обработки изменений базовых стоимостей
const fixFloatingPointNumbers = (state: any) => {
  const newState = { ...state };
  
  // Всегда округляем до целых чисел для основных значений
  const integerFields = [
    'dirtCount',
    'totalDirtCollected',
    'clickPower',
    'autoClickerCount',
    'clickPowerCost',
    'autoClickerCost',
    'multiClickCost',
    'multiAutoClickCost'
  ];
  
  integerFields.forEach(field => {
    if (newState[field] !== undefined) {
      newState[field] = Math.floor(Number(newState[field]));
    }
  });
  
  // Округляем множители до 2 знаков
  if (newState.multiClickPower !== undefined) {
    newState.multiClickPower = Number(Number(newState.multiClickPower).toFixed(2));
  }
  
  if (newState.multiAutoClickPower !== undefined) {
    newState.multiAutoClickPower = Number(Number(newState.multiAutoClickPower).toFixed(2));
  }
  
  // Пересчитываем стоимости, если они некорректные
  if (newState.clickPower !== undefined && newState.clickPowerCost !== undefined) {
    const baseCost = 5;
    const growthRate = 0.08;
    newState.clickPowerCost = Math.floor(baseCost * Math.pow(1 + growthRate, newState.clickPower - 1));
  }
  
  if (newState.autoClickerCount !== undefined && newState.autoClickerCost !== undefined) {
    const baseCost = 15;
    const growthRate = 0.10;
    newState.autoClickerCost = Math.floor(baseCost * Math.pow(1 + growthRate, newState.autoClickerCount));
  }
  
  if (newState.multiClickPower !== undefined && newState.multiClickCost !== undefined) {
    const baseCost = 50;
    const growthRate = 0.15;
    const currentLevel = Math.round((newState.multiClickPower - 1) * 10);
    newState.multiClickCost = Math.floor(baseCost * Math.pow(1 + growthRate, currentLevel));
  }
  
  if (newState.multiAutoClickPower !== undefined && newState.multiAutoClickCost !== undefined) {
    const baseCost = 100;
    const growthRate = 0.15;
    const currentLevel = Math.round((newState.multiAutoClickPower - 1) * 10);
    newState.multiAutoClickCost = Math.floor(baseCost * Math.pow(1 + growthRate, currentLevel));
  }
  
  return newState;
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
      
      // Base costs - более низкие начальные цены
      clickPowerCost: 5,
      autoClickerCost: 15, 
      multiClickCost: 50,
      multiAutoClickCost: 100,
      
      // Actions
      increaseDirtCount: (amount) => {
        set((state) => {
          const newDirtCount = Math.floor(state.dirtCount + amount);
          const newTotalCollected = Math.floor(state.totalDirtCollected + amount);
          return { 
            dirtCount: newDirtCount,
            totalDirtCollected: newTotalCollected
          };
        });
      },
      
      canAfford: (cost) => {
        return get().dirtCount >= cost;
      },
      
      purchaseClickPower: (quantity) => {
        const state = get();
        const baseCost = 5; // Снижена начальная стоимость
        const growthRate = 0.08; // Снижен рост с 15% до 8% за уровень
        
        // Calculate cost for quantity upgrades from current level
        const totalCost = calculateCost(
          baseCost * Math.pow(1 + growthRate, state.clickPower - 1), 
          growthRate, 
          quantity
        );
        
        // Check if player can afford
        if (state.canAfford(totalCost)) {
          set({
            dirtCount: Math.floor(state.dirtCount - totalCost),
            clickPower: state.clickPower + quantity,
            clickPowerCost: Math.floor(baseCost * Math.pow(1 + growthRate, state.clickPower + quantity - 1))
          });
        }
      },
      
      purchaseAutoClicker: (quantity) => {
        const state = get();
        const baseCost = 15; // Снижена начальная стоимость
        const growthRate = 0.10; // Снижен рост с 15% до 10% за автокликер
        
        // Calculate cost for quantity upgrades from current level
        const totalCost = calculateCost(
          baseCost * Math.pow(1 + growthRate, state.autoClickerCount), 
          growthRate, 
          quantity
        );
        
        // Check if player can afford
        if (state.canAfford(totalCost)) {
          set({
            dirtCount: Math.floor(state.dirtCount - totalCost),
            autoClickerCount: state.autoClickerCount + quantity,
            autoClickerCost: Math.floor(baseCost * Math.pow(1 + growthRate, state.autoClickerCount + quantity))
          });
        }
      },
      
      // Округляем значения до 2 знаков после запятой для всех чисел с плавающей точкой
      purchaseMultiClick: (quantity) => {
        const state = get();
        const baseCost = 50; // Снижена начальная стоимость
        const growthRate = 0.15; // Снижен рост с 30% до 15% за уровень
        
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
            dirtCount: Math.floor(state.dirtCount - totalCost),
            multiClickPower: parseFloat((state.multiClickPower + (quantity * 0.1)).toFixed(2)), // Округляем до 2 знаков
            multiClickCost: Math.floor(baseCost * Math.pow(1 + growthRate, currentLevel + quantity))
          });
        }
      },
      
      // Округляем значения до 2 знаков после запятой для всех чисел с плавающей точкой
      purchaseMultiAutoClick: (quantity) => {
        const state = get();
        const baseCost = 100; // Снижена начальная стоимость
        const growthRate = 0.15; // Снижен рост с 30% до 15% за уровень
        
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
            dirtCount: Math.floor(state.dirtCount - totalCost),
            multiAutoClickPower: parseFloat((state.multiAutoClickPower + (quantity * 0.1)).toFixed(2)), // Округляем до 2 знаков
            multiAutoClickCost: Math.floor(baseCost * Math.pow(1 + growthRate, currentLevel + quantity))
          });
        }
      },
      
      // Helper to calculate total price for multiple purchases
      calculateTotalPrice: (baseCost, quantity, growthRate) => {
        const state = get();
        let level = 0;
        
        // Определяем текущий уровень улучшения на основе базовой стоимости
        if (baseCost === 5) { // Click Power - обновлено значение
          level = state.clickPower - 1;
          growthRate = 0.08; // Используем новый коэффициент роста
        } else if (baseCost === 15) { // Auto Clicker - обновлено значение
          level = state.autoClickerCount;
          growthRate = 0.10; // Используем новый коэффициент роста
        } else if (baseCost === 50) { // Multi Click - обновлено значение
          level = Math.round((state.multiClickPower - 1) * 10);
          growthRate = 0.15; // Используем новый коэффициент роста
        } else if (baseCost === 100) { // Multi AutoClick - обновлено значение
          level = Math.round((state.multiAutoClickPower - 1) * 10);
          growthRate = 0.15; // Используем новый коэффициент роста
        }
        
        // Рассчитываем общую стоимость с учетом текущего уровня
        let totalCost = 0;
        const actualBaseCost = baseCost * Math.pow(1 + growthRate, level);
        
        for (let i = 0; i < quantity; i++) {
          totalCost += Math.floor(actualBaseCost * Math.pow(1 + growthRate, i));
        }
        
        return Math.floor(totalCost);
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
          clickPowerCost: 5, // Обновлено значение
          autoClickerCost: 15, // Обновлено значение
          multiClickCost: 50, // Обновлено значение
          multiAutoClickCost: 100, // Обновлено значение
        });
      },
    }),
    {
      name: 'dirt-clicker-storage', // Name for localStorage
      onRehydrateStorage: () => (state) => {
        // Исправляем числа с плавающей запятой при загрузке сохраненных данных
        if (state) {
          const fixedState = fixFloatingPointNumbers(state);
          Object.keys(fixedState).forEach(key => {
            if (state[key] !== fixedState[key]) {
              state[key] = fixedState[key];
            }
          });
        }
      }
    }
  )
);