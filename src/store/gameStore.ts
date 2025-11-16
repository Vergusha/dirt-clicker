import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fixFloatingPoint } from '../utils/formatNumber';
import { BASE_COSTS, GROWTH_RATE, PRODUCTION_RATES, MULTIPLIERS, LIMITS, AUDIO_DEFAULTS } from '../constants/gameConstants';

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
  foxCount: number;

  // Costs
  clickPowerCost: number;
  autoClickerCost: number;
  multiAutoClickCost: number;
  friendlyEndermanCost: number;
  allayCost: number;
  luckyCatCost: number;
  pirateParrotCost: number;  // Добавляем стоимость для Пиратских Попугаев
  foxCost: number;

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
  foxSoundsEnabled: boolean;
  foxSoundsVolume: number;
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
  setFoxSoundsEnabled: (enabled: boolean) => void;
  setFoxSoundsVolume: (volume: number) => void;
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
  purchaseFox: (quantity: number) => void;

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

// Calculates cost for a specific quantity of upgrades using geometric series formula
const calculateCost = (baseCost: number, growthRate: number, quantity: number, startLevel: number = 0): number => {
  if (quantity === 0) return 0;
  if (quantity === 1) {
    return Math.floor(baseCost * Math.pow(1 + growthRate, startLevel));
  }

  // Using geometric series formula: a * (r^n - 1) / (r - 1)
  // where a = baseCost * (1 + growthRate)^startLevel, r = (1 + growthRate), n = quantity
  const a = baseCost * Math.pow(1 + growthRate, startLevel);
  const r = 1 + growthRate;
  const totalCost = a * (Math.pow(r, quantity) - 1) / (r - 1);

  return Math.floor(totalCost);
};

