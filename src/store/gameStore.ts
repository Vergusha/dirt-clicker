import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fixFloatingPoint } from '../utils/formatNumber';

interface GameState {
  // Game state
  dirtCount: number;
  totalDirtCollected: number;
  
  // Upgrades
  clickPower: number;
  autoClickerCount: number;
  multiAutoClickPower: number;
  friendlyEndermanCount: number;
  allayCount: number;
  luckyCatCount: number;
  pirateParrotCount: number;  // Добавляем счетчик для Пиратских Попугаев
  
  // Costs
  clickPowerCost: number;
  autoClickerCost: number;
  multiAutoClickCost: number;
  friendlyEndermanCost: number;
  allayCost: number;
  luckyCatCost: number;
  pirateParrotCost: number;  // Добавляем стоимость для Пиратских Попугаев
  
  // Audio settings
  musicEnabled: boolean;
  musicVolume: number;
  soundEffectsEnabled: boolean;
  shovelSoundsEnabled: boolean;
  shovelSoundsVolume: number;
  endermanSoundsEnabled: boolean;
  endermanSoundsVolume: number;
  allaySoundsEnabled: boolean;
  allaySoundsVolume: number;
  catSoundsEnabled: boolean;
  catSoundsVolume: number;
  parrotSoundsEnabled: boolean;
  parrotSoundsVolume: number;
  soundEffectsVolume: number;
  
  // Audio controls
  setMusicEnabled: (enabled: boolean) => void;
  setMusicVolume: (volume: number) => void;
  setSoundEffectsEnabled: (enabled: boolean) => void;
  setShovelSoundsEnabled: (enabled: boolean) => void;
  setShovelSoundsVolume: (volume: number) => void;
  setEndermanSoundsEnabled: (enabled: boolean) => void;
  setEndermanSoundsVolume: (volume: number) => void;
  setAllaySoundsEnabled: (enabled: boolean) => void;
  setAllaySoundsVolume: (volume: number) => void;
  setCatSoundsEnabled: (enabled: boolean) => void;
  setCatSoundsVolume: (volume: number) => void;
  setParrotSoundsEnabled: (enabled: boolean) => void;
  setParrotSoundsVolume: (volume: number) => void;
  setSoundEffectsVolume: (volume: number) => void;
  
  // Promo codes
  usedPromoCodes: string[];
  applyPromoCode: (code: string) => { success: boolean, message: string };
  
  // Actions
  increaseDirtCount: (amount: number) => void;
  purchaseClickPower: (quantity: number) => void;
  purchaseAutoClicker: (quantity: number) => boolean;
  purchaseMultiAutoClick: (quantity: number) => void;
  purchaseFriendlyEnderman: (quantity: number) => void;
  purchaseAllay: (quantity: number) => void;
  purchaseLuckyCat: (quantity: number) => void;
  purchasePirateParrot: (quantity: number) => void;  // Добавляем метод покупки Пиратского Попугая
  
  // Helper to check if player can afford an upgrade
  canAfford: (cost: number) => boolean;
  
  // Helper to calculate total price for multiple purchases
  calculateTotalPrice: (baseCost: number, quantity: number, growthRate: number) => number;
  
  // Reset game (for testing)
  resetGame: () => void;
  
  // Пересчет стоимости лопат
  recalculateShovelCosts: () => void;
  
  lastVisitTime: number;
  calculateOfflineProgress: () => { 
    earnedDirt: number;
    timeAwayInSeconds: number;
  };
  init: () => {
    earnedDirt: number;
    timeAwayInSeconds: number;
  };
  updateLastVisitTime: () => void;
}

