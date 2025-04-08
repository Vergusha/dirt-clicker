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
  
  // Audio settings
  musicEnabled: boolean;
  musicVolume: number;
  soundEffectsEnabled: boolean;
  shovelSoundsEnabled: boolean;
  
  // Audio controls
  setMusicEnabled: (enabled: boolean) => void;
  setMusicVolume: (volume: number) => void;
  setSoundEffectsEnabled: (enabled: boolean) => void;
  setShovelSoundsEnabled: (enabled: boolean) => void;
  
  // Promo codes
  usedPromoCodes: string[];
  applyPromoCode: (code: string) => { success: boolean, message: string };
  
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
const calculateCost = (baseCost: number, growthRate: number, quantity: number, startLevel: number = 0): number => {
  let totalCost = 0;
  for (let i = 0; i < quantity; i++) {
    // Каждое следующее улучшение дороже предыдущего на коэффициент growthRate
    totalCost += Math.floor(baseCost * Math.pow(1 + growthRate, startLevel + i));
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
      
      // Audio settings initial values
      musicEnabled: true,
      musicVolume: 0.5,
      soundEffectsEnabled: true,
      shovelSoundsEnabled: true,
      
      // Promo codes initial values
      usedPromoCodes: [],
      
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
        const growthRate = 0.10; // Снижен рост с 15% до 10% за Wood Shovel
        
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
        } else if (baseCost === 15) { // Wood Shovel - обновлено значение
          level = state.autoClickerCount;
          growthRate = 0.10; // Используем новый коэффициент роста
        } else if (baseCost === 50) { // Multi Click - обновлено значение
          level = Math.round((state.multiClickPower - 1) * 10);
          growthRate = 0.15; // Используем новый коэффициент роста
        } else if (baseCost === 100) { // Enchanted Wood Shovel - обновлено значение
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
          usedPromoCodes: [],
        });
      },
      
      // Apply promo code
      applyPromoCode: (code) => {
        const state = get();
        
        // Специальный промокод для 50 триллионов земли
        if (code.toLowerCase() === "get50trilliondirt") {
          const amount = 50000000000000; // 50 триллионов
          set({
            dirtCount: state.dirtCount + amount,
            totalDirtCollected: state.totalDirtCollected + amount,
          });
          return { success: true, message: "WOW! You received 50 trillion dirt!" };
        }
        
        // Обычные промокоды (с ограничением на однократное использование)
        const promoCodes: Record<string, { dirt: number, message: string, oneTime?: boolean }> = {
          "PROMO10": { dirt: 10, message: "You received 10 dirt!", oneTime: true },
          "PROMO50": { dirt: 50, message: "You received 50 dirt!", oneTime: true },
          "PROMO100": { dirt: 100, message: "You received 100 dirt!", oneTime: true }
        };
        
        const normalizedCode = code.toUpperCase();
        
        if (promoCodes[normalizedCode]) {
          // Проверить, использовался ли уже этот промокод, если он одноразовый
          if (promoCodes[normalizedCode].oneTime && state.usedPromoCodes.includes(normalizedCode)) {
            return { success: false, message: "Promo code already used." };
          }
          
          // Добавить землю
          const dirtAmount = promoCodes[normalizedCode].dirt;
          set({
            dirtCount: state.dirtCount + dirtAmount,
            totalDirtCollected: state.totalDirtCollected + dirtAmount,
            // Добавляем код в список использованных, только если он одноразовый
            usedPromoCodes: promoCodes[normalizedCode].oneTime 
              ? [...state.usedPromoCodes, normalizedCode] 
              : state.usedPromoCodes
          });
          
          return { success: true, message: promoCodes[normalizedCode].message };
        } else {
          return { success: false, message: "Invalid promo code." };
        }
      },
      
      // Audio controls
      setMusicEnabled: (enabled) => {
        set({ musicEnabled: enabled });
      },
      
      setMusicVolume: (volume) => {
        set({ musicVolume: volume });
      },
      
      setSoundEffectsEnabled: (enabled) => {
        set({ soundEffectsEnabled: enabled });
      },

      setShovelSoundsEnabled: (enabled) => {
        set({ shovelSoundsEnabled: enabled });
      },
    }),
    {
      name: 'dirt-clicker-storage', // Name for localStorage
      onRehydrateStorage: () => (state) => {
        // Исправляем числа с плавающей запятой при загрузке сохраненных данных
        if (state) {
          const fixedState = fixFloatingPointNumbers(state) as Partial<GameState>;
          Object.keys(fixedState).forEach(key => {
            const typedKey = key as keyof GameState;
            if ((state as any)[typedKey] !== fixedState[typedKey]) {
              (state as any)[typedKey] = fixedState[typedKey];
            }
          });
        }
      }
    }
  )
);