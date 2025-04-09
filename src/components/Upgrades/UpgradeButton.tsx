import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { UpgradeType, PurchaseQuantity } from '../../types';
import { formatNumber } from '../../utils/formatNumber';
import slotImage from '../../assets/slot.webp';
import woodenShovelNormalImage from '../../assets/wooden_shovel_normal.webp';
import stoneShovelImage from '../../assets/stone_shovel.webp';
import ironShovelImage from '../../assets/iron_shovel.webp';
import goldenShovelImage from '../../assets/golden_shovel.webp';
import diamondShovelImage from '../../assets/diamond_shovel.webp';
import netheriteShovelImage from '../../assets/netherite_shovel.webp';
import enchantedWoodShovelImage from '../../assets/enchanted_wooden_shovel.webp';
import cursorImage from '../../assets/cursor.webp';
import enderPearlImage from '../../assets/invicon_enderman.webp';
import allayImage from '../../assets/invicon_allay.webp';
import catImage from '../../assets/invicon_cat.webp';
import parrotImage from '../../assets/invicon_parrot.webp'; // Добавляем изображение попугая
import enchantedNetheriteShovelImage from '../../assets/enchanted_netherite_shovel.webp';
import enchantedDiamondShovelImage from '../../assets/enchanted_diamond_shovel.webp';
import enchantedGoldenShovelImage from '../../assets/enchanted_golden_shovel.webp';
import enchantedIronShovelImage from '../../assets/enchanted_iron_shovel.webp';
import enchantedStoneShovelImage from '../../assets/enchanted_stone_shovel.webp';

interface UpgradeButtonProps {
  type: UpgradeType;
  title: string;
  description: string;
  purchaseQuantity: PurchaseQuantity;
  onInfoClick: (type: UpgradeType) => void;
}

/**
 * Component representing a single upgrade button
 */