// Calculates cost for a specific quantity of upgrades
const calculateCost = (baseCost: number, growthRate: number, quantity: number, startLevel: number = 0): number => {
  let totalCost = 0;
  
  for (let i = 0; i < quantity; i++) {
    const currentLevel = startLevel + i;
    // Просто рассчитываем стоимость с учетом роста 15%
    const levelCost = Math.floor(baseCost * Math.pow(1 + growthRate, currentLevel));
    totalCost += levelCost;
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
    'multiAutoClickCost',
    'friendlyEndermanCount',
    'friendlyEndermanCost',
    'allayCount',
    'allayCost',
    'luckyCatCount',
    'luckyCatCost',
    'pirateParrotCount',
    'pirateParrotCost'
  ];
  
  integerFields.forEach(field => {
    if (newState[field] !== undefined) {
      // Сначала исправляем проблемы с плавающей запятой, потом округляем
      newState[field] = Math.floor(fixFloatingPoint(Number(newState[field])));
    }
  });
  
  // Округляем множители до 2 знаков
  if (newState.multiAutoClickPower !== undefined) {
    // Исправляем проблемы с плавающей запятой, затем форматируем до 2 знаков
    newState.multiAutoClickPower = fixFloatingPoint(Number(newState.multiAutoClickPower));
    newState.multiAutoClickPower = Number(newState.multiAutoClickPower.toFixed(2));
  }
  
  // Пересчитываем стоимости, если они некорректные
  if (newState.clickPower !== undefined && newState.clickPowerCost !== undefined) {
    const baseCost = 10; // Обновлено с 5 на 10
    const growthRate = 0.15;
    newState.clickPowerCost = Math.floor(baseCost * Math.pow(1 + growthRate, newState.clickPower - 1));
  }
  
  if (newState.autoClickerCount !== undefined && newState.autoClickerCost !== undefined) {
    const baseCost = 50; // Обновлено с 15 на 50
    const growthRate = 0.15;
    newState.autoClickerCost = Math.floor(baseCost * Math.pow(1 + growthRate, newState.autoClickerCount));
  }
  
  if (newState.multiAutoClickPower !== undefined && newState.multiAutoClickCost !== undefined) {
    const baseCost = 250; // Обновлено с 100 на 250
    const growthRate = 0.15;
    const currentLevel = Math.round((newState.multiAutoClickPower - 1) * 10);
    newState.multiAutoClickCost = Math.floor(baseCost * Math.pow(1 + growthRate, currentLevel));
  }
  
  if (newState.friendlyEndermanCount !== undefined && newState.friendlyEndermanCost !== undefined) {
    const baseCost = 1000; // Обновлено с 500 на 1000
    const growthRate = 0.15;
    newState.friendlyEndermanCost = Math.floor(baseCost * Math.pow(1 + growthRate, newState.friendlyEndermanCount));
  }
  
  if (newState.allayCount !== undefined && newState.allayCost !== undefined) {
    const baseCost = 5000; // Обновлено с 1000 на 5000
    const growthRate = 0.15;
    newState.allayCost = Math.floor(baseCost * Math.pow(1 + growthRate, newState.allayCount));
  }
  
  if (newState.luckyCatCount !== undefined && newState.luckyCatCost !== undefined) {
    const baseCost = 10000; // Обновлено с 2000 на 10000
    const growthRate = 0.15;
    newState.luckyCatCost = Math.floor(baseCost * Math.pow(1 + growthRate, newState.luckyCatCount));
  }
  
  if (newState.pirateParrotCount !== undefined && newState.pirateParrotCost !== undefined) {
    const baseCost = 20000; // Обновлено с 3500 на 20000
    const growthRate = 0.15;
    newState.pirateParrotCost = Math.floor(baseCost * Math.pow(1 + growthRate, newState.pirateParrotCount));
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
      multiAutoClickPower: 1.0,
      friendlyEndermanCount: 0,
      allayCount: 0,
      luckyCatCount: 0,
      pirateParrotCount: 0,  // Начальное значение для Пиратских Попугаев
      
      // Base costs
      clickPowerCost: 10,     // Было 5, новая стоимость 10
      autoClickerCost: 50,    // Было 15, новая стоимость 50
      multiAutoClickCost: 250, // Было 100, новая стоимость 250
      friendlyEndermanCost: 1000, // Было 500, новая стоимость 1000
      allayCost: 5000,        // Было 1000, новая стоимость 5000
      luckyCatCost: 10000,    // Было 2000, новая стоимость 10000
      pirateParrotCost: 20000, // Было 3500, новая стоимость 20000
      
      // Audio settings initial values
      musicEnabled: true,
      musicVolume: 0.5,
      soundEffectsEnabled: true,
      shovelSoundsEnabled: true,
      shovelSoundsVolume: 0.5,
      endermanSoundsEnabled: true,
      endermanSoundsVolume: 0.5,
      allaySoundsEnabled: true,
      allaySoundsVolume: 0.5,
      catSoundsEnabled: true,
      catSoundsVolume: 0.5,
      parrotSoundsEnabled: true,
      parrotSoundsVolume: 0.5,
      soundEffectsVolume: 1,
      
      // Promo codes initial values
      usedPromoCodes: [],
      
      // Actions
      increaseDirtCount: (amount) => {
        set((state) => {
          // Используем fixFloatingPoint чтобы избежать проблем с числами с плавающей запятой
          const newDirtCount = fixFloatingPoint(state.dirtCount + amount);
          const newTotalCollected = fixFloatingPoint(state.totalDirtCollected + amount);
          return { 
            dirtCount: Math.floor(newDirtCount),
            totalDirtCollected: Math.floor(newTotalCollected)
          };
        });
      },
      
      canAfford: (cost) => {
        return get().dirtCount >= cost;
      },
      
      // Пересчет стоимости лопат
      recalculateShovelCosts: () => {
        set((state) => {
          const baseCost = 50; // Обновлено с 15 на 50
          const growthRate = 0.15;
          
          // Рассчитываем стоимость следующей покупки
          const nextCost = calculateCost(baseCost, growthRate, 1, state.autoClickerCount);
          
          return {
            autoClickerCost: nextCost
          };
        });
      },
      
      purchaseClickPower: (quantity) => {
        const state = get();
        const baseCost = 10; // Базовая стоимость из скриншота
        const growthRate = 0.15;
        
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
            clickPower: state.clickPower + quantity, // Каждый уровень даёт +1 к мощности клика
            clickPowerCost: Math.floor(baseCost * Math.pow(1 + growthRate, state.clickPower + quantity - 1))
          });
        }
      },
      
      purchaseAutoClicker: (amount: number = 1) => {
        const state = get();
        const baseCost = 50; // Базовая стоимость из скриншота
        const growthRate = 0.15;
        
        // Рассчитываем общую стоимость для текущей покупки
        const totalCost = calculateCost(baseCost, growthRate, amount, state.autoClickerCount);
        
        if (state.dirtCount >= totalCost) {
          const newCount = state.autoClickerCount + amount;
          
          // Рассчитываем стоимость следующей покупки
          const nextCost = calculateCost(baseCost, growthRate, 1, newCount);
          
          set({
            dirtCount: fixFloatingPoint(state.dirtCount - totalCost),
            autoClickerCount: newCount, // Каждая лопата даёт +1 землю в секунду
            autoClickerCost: nextCost
          });
          return true;
        }
        return false;
      },
      
      // Purchase Enchanted Wood Shovel (multiAutoClick)
      purchaseMultiAutoClick: (quantity) => {
        const currentLevel = get().multiAutoClickPower;
        let cost = 0;
        let nextMultiplier = 1;

        // Проверяем текущий уровень и необходимое количество обычных лопат
        if (currentLevel < 1.15) {
          cost = 250;
          nextMultiplier = 1.15;
        } else if (currentLevel >= 1.15 && currentLevel < 1.3) {
          if (get().autoClickerCount < 100) {
            console.log("Need Stone Shovel first!");
            return;
          }
          cost = 500;
          nextMultiplier = 1.3;
        } else if (currentLevel >= 1.3 && currentLevel < 1.5) {
          if (get().autoClickerCount < 200) {
            console.log("Need Iron Shovel first!");
            return;
          }
          cost = 1000;
          nextMultiplier = 1.5;
        } else if (currentLevel >= 1.5 && currentLevel < 1.7) {
          if (get().autoClickerCount < 300) {
            console.log("Need Golden Shovel first!");
            return;
          }
          cost = 2000;
          nextMultiplier = 1.7;
        } else if (currentLevel >= 1.7 && currentLevel < 1.9) {
          if (get().autoClickerCount < 500) {
            console.log("Need Diamond Shovel first!");
            return;
          }
          cost = 4000;
          nextMultiplier = 1.9;
        } else if (currentLevel >= 1.9 && currentLevel < 2.1) {
          if (get().autoClickerCount < 1000) {
            console.log("Need Netherite Shovel first!");
            return;
          }
          cost = 8000;
          nextMultiplier = 2.1;
        }

        // Если игрок может позволить себе покупку
        if (get().dirtCount >= cost) {
          set((state) => ({
            dirtCount: state.dirtCount - cost,
            multiAutoClickPower: nextMultiplier
          }));
        }
      },
      
      // Purchase Friendly Enderman
      purchaseFriendlyEnderman: (quantity) => {
        const state = get();
        const baseCost = 1000; // Базовая стоимость из скриншота
        const growthRate = 0.15;
        
        // Calculate cost for quantity upgrades from current level
        const totalCost = calculateCost(
          baseCost * Math.pow(1 + growthRate, state.friendlyEndermanCount), 
          growthRate, 
          quantity
        );
        
        // Check if player can afford
        if (state.canAfford(totalCost)) {
          set({
            dirtCount: Math.floor(state.dirtCount - totalCost),
            friendlyEndermanCount: state.friendlyEndermanCount + quantity, // Каждый Эндермен даёт +5 земли в секунду
            friendlyEndermanCost: Math.floor(baseCost * Math.pow(1 + growthRate, state.friendlyEndermanCount + quantity))
          });
        }
      },
      
      // Purchase Allay
      purchaseAllay: (quantity) => {
        const state = get();
        const baseCost = 5000; // Базовая стоимость из скриншота
        const growthRate = 0.15;
        
        // Calculate cost for quantity upgrades from current level
        const totalCost = calculateCost(
          baseCost * Math.pow(1 + growthRate, state.allayCount), 
          growthRate, 
          quantity
        );
        
        // Check if player can afford
        if (state.canAfford(totalCost)) {
          set({
            dirtCount: Math.floor(state.dirtCount - totalCost),
            allayCount: state.allayCount + quantity, // Каждый Allay даёт x1.2 к общей добыче
            allayCost: Math.floor(baseCost * Math.pow(1 + growthRate, state.allayCount + quantity))
          });
        }
      },

      // Purchase Lucky Cat
      purchaseLuckyCat: (quantity) => {
        const state = get();
        const baseCost = 10000; // Базовая стоимость из скриншота
        const growthRate = 0.15;
        const maxLevel = 10; // Максимальный уровень котов
        
        // Проверяем, не превышен ли максимальный уровень
        if (state.luckyCatCount >= maxLevel) {
          return; // Выходим из функции, если достигнут максимальный уровень
        }
        
        // Ограничиваем количество покупок до максимального уровня
        const actualQuantity = Math.min(quantity, maxLevel - state.luckyCatCount);
        
        if (actualQuantity <= 0) {
          return; // Выходим, если нечего покупать
        }
        
        // Calculate cost for quantity upgrades from current level
        const totalCost = calculateCost(
          baseCost * Math.pow(1 + growthRate, state.luckyCatCount), 
          growthRate, 
          actualQuantity
        );
        
        // Check if player can afford
        if (state.canAfford(totalCost)) {
          set({
            dirtCount: Math.floor(state.dirtCount - totalCost),
            luckyCatCount: state.luckyCatCount + actualQuantity, // Каждый Lucky Cat даёт 10% шанс x10 на клик
            luckyCatCost: Math.floor(baseCost * Math.pow(1 + growthRate, state.luckyCatCount + actualQuantity))
          });
        }
      },

      // Purchase Pirate Parrot
      purchasePirateParrot: (quantity) => {
        const state = get();
        const baseCost = 20000; // Базовая стоимость из скриншота
        const growthRate = 0.15;
        
        // Calculate cost for quantity upgrades from current level
        const totalCost = calculateCost(
          baseCost * Math.pow(1 + growthRate, state.pirateParrotCount), 
          growthRate, 
          quantity
        );
        
        // Check if player can afford
        if (state.canAfford(totalCost)) {
          set({
            dirtCount: Math.floor(state.dirtCount - totalCost),
            pirateParrotCount: state.pirateParrotCount + quantity, // Каждый попугай даёт +10 земли в секунду
            pirateParrotCost: Math.floor(baseCost * Math.pow(1 + growthRate, state.pirateParrotCount + quantity))
          });
        }
      },
      
      // Helper to calculate total price for multiple purchases
      calculateTotalPrice: (baseCost, quantity, growthRate) => {
        const state = get();
        let level = 0;
        
        // Определяем текущий уровень улучшения на основе базовой стоимости
        switch (baseCost) {
          case 50: // Wood Shovel (обновлено с 15 на 50)
            level = state.autoClickerCount;
            break;
          case 10: // Click Power (обновлено с 5 на 10)
            level = state.clickPower - 1;
            break;
          case 250: // Enchanted Wood Shovel (обновлено с 100 на 250)
            level = Math.round((state.multiAutoClickPower - 1) * 10);
            break;
          case 1000: // Friendly Enderman (обновлено с 500 на 1000)
            level = state.friendlyEndermanCount;
            break;
          case 5000: // Allay (обновлено с 1000 на 5000)
            level = state.allayCount;
            break;
          case 10000: // Lucky Cat (обновлено с 2000 на 10000)
            level = state.luckyCatCount;
            break;
          case 20000: // Pirate Parrot (обновлено с 3500 на 20000)
            level = state.pirateParrotCount;
            break;
        }
        
        // Используем функцию calculateCost для расчета общей стоимости
        return calculateCost(baseCost, growthRate, quantity, level);
      },
      
      // Reset game (for testing)
      resetGame: () => {
        set({
          dirtCount: 0,
          totalDirtCollected: 0,
          clickPower: 1,
          autoClickerCount: 0,
          multiAutoClickPower: 1.0, // Сбрасываем множитель до базового 1.0
          friendlyEndermanCount: 0,
          allayCount: 0,
          luckyCatCount: 0,
          pirateParrotCount: 0,
          clickPowerCost: 10,
          autoClickerCost: 50,
          multiAutoClickCost: 250, // Возвращаем стоимость для первой покупки
          friendlyEndermanCost: 1000,
          allayCost: 5000,
          luckyCatCost: 10000,
          pirateParrotCost: 20000,
          usedPromoCodes: [],
        });
      },
      
      // Apply promo code
      applyPromoCode: (code) => {
        const state = get();
        
        // Промокод для сброса прогресса
        if (code === "Dead") {
          get().resetGame();
          return { success: true, message: "Весь прогресс был сброшен!" };
        }
        
        // Промокод Sasha (bc земли)
        if (code === "Sasha") {
          // bc соответствует индексу 5 + 1*26 + 2 = 33 (после T идут aa=5, ab=6, ..., bc=33)
          const amount = Math.pow(1000, 33); // 1000^33 земли
          set({
            dirtCount: fixFloatingPoint(state.dirtCount + amount),
            totalDirtCollected: fixFloatingPoint(state.totalDirtCollected + amount),
          });
          return { success: true, message: "ВАУ! Вы получили bc земли!" };
        }
        
        // Промокод 1zz (zz земли)
        if (code === "1zz") {
          // zz соответствует индексу 5 + 25*26 + 25 = 680 (после T идут aa=5, ab=6, ..., zz=680)
          const amount = Math.pow(1000, 680); // 1000^680 земли
          set({
            dirtCount: fixFloatingPoint(state.dirtCount + amount),
            totalDirtCollected: fixFloatingPoint(state.totalDirtCollected + amount),
          });
          return { success: true, message: "ВАУ! Вы получили zz земли!" };
        }
        
        // Специальный промокод для 50 триллионов земли
        if (code.toLowerCase() === "get50trilliondirt") {
          const amount = 50000000000000; // 50 триллионов
          set({
            dirtCount: fixFloatingPoint(state.dirtCount + amount),
            totalDirtCollected: fixFloatingPoint(state.totalDirtCollected + amount),
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
            dirtCount: fixFloatingPoint(state.dirtCount + dirtAmount),
            totalDirtCollected: fixFloatingPoint(state.totalDirtCollected + dirtAmount),
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
      setMusicEnabled: (enabled) => set({ musicEnabled: enabled }),
      setMusicVolume: (volume) => set({ musicVolume: volume }),
      setSoundEffectsEnabled: (enabled) => set({ soundEffectsEnabled: enabled }),
      setShovelSoundsEnabled: (enabled) => set({ shovelSoundsEnabled: enabled }),
      setShovelSoundsVolume: (volume) => set({ shovelSoundsVolume: volume }),
      setEndermanSoundsEnabled: (enabled) => set({ endermanSoundsEnabled: enabled }),
      setEndermanSoundsVolume: (volume) => set({ endermanSoundsVolume: volume }),
      setAllaySoundsEnabled: (enabled) => set({ allaySoundsEnabled: enabled }),
      setAllaySoundsVolume: (volume) => set({ allaySoundsVolume: volume }),
      setCatSoundsEnabled: (enabled) => set({ catSoundsEnabled: enabled }),
      setCatSoundsVolume: (volume) => set({ catSoundsVolume: volume }),
      setParrotSoundsEnabled: (enabled) => set({ parrotSoundsEnabled: enabled }),
      setParrotSoundsVolume: (volume) => set({ parrotSoundsVolume: volume }),
      setSoundEffectsVolume: (volume) => set({ soundEffectsVolume: volume }),
      
      fixFloatingPointNumbers: () => {
        set((state) => {
          const newState = { ...state };
          
          // Всегда округляем до целых чисел для основных значений
          const integerFields = [
            'dirtCount',
            'totalDirtCollected',
            'clickPower',
            'autoClickerCount',
            'clickPowerCost',
            'autoClickerCost',
            'multiAutoClickCost',
            'friendlyEndermanCount',
            'friendlyEndermanCost',
            'allayCount',
            'allayCost',
            'luckyCatCount',
            'luckyCatCost',
            'pirateParrotCount',
            'pirateParrotCost'
          ];
          
          integerFields.forEach(field => {
            if (newState[field as keyof typeof newState] !== undefined) {
              // Сначала исправляем проблемы с плавающей запятой, потом округляем
              (newState as any)[field] = Math.floor(fixFloatingPoint(Number((newState as any)[field])));
            }
          });
          
          // Округляем множители до 2 знаков
          if (newState.multiAutoClickPower !== undefined) {
            // Исправляем проблемы с плавающей запятой, затем форматируем до 2 знаков
            newState.multiAutoClickPower = fixFloatingPoint(Number(newState.multiAutoClickPower));
            newState.multiAutoClickPower = Number(newState.multiAutoClickPower.toFixed(2));
          }
          
          // Пересчитываем стоимости, если они некорректные
          if (newState.clickPower !== undefined && newState.clickPowerCost !== undefined) {
            const baseCost = 10; // Обновлено с 5 на 10
            const growthRate = 0.15;
            newState.clickPowerCost = Math.floor(baseCost * Math.pow(1 + growthRate, newState.clickPower - 1));
          }
          
          if (newState.autoClickerCount !== undefined && newState.autoClickerCost !== undefined) {
            const baseCost = 50; // Обновлено с 15 на 50
            const growthRate = 0.15;
            newState.autoClickerCost = Math.floor(baseCost * Math.pow(1 + growthRate, newState.autoClickerCount));
          }
          
          if (newState.multiAutoClickPower !== undefined && newState.multiAutoClickCost !== undefined) {
            const baseCost = 250; // Обновлено с 100 на 250
            const growthRate = 0.15;
            const currentLevel = Math.round((newState.multiAutoClickPower - 1) * 10);
            newState.multiAutoClickCost = Math.floor(baseCost * Math.pow(1 + growthRate, currentLevel));
          }
          
          if (newState.friendlyEndermanCount !== undefined && newState.friendlyEndermanCost !== undefined) {
            const baseCost = 1000; // Обновлено с 500 на 1000
            const growthRate = 0.15;
            newState.friendlyEndermanCost = Math.floor(baseCost * Math.pow(1 + growthRate, newState.friendlyEndermanCount));
          }
          
          if (newState.allayCount !== undefined && newState.allayCost !== undefined) {
            const baseCost = 5000; // Обновлено с 1000 на 5000
            const growthRate = 0.15;
            newState.allayCost = Math.floor(baseCost * Math.pow(1 + growthRate, newState.allayCount));
          }
          
          if (newState.luckyCatCount !== undefined && newState.luckyCatCost !== undefined) {
            const baseCost = 10000; // Обновлено с 2000 на 10000
            const growthRate = 0.15;
            newState.luckyCatCost = Math.floor(baseCost * Math.pow(1 + growthRate, newState.luckyCatCount));
          }
          
          if (newState.pirateParrotCount !== undefined && newState.pirateParrotCost !== undefined) {
            const baseCost = 20000; // Обновлено с 3500 на 20000
            const growthRate = 0.15;
            newState.pirateParrotCost = Math.floor(baseCost * Math.pow(1 + growthRate, newState.pirateParrotCount));
          }
          
          return newState;
        });
      },
      
      lastVisitTime: Date.now(),
      
      calculateOfflineProgress: () => {
        const currentTime = Date.now();
        const lastVisitTime = get().lastVisitTime;
        const timeAwayInSeconds = Math.floor((currentTime - lastVisitTime) / 1000);
        
        // Если прошло меньше 30 секунд или это первый визит, не показываем прогресс
        if (timeAwayInSeconds < 30 || lastVisitTime === 0) {
          set({ lastVisitTime: currentTime });
          return {
            earnedDirt: 0,
            timeAwayInSeconds: 0
          };
        }
        
        // Получаем текущую скорость добычи в секунду
        const state = get();
        
        // Расчет всех источников дохода
        const autoClickPower = state.autoClickerCount * (state.multiAutoClickPower > 1.0 ? state.multiAutoClickPower : 1.0);
        const endermanPower = state.friendlyEndermanCount * 5;
        const pirateParrotPower = state.pirateParrotCount * 10;
        
        // Применяем множитель от Allay
        const allayMultiplier = state.allayCount > 0 ? 1 + (state.allayCount * 0.2) : 1;
        
        // Общая скорость добычи в секунду
        const dirtPerSecond = (autoClickPower + endermanPower + pirateParrotPower) * allayMultiplier;
        
        // Рассчитываем заработанную землю
        const earnedDirt = Math.floor(dirtPerSecond * timeAwayInSeconds);
        
        // Обновляем время последнего визита и добавляем заработанную землю
        set({
          lastVisitTime: currentTime,
          dirtCount: state.dirtCount + earnedDirt
        });
        
        return {
          earnedDirt,
          timeAwayInSeconds
        };
      },

      // Функция для обновления времени последнего визита при закрытии страницы
      updateLastVisitTime: () => {
        set({ lastVisitTime: Date.now() });
      },

      // Обновляем существующую функцию init
      init: () => {
        const offlineProgress = get().calculateOfflineProgress();
        return offlineProgress;
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
          
          // Пересчитываем стоимость лопат
          state.recalculateShovelCosts();
        }
      }
    }
  )
);