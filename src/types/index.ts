// Общие типы для всего приложения

/**
 * Information for a single click animation
 */
export interface ClickAnimation {
  id: number | string;
  x: number;
  y: number;
  value: number;
}

export interface ClickAnimationProps {
  id: number;
  x: number;
  y: number;
  value: number;
}

// Типы вкладок для навигации
export type TabType = 'game' | 'upgrades' | 'settings';

export type GameTab = 'upgrades' | 'achievements' | 'settings';

// Доступные количества покупок
export type PurchaseQuantity = 1 | 10 | 50 | 100;

// Типы улучшений для информационных панелей
export type UpgradeType = 'clickPower' | 'autoClicker' | 'multiAutoClick' | 'friendlyEnderman';

/**
 * Position information for the dirt block
 */
export interface BlockPosition {
  x: number;
  y: number;
}

// Тип для размеров блока
export interface BlockRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface UpgradeInfo {
  id: string;
  name: string;
  description: string;
  cost: number;
  currentLevel: number;
  onPurchase: (quantity: number) => void;
  canAfford: boolean;
  getValueText: (quantity: number) => string;
}