export const UpgradeButton: React.FC<UpgradeButtonProps> = ({
  type,
  title,
  description,
  purchaseQuantity,
  onInfoClick
}) => {
  const {
    purchaseClickPower,
    purchaseAutoClicker,
    purchaseMultiAutoClick,
    purchaseFriendlyEnderman,
    purchaseAllay,
    purchaseLuckyCat,
    purchasePirateParrot, // Добавляем метод для покупки попугая
    clickPower,
    autoClickerCount,
    multiAutoClickPower,
    friendlyEndermanCount,
    allayCount,
    luckyCatCount,
    pirateParrotCount, // Добавляем счетчик для попугая
    calculateTotalPrice,
    canAfford,
    recalculateShovelCosts
  } = useGameStore();

  // Добавляем useEffect для пересчета цен при монтировании
  useEffect(() => {
    recalculateShovelCosts();
  }, [recalculateShovelCosts]);

  // Функция для получения информации об улучшении лопаты
  const getShovelUpgradeInfo = (count: number) => {
    if (count === 99) return { level: 100, name: 'Stone Shovel' };
    if (count === 199) return { level: 200, name: 'Iron Shovel' };
    if (count === 299) return { level: 300, name: 'Golden Shovel' };
    if (count === 499) return { level: 500, name: 'Diamond Shovel' };
    if (count === 999) return { level: 1000, name: 'Netherite Shovel' };
    return null;
  };

  // Получаем текущий уровень улучшения для Enchanted Shovel
  const getMultiAutoClickLevel = () => {
    if (type !== 'multiAutoClick') return 0;
    // Уровень = (текущая сила - 1.5) / 0.1 + 1
    // Если меньше 1.5, значит еще не куплен
    return multiAutoClickPower >= 1.5 
      ? Math.floor(((multiAutoClickPower - 1.5) / 0.1) + 1)
      : 0;
  };

  // Get the cost of the upgrade based on its type
  const getCost = () => {
    let totalPrice = 0;
    switch (type) {
      case 'clickPower':
        return calculateTotalPrice(10, purchaseQuantity, 0.15);
      case 'autoClicker':
        totalPrice = calculateTotalPrice(50, purchaseQuantity, 0.15);
        break;
      case 'multiAutoClick':
        // Для Enchanted Shovel - фиксированная стоимость
        // Проверяем, может ли игрок купить следующий уровень Enchanted Shovel
        if (multiAutoClickPower >= 1.15 && multiAutoClickPower < 1.3 && autoClickerCount < 100) {
          // Если у игрока нет Stone Shovel, показываем стоимость Stone Shovel
          return calculateTotalPrice(50, 100 - autoClickerCount, 0.15);
        } else if (multiAutoClickPower >= 1.3 && multiAutoClickPower < 1.5 && autoClickerCount < 200) {
          // Если у игрока нет Iron Shovel, показываем стоимость Iron Shovel
          return calculateTotalPrice(50, 200 - autoClickerCount, 0.15);
        } else if (multiAutoClickPower >= 1.5 && multiAutoClickPower < 1.7 && autoClickerCount < 300) {
          // Если у игрока нет Golden Shovel, показываем стоимость Golden Shovel
          return calculateTotalPrice(50, 300 - autoClickerCount, 0.15);
        } else if (multiAutoClickPower >= 1.7 && multiAutoClickPower < 1.9 && autoClickerCount < 500) {
          // Если у игрока нет Diamond Shovel, показываем стоимость Diamond Shovel
          return calculateTotalPrice(50, 500 - autoClickerCount, 0.15);
        } else if (multiAutoClickPower >= 1.9 && multiAutoClickPower < 2.1 && autoClickerCount < 1000) {
          // Если у игрока нет Netherite Shovel, показываем стоимость Netherite Shovel
          return calculateTotalPrice(50, 1000 - autoClickerCount, 0.15);
        } else {
          // Если игрок может купить следующий уровень Enchanted Shovel, показываем его стоимость
          totalPrice = 250;
        }
        break;
      case 'friendlyEnderman':
        totalPrice = calculateTotalPrice(1000, purchaseQuantity, 0.15);
        break;
      case 'allay':
        totalPrice = calculateTotalPrice(5000, purchaseQuantity, 0.15);
        break;
      case 'luckyCat':
        totalPrice = calculateTotalPrice(10000, purchaseQuantity, 0.15);
        break;
      case 'pirateParrot':
        totalPrice = calculateTotalPrice(20000, purchaseQuantity, 0.15);
        break;
      default:
        return 0;
    }
    return totalPrice;
  };

  // Get the level or count of the upgrade
  const getUpgradeCount = () => {
    if (type === 'clickPower') {
      return clickPower - 1; // -1 потому что начальное значение 1
    }
    if (type === 'autoClicker') {
      return autoClickerCount;
    }
    if (type === 'multiAutoClick') {
      // Для Enchanted Shovel показываем текущий уровень множителя
      return multiAutoClickPower;
    }
    if (type === 'friendlyEnderman') {
      return friendlyEndermanCount;
    }
    if (type === 'allay') {
      return allayCount;
    }
    if (type === 'luckyCat') {
      return luckyCatCount;
    }
    if (type === 'pirateParrot') {
      return pirateParrotCount;
    }
    return 0;
  };

  // Handle purchasing the upgrade
  const buyUpgrade = () => {
    switch (type) {
      case 'clickPower':
        purchaseClickPower(purchaseQuantity);
        break;
      case 'autoClicker':
        purchaseAutoClicker(purchaseQuantity);
        break;
      case 'multiAutoClick':
        // Проверяем, может ли игрок купить следующий уровень Enchanted Shovel
        if (multiAutoClickPower >= 1.15 && multiAutoClickPower < 1.3 && autoClickerCount < 100) {
          // Если у игрока нет Stone Shovel, покупаем Stone Shovel
          purchaseAutoClicker(100 - autoClickerCount);
        } else if (multiAutoClickPower >= 1.3 && multiAutoClickPower < 1.5 && autoClickerCount < 200) {
          // Если у игрока нет Iron Shovel, покупаем Iron Shovel
          purchaseAutoClicker(200 - autoClickerCount);
        } else if (multiAutoClickPower >= 1.5 && multiAutoClickPower < 1.7 && autoClickerCount < 300) {
          // Если у игрока нет Golden Shovel, покупаем Golden Shovel
          purchaseAutoClicker(300 - autoClickerCount);
        } else if (multiAutoClickPower >= 1.7 && multiAutoClickPower < 1.9 && autoClickerCount < 500) {
          // Если у игрока нет Diamond Shovel, покупаем Diamond Shovel
          purchaseAutoClicker(500 - autoClickerCount);
        } else if (multiAutoClickPower >= 1.9 && multiAutoClickPower < 2.1 && autoClickerCount < 1000) {
          // Если у игрока нет Netherite Shovel, покупаем Netherite Shovel
          purchaseAutoClicker(1000 - autoClickerCount);
        } else {
          // Если игрок может купить следующий уровень Enchanted Shovel, покупаем его
          purchaseMultiAutoClick(purchaseQuantity);
        }
        break;
      case 'friendlyEnderman':
        purchaseFriendlyEnderman(purchaseQuantity);
        break;
      case 'allay':
        purchaseAllay(purchaseQuantity);
        break;
      case 'luckyCat':
        purchaseLuckyCat(purchaseQuantity);
        break;
      case 'pirateParrot':
        purchasePirateParrot(purchaseQuantity);
        break;
    }
  };

  // Get the appropriate slot image and determine if it needs the cursor class
  const getUpgradeImage = () => {
    switch (type) {
      case 'clickPower':
        return cursorImage;
      case 'autoClicker':
        if (autoClickerCount >= 1000) return netheriteShovelImage;
        if (autoClickerCount >= 500) return diamondShovelImage;
        if (autoClickerCount >= 300) return goldenShovelImage;
        if (autoClickerCount >= 200) return ironShovelImage;
        if (autoClickerCount >= 100) return stoneShovelImage;
        return woodenShovelNormalImage;
      case 'multiAutoClick':
        if (multiAutoClickPower >= 2.1) return enchantedNetheriteShovelImage;
        if (multiAutoClickPower >= 1.9) return enchantedDiamondShovelImage;
        if (multiAutoClickPower >= 1.7) return enchantedGoldenShovelImage;
        if (multiAutoClickPower >= 1.5) return enchantedIronShovelImage;
        if (multiAutoClickPower >= 1.3) return enchantedStoneShovelImage;
        if (multiAutoClickPower >= 1.15) return enchantedWoodShovelImage;
        return enchantedWoodShovelImage; // По умолчанию показываем Wood Shovel
      case 'friendlyEnderman':
        return enderPearlImage;
      case 'allay':
        return allayImage;
      case 'luckyCat':
        return catImage;
      case 'pirateParrot':
        return parrotImage;
      default:
        return slotImage;
    }
  };

  // Check if the current upgrade type is a cursor type that needs rotation
  const isCursorType = type === 'clickPower';
  const upgradeCount = getUpgradeCount();

  const cost = getCost();
  const formattedCost = formatNumber(cost);
  const upgradeImage = getUpgradeImage();

  // Определяем, показывать ли кнопку Upgrade вместо Buy
  const showUpgradeButton = type === 'autoClicker' && getShovelUpgradeInfo(autoClickerCount) !== null;

  // Определяем, доступна ли кнопка покупки Enchanted Shovel
  const isEnchantedShovelPurchased = type === 'multiAutoClick' && multiAutoClickPower >= 1.15;
  // Определяем, достиг ли Lucky Cat максимального уровня
  const isLuckyCatMaxed = type === 'luckyCat' && luckyCatCount >= 10;
  // Определяем, достиг ли Enchanted Shovel максимального уровня
  const isEnchantedShovelMaxed = type === 'multiAutoClick' && multiAutoClickPower >= 2.1;
  
  // Проверяем, нужно ли отключить кнопку
  const isButtonDisabled = () => {
    if (type === 'multiAutoClick') {
      // Проверяем, достигнут ли максимальный уровень
      if (isEnchantedShovelMaxed) {
        return true;
      }
      
      // Проверяем, может ли игрок позволить себе покупку
      return !canAfford;
    }
    
    // Для Lucky Cat
    if (type === 'luckyCat') {
      return isLuckyCatMaxed || !canAfford;
    }
    
    // Для остальных улучшений
    return !canAfford;
  };
  
  const getButtonText = () => {
    if (type === 'multiAutoClick') {
      // Проверяем требования для каждого уровня зачарованной лопаты
      if (multiAutoClickPower >= 1.15 && multiAutoClickPower < 1.3 && autoClickerCount < 100) {
        return 'Need Stone Shovel (100)';
      }
      if (multiAutoClickPower >= 1.3 && multiAutoClickPower < 1.5 && autoClickerCount < 200) {
        return 'Need Iron Shovel (200)';
      }
      if (multiAutoClickPower >= 1.5 && multiAutoClickPower < 1.7 && autoClickerCount < 300) {
        return 'Need Golden Shovel (300)';
      }
      if (multiAutoClickPower >= 1.7 && multiAutoClickPower < 1.9 && autoClickerCount < 500) {
        return 'Need Diamond Shovel (500)';
      }
      if (multiAutoClickPower >= 1.9 && multiAutoClickPower < 2.1 && autoClickerCount < 1000) {
        return 'Need Netherite Shovel (1000)';
      }
      return multiAutoClickPower >= 2.1 ? 'Max Level' : 'Upgrade';
    }
    
    return showUpgradeButton ? 'Upgrade' : `Buy${purchaseQuantity > 1 ? ` x${purchaseQuantity}` : ''}`;
  };

  const getShovelTitle = () => {
    if (type !== 'autoClicker') return title;

    // Определяем текущий тип лопаты
    if (autoClickerCount >= 1000) return 'Netherite Shovel';
    if (autoClickerCount >= 500) return 'Diamond Shovel';
    if (autoClickerCount >= 300) return 'Golden Shovel';
    if (autoClickerCount >= 200) return 'Iron Shovel';
    if (autoClickerCount >= 100) return 'Stone Shovel';
    return 'Wooden Shovel';
  };

  const getShovelDescription = () => {
    if (type !== 'autoClicker') return description;

    // Определяем следующий тип лопаты
    if (autoClickerCount >= 1000) {
      return 'Maximum level reached!';
    } else if (autoClickerCount >= 500) {
      return 'Upgrade your shovel to Netherite Shovel!';
    } else if (autoClickerCount >= 300) {
      return 'Upgrade your shovel to Diamond Shovel!';
    } else if (autoClickerCount >= 200) {
      return 'Upgrade your shovel to Golden Shovel!';
    } else if (autoClickerCount >= 100) {
      return 'Upgrade your shovel to Iron Shovel!';
    } else {
      return 'Upgrade your shovel to Stone Shovel!';
    }
  };

  const getCurrentShovelInfo = () => {
    if (type !== 'autoClicker') return { name: title, description };

    let currentShovel = {
      name: 'Wooden Shovel',
      description: 'Basic wooden shovel for digging.'
    };

    if (autoClickerCount >= 1000) {
      currentShovel = {
        name: 'Netherite Shovel',
        description: 'The ultimate shovel forged from ancient debris.'
      };
    } else if (autoClickerCount >= 500) {
      currentShovel = {
        name: 'Diamond Shovel',
        description: 'A premium diamond-tipped shovel for efficient digging.'
      };
    } else if (autoClickerCount >= 300) {
      currentShovel = {
        name: 'Golden Shovel',
        description: 'A golden shovel that brings fortune while digging.'
      };
    } else if (autoClickerCount >= 200) {
      currentShovel = {
        name: 'Iron Shovel',
        description: 'A durable iron shovel for serious dirt collection.'
      };
    } else if (autoClickerCount >= 100) {
      currentShovel = {
        name: 'Stone Shovel',
        description: 'An upgraded stone shovel for better digging.'
      };
    }

    return currentShovel;
  };

  // Получаем название и описание для Enchanted Shovel в зависимости от уровня
  const getEnchantedShovelInfo = () => {
    if (type !== 'multiAutoClick') return { title, description };
    
    // Определяем текущий уровень Enchanted Shovel
    if (multiAutoClickPower >= 2.1) {
      return {
        title: 'Enchanted Netherite Shovel',
        description: 'Maximum level reached!'
      };
    } else if (multiAutoClickPower >= 1.9) {
      // Проверяем, есть ли у игрока Netherite Shovel
      if (autoClickerCount < 1000) {
        return {
          title: 'Enchanted Diamond Shovel',
          description: 'You need a Netherite Shovel to upgrade to Enchanted Netherite Shovel!'
        };
      }
      return {
        title: 'Enchanted Diamond Shovel',
        description: 'Upgrade to Enchanted Netherite Shovel!'
      };
    } else if (multiAutoClickPower >= 1.7) {
      // Проверяем, есть ли у игрока Diamond Shovel
      if (autoClickerCount < 500) {
        return {
          title: 'Enchanted Golden Shovel',
          description: 'You need a Diamond Shovel to upgrade to Enchanted Diamond Shovel!'
        };
      }
      return {
        title: 'Enchanted Golden Shovel',
        description: 'Upgrade to Enchanted Diamond Shovel!'
      };
    } else if (multiAutoClickPower >= 1.5) {
      // Проверяем, есть ли у игрока Golden Shovel
      if (autoClickerCount < 300) {
        return {
          title: 'Enchanted Iron Shovel',
          description: 'You need a Golden Shovel to upgrade to Enchanted Golden Shovel!'
        };
      }
      return {
        title: 'Enchanted Iron Shovel',
        description: 'Upgrade to Enchanted Golden Shovel!'
      };
    } else if (multiAutoClickPower >= 1.3) {
      // Проверяем, есть ли у игрока Iron Shovel
      if (autoClickerCount < 200) {
        return {
          title: 'Enchanted Stone Shovel',
          description: 'You need an Iron Shovel to upgrade to Enchanted Iron Shovel!'
        };
      }
      return {
        title: 'Enchanted Stone Shovel',
        description: 'Upgrade to Enchanted Iron Shovel!'
      };
    } else if (multiAutoClickPower >= 1.15) {
      // Проверяем, есть ли у игрока Stone Shovel
      if (autoClickerCount < 100) {
        return {
          title: 'Enchanted Wood Shovel',
          description: 'You need a Stone Shovel to upgrade to Enchanted Stone Shovel!'
        };
      }
      return {
        title: 'Enchanted Wood Shovel',
        description: 'Upgrade to Enchanted Stone Shovel!'
      };
    } else {
      return {
        title: 'Enchanted Wood Shovel',
        description: 'Magical enchantments that make your wood shovels more efficient. Gives a ×1.15 multiplier to your shovels production.'
      };
    }
  };

  return (
    <div className={`upgrade-button ${!canAfford ? 'disabled' : ''}`}>
      <div className="upgrade-content-wrapper">
        <div className="upgrade-slot-wrapper">
          <img src={slotImage} alt="slot" className="slot-image" />
          <img 
            src={upgradeImage} 
            alt="upgrade" 
            className={`upgrade-icon ${isCursorType ? 'cursor-icon' : ''}`} 
          />
        </div>
        <div className="upgrade-info">
          <div className="upgrade-header">
            <h3>
              {type === 'multiAutoClick' ? getEnchantedShovelInfo().title : getShovelTitle()}
              {upgradeCount > 0 && (
                <span className="upgrade-count-header">
                  {type === 'autoClicker' || type === 'multiAutoClick' 
                    ? ` (Level ${formatNumber(upgradeCount)})` 
                    : ` (${formatNumber(upgradeCount)})`}
                </span>
              )}
            </h3>
            <button 
              className="info-button"
              onClick={() => onInfoClick(type)}
              title={type === 'multiAutoClick' ? getEnchantedShovelInfo().title : getCurrentShovelInfo().name}
              aria-label={`Show information about ${type === 'multiAutoClick' ? getEnchantedShovelInfo().title : getCurrentShovelInfo().name}`}
            >
              i
            </button>
          </div>
          <p className="upgrade-description">
            {type === 'multiAutoClick' ? getEnchantedShovelInfo().description : getShovelDescription()}
          </p>
          <div className="upgrade-footer">
            <span className="cost">
              {isEnchantedShovelPurchased && isEnchantedShovelMaxed ? 'Max Level' : 
               isEnchantedShovelPurchased ? 'Purchased' : 
               isLuckyCatMaxed ? 'Max Level' : 
               `Cost: ${formattedCost}`}
            </span>
            <button 
              className={`buy-button ${isButtonDisabled() ? 'disabled' : ''}`}
              onClick={buyUpgrade}
              disabled={isButtonDisabled()}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};