// Функция для исправления чисел с плавающей запятой и обработки изменений базовых стоимостей
const fixFloatingPointNumbers = (state: Partial<GameState>): Partial<GameState> => {
  const newState = { ...state };

  // Всегда округляем до целых чисел для основных значений
  const integerFields: (keyof GameState)[] = [
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
    'pirateParrotCost',
    'foxCount',
    'foxCost'
  ];

  integerFields.forEach(field => {
    const value = newState[field];
    if (value !== undefined && typeof value === 'number') {
      (newState[field] as number) = Math.floor(fixFloatingPoint(value));
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
    newState.clickPowerCost = Math.floor(BASE_COSTS.CLICK_POWER * Math.pow(1 + GROWTH_RATE, newState.clickPower - 1));
  }

  if (newState.autoClickerCount !== undefined && newState.autoClickerCost !== undefined) {
    newState.autoClickerCost = Math.floor(BASE_COSTS.AUTO_CLICKER * Math.pow(1 + GROWTH_RATE, newState.autoClickerCount));
  }

  if (newState.multiAutoClickPower !== undefined && newState.multiAutoClickCost !== undefined) {
    const currentLevel = Math.round((newState.multiAutoClickPower - 1) * 10);
    newState.multiAutoClickCost = Math.floor(BASE_COSTS.MULTI_AUTO_CLICK * Math.pow(1 + GROWTH_RATE, currentLevel));
  }

  if (newState.friendlyEndermanCount !== undefined && newState.friendlyEndermanCost !== undefined) {
    newState.friendlyEndermanCost = Math.floor(BASE_COSTS.FRIENDLY_ENDERMAN * Math.pow(1 + GROWTH_RATE, newState.friendlyEndermanCount));
  }

  if (newState.allayCount !== undefined && newState.allayCost !== undefined) {
    newState.allayCost = Math.floor(BASE_COSTS.ALLAY * Math.pow(1 + GROWTH_RATE, newState.allayCount));
  }

  if (newState.luckyCatCount !== undefined && newState.luckyCatCost !== undefined) {
    newState.luckyCatCost = Math.floor(BASE_COSTS.LUCKY_CAT * Math.pow(1 + GROWTH_RATE, newState.luckyCatCount));
  }

  if (newState.pirateParrotCount !== undefined && newState.pirateParrotCost !== undefined) {
    newState.pirateParrotCost = Math.floor(BASE_COSTS.PIRATE_PARROT * Math.pow(1 + GROWTH_RATE, newState.pirateParrotCount));
  }

  if (newState.foxCount !== undefined && newState.foxCost !== undefined) {
    newState.foxCost = Math.floor(BASE_COSTS.FOX * Math.pow(1 + GROWTH_RATE, newState.foxCount));
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
      foxCount: 0,

      // Base costs
      clickPowerCost: BASE_COSTS.CLICK_POWER,
      autoClickerCost: BASE_COSTS.AUTO_CLICKER,
      multiAutoClickCost: BASE_COSTS.MULTI_AUTO_CLICK,
      friendlyEndermanCost: BASE_COSTS.FRIENDLY_ENDERMAN,
      allayCost: BASE_COSTS.ALLAY,
      luckyCatCost: BASE_COSTS.LUCKY_CAT,
      pirateParrotCost: BASE_COSTS.PIRATE_PARROT,
      foxCost: BASE_COSTS.FOX,

      // Audio settings initial values
      musicEnabled: true,
      musicVolume: AUDIO_DEFAULTS.MUSIC_VOLUME,
      soundEffectsEnabled: true,
      shovelSoundsEnabled: true,
      shovelSoundsVolume: AUDIO_DEFAULTS.CREATURE_VOLUME,
      endermanSoundsEnabled: true,
      endermanSoundsVolume: AUDIO_DEFAULTS.CREATURE_VOLUME,
      allaySoundsEnabled: true,
      allaySoundsVolume: AUDIO_DEFAULTS.CREATURE_VOLUME,
      catSoundsEnabled: true,
      catSoundsVolume: AUDIO_DEFAULTS.CREATURE_VOLUME,
      parrotSoundsEnabled: true,
      parrotSoundsVolume: AUDIO_DEFAULTS.CREATURE_VOLUME,
      foxSoundsEnabled: true,
      foxSoundsVolume: AUDIO_DEFAULTS.CREATURE_VOLUME,
      soundEffectsVolume: AUDIO_DEFAULTS.EFFECTS_VOLUME,

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
          // Рассчитываем стоимость следующей покупки
          const nextCost = calculateCost(BASE_COSTS.AUTO_CLICKER, GROWTH_RATE, 1, state.autoClickerCount);

          return {
            autoClickerCost: nextCost
          };
        });
      },

      purchaseClickPower: (quantity) => {
        const state = get();

        // Calculate cost for quantity upgrades from current level
        const totalCost = calculateCost(
          BASE_COSTS.CLICK_POWER * Math.pow(1 + GROWTH_RATE, state.clickPower - 1),
          GROWTH_RATE,
          quantity
        );

        // Check if player can afford
        if (state.canAfford(totalCost)) {
          set({
            dirtCount: Math.floor(state.dirtCount - totalCost),
            clickPower: state.clickPower + quantity,
            clickPowerCost: Math.floor(BASE_COSTS.CLICK_POWER * Math.pow(1 + GROWTH_RATE, state.clickPower + quantity - 1))
          });
        }
      },

      purchaseAutoClicker: (amount: number = 1) => {
        const state = get();

        // Рассчитываем общую стоимость для текущей покупки
        const totalCost = calculateCost(BASE_COSTS.AUTO_CLICKER, GROWTH_RATE, amount, state.autoClickerCount);

        if (state.dirtCount >= totalCost) {
          const newCount = state.autoClickerCount + amount;

          // Рассчитываем стоимость следующей покупки
          const nextCost = calculateCost(BASE_COSTS.AUTO_CLICKER, GROWTH_RATE, 1, newCount);

          set({
            dirtCount: fixFloatingPoint(state.dirtCount - totalCost),
            autoClickerCount: newCount,
            autoClickerCost: nextCost
          });
          return true;
        }
        return false;
      },

      // Purchase Enchanted Wood Shovel (multiAutoClick)
      purchaseMultiAutoClick: (_quantity) => {
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

        // Calculate cost for quantity upgrades from current level
        const totalCost = calculateCost(
          BASE_COSTS.FRIENDLY_ENDERMAN * Math.pow(1 + GROWTH_RATE, state.friendlyEndermanCount),
          GROWTH_RATE,
          quantity
        );

        // Check if player can afford
        if (state.canAfford(totalCost)) {
          set({
            dirtCount: Math.floor(state.dirtCount - totalCost),
            friendlyEndermanCount: state.friendlyEndermanCount + quantity,
            friendlyEndermanCost: Math.floor(BASE_COSTS.FRIENDLY_ENDERMAN * Math.pow(1 + GROWTH_RATE, state.friendlyEndermanCount + quantity))
          });
        }
      },

      // Purchase Allay
      purchaseAllay: (quantity) => {
        const state = get();

        // Calculate cost for quantity upgrades from current level
        const totalCost = calculateCost(
          BASE_COSTS.ALLAY * Math.pow(1 + GROWTH_RATE, state.allayCount),
          GROWTH_RATE,
          quantity
        );

        // Check if player can afford
        if (state.canAfford(totalCost)) {
          set({
            dirtCount: Math.floor(state.dirtCount - totalCost),
            allayCount: state.allayCount + quantity,
            allayCost: Math.floor(BASE_COSTS.ALLAY * Math.pow(1 + GROWTH_RATE, state.allayCount + quantity))
          });
        }
      },

      // Purchase Lucky Cat
      purchaseLuckyCat: (quantity) => {
        const state = get();

        // Проверяем, не превышен ли максимальный уровень
        if (state.luckyCatCount >= LIMITS.LUCKY_CAT_MAX) {
          return;
        }

        // Ограничиваем количество покупок до максимального уровня
        const actualQuantity = Math.min(quantity, LIMITS.LUCKY_CAT_MAX - state.luckyCatCount);

        if (actualQuantity <= 0) {
          return;
        }

        // Calculate cost for quantity upgrades from current level
        const totalCost = calculateCost(
          BASE_COSTS.LUCKY_CAT * Math.pow(1 + GROWTH_RATE, state.luckyCatCount),
          GROWTH_RATE,
          actualQuantity
        );

        // Check if player can afford
        if (state.canAfford(totalCost)) {
          set({
            dirtCount: Math.floor(state.dirtCount - totalCost),
            luckyCatCount: state.luckyCatCount + actualQuantity,
            luckyCatCost: Math.floor(BASE_COSTS.LUCKY_CAT * Math.pow(1 + GROWTH_RATE, state.luckyCatCount + actualQuantity))
          });
        }
      },

      // Purchase Pirate Parrot
      purchasePirateParrot: (quantity) => {
        const state = get();

        // Calculate cost for quantity upgrades from current level
        const totalCost = calculateCost(
          BASE_COSTS.PIRATE_PARROT * Math.pow(1 + GROWTH_RATE, state.pirateParrotCount),
          GROWTH_RATE,
          quantity
        );

        // Check if player can afford
        if (state.canAfford(totalCost)) {
          set({
            dirtCount: Math.floor(state.dirtCount - totalCost),
            pirateParrotCount: state.pirateParrotCount + quantity,
            pirateParrotCost: Math.floor(BASE_COSTS.PIRATE_PARROT * Math.pow(1 + GROWTH_RATE, state.pirateParrotCount + quantity))
          });
        }
      },

      // Purchase Fox
      purchaseFox: (quantity) => {
        const state = get();

        // Calculate cost for quantity upgrades from current level
        const totalCost = calculateCost(
          BASE_COSTS.FOX * Math.pow(1 + GROWTH_RATE, state.foxCount),
          GROWTH_RATE,
          quantity
        );

        // Check if player can afford
        if (state.canAfford(totalCost)) {
          set({
            dirtCount: Math.floor(state.dirtCount - totalCost),
            foxCount: state.foxCount + quantity,
            foxCost: Math.floor(BASE_COSTS.FOX * Math.pow(1 + GROWTH_RATE, state.foxCount + quantity))
          });
        }
      },

      // Helper to calculate total price for multiple purchases
      calculateTotalPrice: (baseCost, quantity, growthRate) => {
        const state = get();
        let level = 0;

        // Определяем текущий уровень улучшения на основе базовой стоимости
        switch (baseCost) {
          case BASE_COSTS.AUTO_CLICKER:
            level = state.autoClickerCount;
            break;
          case BASE_COSTS.CLICK_POWER:
            level = state.clickPower - 1;
            break;
          case BASE_COSTS.MULTI_AUTO_CLICK:
            level = Math.round((state.multiAutoClickPower - 1) * 10);
            break;
          case BASE_COSTS.FRIENDLY_ENDERMAN:
            level = state.friendlyEndermanCount;
            break;
          case BASE_COSTS.ALLAY:
            level = state.allayCount;
            break;
          case BASE_COSTS.LUCKY_CAT:
            level = state.luckyCatCount;
            break;
          case BASE_COSTS.PIRATE_PARROT:
            level = state.pirateParrotCount;
            break;
          case BASE_COSTS.FOX:
            level = state.foxCount;
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
          multiAutoClickPower: 1.0,
          friendlyEndermanCount: 0,
          allayCount: 0,
          luckyCatCount: 0,
          pirateParrotCount: 0,
          foxCount: 0,
          clickPowerCost: BASE_COSTS.CLICK_POWER,
          autoClickerCost: BASE_COSTS.AUTO_CLICKER,
          multiAutoClickCost: BASE_COSTS.MULTI_AUTO_CLICK,
          friendlyEndermanCost: BASE_COSTS.FRIENDLY_ENDERMAN,
          allayCost: BASE_COSTS.ALLAY,
          luckyCatCost: BASE_COSTS.LUCKY_CAT,
          pirateParrotCost: BASE_COSTS.PIRATE_PARROT,
          foxCost: BASE_COSTS.FOX,
          usedPromoCodes: [],
        });
      },

      // Apply promo code
      applyPromoCode: (code) => {
        const state = get();

        // Validate input
        if (!code || typeof code !== 'string' || code.trim().length === 0) {
          return { success: false, message: "Please enter a valid promo code." };
        }

        const trimmedCode = code.trim();

        // Промокод для сброса прогресса
        if (trimmedCode === "Dead") {
          get().resetGame();
          return { success: true, message: "Весь прогресс был сброшен!" };
        }

        // Промокод Sasha (bc земли)
        if (trimmedCode === "Sasha") {
          const amount = Math.pow(1000, 33);
          set({
            dirtCount: fixFloatingPoint(state.dirtCount + amount),
            totalDirtCollected: fixFloatingPoint(state.totalDirtCollected + amount),
          });
          return { success: true, message: "ВАУ! Вы получили bc земли!" };
        }

        // Промокод 1zz (zz земли)
        if (trimmedCode === "1zz") {
          const amount = Math.pow(1000, 680);
          set({
            dirtCount: fixFloatingPoint(state.dirtCount + amount),
            totalDirtCollected: fixFloatingPoint(state.totalDirtCollected + amount),
          });
          return { success: true, message: "ВАУ! Вы получили zz земли!" };
        }

        // Специальный промокод для 50 триллионов земли
        if (trimmedCode.toLowerCase() === "get50trilliondirt") {
          const amount = 50000000000000;
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

        const normalizedCode = trimmedCode.toUpperCase();

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
        }

        return { success: false, message: "Invalid promo code." };
      },      // Audio controls
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
      setFoxSoundsEnabled: (enabled) => set({ foxSoundsEnabled: enabled }),
      setFoxSoundsVolume: (volume) => set({ foxSoundsVolume: volume }),
      setSoundEffectsVolume: (volume) => set({ soundEffectsVolume: volume }),

      fixFloatingPointNumbers: () => {
        set((state) => fixFloatingPointNumbers(state));
      }, lastVisitTime: Date.now(),

      calculateOfflineProgress: () => {
        const currentTime = Date.now();
        const lastVisitTime = get().lastVisitTime;
        const timeAwayInSeconds = Math.floor((currentTime - lastVisitTime) / 1000);

        // Если прошло меньше минимального времени или это первый визит, не показываем прогресс
        if (timeAwayInSeconds < LIMITS.OFFLINE_MIN_SECONDS || lastVisitTime === 0) {
          set({ lastVisitTime: currentTime });
          return {
            earnedDirt: 0,
            timeAwayInSeconds: 0
          };
        }

        // Получаем текущую скорость добычи в секунду
        const state = get();

        // Расчет всех источников дохода с учетом масштабирования уровня
        const autoClickPower = state.autoClickerCount * PRODUCTION_RATES.AUTO_CLICKER * (1 + MULTIPLIERS.LEVEL_SCALING * state.autoClickerCount);
        const endermanPower = state.friendlyEndermanCount * PRODUCTION_RATES.FRIENDLY_ENDERMAN * (1 + MULTIPLIERS.LEVEL_SCALING * state.friendlyEndermanCount);
        const pirateParrotPower = state.pirateParrotCount * PRODUCTION_RATES.PIRATE_PARROT * (1 + MULTIPLIERS.LEVEL_SCALING * state.pirateParrotCount);

        // Применяем множитель от Allay
        const allayMultiplier = state.allayCount > 0 ? 1 + (state.allayCount * MULTIPLIERS.ALLAY) : 1;

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