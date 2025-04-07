import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dirtImage from './assets/dirt.webp'
import shovelImage from './assets/wood_shovel.webp'
import './App.css'
import { useGameStore } from './store/gameStore'
import { formatNumber } from './utils/formatNumber'

// Define an interface for click animation
interface ClickAnimation {
  id: number;
  x: number;
  y: number;
  value: number;
}

// Define tab types for navigation
type TabType = 'game' | 'upgrades';

// Define available purchase quantities
type PurchaseQuantity = 1 | 10 | 50 | 100;

// Типы улучшений для информационных панелей
type UpgradeType = 'clickPower' | 'autoClicker' | 'multiClick' | 'multiAutoClick';

// Компонент InfoPanel отображает детальную информацию об улучшении
function InfoPanel({ 
  type, 
  onClose
}: { 
  type: UpgradeType; 
  onClose: () => void 
}) {
  const { 
    clickPower, 
    autoClickerCount,
    multiClickPower,
    multiAutoClickPower 
  } = useGameStore();
  
  // Определяем информацию в зависимости от типа улучшения
  const getUpgradeInfo = () => {
    switch(type) {
      case 'clickPower':
        return {
          title: "Click Power",
          description: "Increases base click power by +1",
          count: `Current level: ${clickPower}`,
          baseProduction: `Produces +${formatNumber(1)} per click`,
          totalProduction: `Total click power: ${formatNumber(clickPower)} (without multiplier)`
        };
      case 'autoClicker':
        return {
          title: "Auto Clicker",
          description: "Automatically mines dirt every second",
          count: `Purchased: ${autoClickerCount}`,
          baseProduction: `Produces +${formatNumber(1)} dirt per second`,
          totalProduction: `Total production: ${formatNumber(autoClickerCount)} dirt per second (without multiplier)`
        };
      case 'multiClick':
        return {
          title: "Multi-Click",
          description: "Multiplies the power of each click",
          count: `Current multiplier: x${multiClickPower}`,
          baseProduction: "Increases click multiplier by +0.1",
          totalProduction: `Total effect: multiplies base click power by x${multiClickPower}`
        };
      case 'multiAutoClick':
        return {
          title: "Multi-AutoClick",
          description: "Multiplies the efficiency of all auto clickers",
          count: `Current multiplier: x${multiAutoClickPower}`,
          baseProduction: "Increases auto-click multiplier by +0.1",
          totalProduction: `Total effect: multiplies auto-clicker production by x${multiAutoClickPower}`
        };
    }
  };
  
  const info = getUpgradeInfo();
  
  return (
    <motion.div
      className="info-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="info-panel-header">
        <h3>{info.title}</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="info-panel-content">
        <div className="info-row">
          <span className="info-label">Description:</span> 
          <span className="info-value">{info.description}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Progress:</span> 
          <span className="info-value">{info.count}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Effect:</span> 
          <span className="info-value">{info.baseProduction}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Total:</span> 
          <span className="info-value">{info.totalProduction}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Компонент AutoDigger для анимации автокликера
function AutoDigger() {
  const { autoClickerCount } = useGameStore();

  if (autoClickerCount <= 0) return null;

  // Создаем массив лопат в соответствии с количеством автокликеров
  const shovels = Array.from({ length: autoClickerCount }, (_, index) => {
    // Вычисляем позицию лопаты вокруг блока земли
    // Угол в радианах, равномерно распределяем лопаты по кругу
    const angle = (index / autoClickerCount) * Math.PI * 2;

    // Радиус круга, по которому распределяем лопаты
    // Фиксированный радиус для всех лопат, а не зависящий от размера блока
    const radius = 100; 

    // Вычисляем координаты на окружности
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    // Вычисляем угол поворота лопаты, чтобы она была направлена к блоку
    const rotation = (angle * (180 / Math.PI)) + 230;

    return {
      id: index,
      position: { x, y },
      angle, 
      rotation,
      delay: index * 0.2 // Последовательная задержка для каждой лопаты
    };
  });

  return (
    <div className="shovels-container">
      {shovels.map(shovel => {
        // Вычисляем направление движения к центру блока
        const moveX = Math.cos(shovel.angle) * -20; // Движение к центру по X
        const moveY = Math.sin(shovel.angle) * -20; // Движение к центру по Y

        return (
          <motion.div
            key={`digger-${shovel.id}`}
            className="auto-digger"
            style={{
              position: 'absolute',
              left: `50%`,
              top: `50%`,
              transform: `translate(calc(-50% + ${shovel.position.x + 0}px), calc(-50% + ${shovel.position.y - 75}px))`, // Сдвиг на 10px вправо и 20px вниз
              pointerEvents: 'none',
            }}
          >
            <motion.img
              src={shovelImage}
              alt="Wooden Shovel"
              className="shovel-image"
              style={{
                width: '40px',
                height: 'auto',
                transformOrigin: '50% 75%', // Точка вращения ближе к нижней части лопаты
                transform: `rotate(${shovel.rotation}deg)` // Поворачиваем лопату чтобы она смотрела на блок земли
              }}
              animate={{
                // Анимация "копания" - движение к центру и обратно по вычисленному направлению
                x: [0, moveX, 0],
                y: [0, moveY, 0],
                // Анимация небольшого поворота при копании
                rotate: [shovel.rotation, shovel.rotation - 15, shovel.rotation]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 1.5, // Пауза между копаниями
                delay: shovel.delay // Индивидуальная задержка для каждой лопаты
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

function App() {
  const { 
    dirtCount, 
    clickPower, 
    autoClickerCount, 
    multiClickPower,
    multiAutoClickPower,
    increaseDirtCount, 
    purchaseClickPower, 
    purchaseAutoClicker,
    purchaseMultiClick,
    purchaseMultiAutoClick,
    clickPowerCost,
    autoClickerCost,
    multiClickCost,
    multiAutoClickCost,
    calculateTotalPrice
  } = useGameStore()
  
  // State for click animations
  const [clickAnimations, setClickAnimations] = useState<ClickAnimation[]>([])
  const [autoClickAnimations, setAutoClickAnimations] = useState<ClickAnimation[]>([])
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<TabType>('game')
  
  // State for purchase quantity
  const [purchaseQuantity, setPurchaseQuantity] = useState<PurchaseQuantity>(1)
  
  // State for active info panel
  const [activeInfoPanel, setActiveInfoPanel] = useState<UpgradeType | null>(null);
  
  // Ref for tracking dirt block position
  const dirtBlockRef = useRef<HTMLDivElement>(null);
  const [blockCenter, setBlockCenter] = useState({ x: 0, y: 0 });
  const [blockRect, setBlockRect] = useState({ left: 0, top: 0, width: 0, height: 0 });
  
  // Update block center position when component mounts or window resizes
  useEffect(() => {
    const updateBlockPosition = () => {
      if (dirtBlockRef.current) {
        const rect = dirtBlockRef.current.getBoundingClientRect();
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        setBlockCenter({
          x: rect.left + rect.width / 2 + scrollX,
          y: rect.top + rect.height / 2 + scrollY
        });

        setBlockRect({
          left: rect.left + scrollX,
          top: rect.top + scrollY,
          width: rect.width,
          height: rect.height
        });
      }
    };
    
    // Initial position
    updateBlockPosition();
    
    // Update on resize
    window.addEventListener('resize', updateBlockPosition);
    window.addEventListener('scroll', updateBlockPosition);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateBlockPosition);
      window.removeEventListener('scroll', updateBlockPosition);
    };
  }, [activeTab]); // Re-calculate when tab changes
  
  // Handle auto clickers
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoClickerCount > 0) {
        // Общее количество земли от автокликеров с учетом множителя
        const autoClickPower = autoClickerCount * multiAutoClickPower;
        increaseDirtCount(autoClickPower);
        
        // Создаем анимацию для автоклика с фиксированным размером
        if (autoClickerCount > 0 && dirtBlockRef.current) {
          // Случайная позиция для анимации в пределах блока
          const blockWidth = blockRect.width;
          const blockHeight = blockRect.height;
          
          // Генерируем позицию внутри блока
          const randomX = blockRect.left + Math.random() * blockWidth;
          const randomY = blockRect.top + Math.random() * blockHeight;
          
          const newAnimation = {
            id: Date.now(),
            x: randomX,
            y: randomY,
            value: autoClickPower
          };
          
          setAutoClickAnimations(prev => [...prev, newAnimation]);
          
          // Удаляем анимацию через некоторое время
          setTimeout(() => {
            setAutoClickAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id));
          }, 800); // Уменьшаем время анимации
        }
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [autoClickerCount, multiAutoClickPower, increaseDirtCount, blockRect])

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const power = clickPower * multiClickPower;
    increaseDirtCount(power)
    
    // Get click position relative to the document
    const clickX = event.clientX;
    const clickY = event.clientY;
    
    // Add a new animation at the click position
    const newAnimation = {
      id: Date.now(),
      x: clickX,
      y: clickY,
      value: power
    };
    
    setClickAnimations(prev => [...prev, newAnimation]);
    
    // Remove the animation after it completes
    setTimeout(() => {
      setClickAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id));
    }, 800); // Время анимации
  }

  // Calculate total prices based on current purchase quantity
  const totalClickPowerPrice = calculateTotalPrice(clickPowerCost, purchaseQuantity, 1.15);
  const totalAutoClickerPrice = calculateTotalPrice(autoClickerCost, purchaseQuantity, 1.15);
  const totalMultiClickPrice = calculateTotalPrice(multiClickCost, purchaseQuantity, 1.25);
  const totalMultiAutoClickPrice = calculateTotalPrice(multiAutoClickCost, purchaseQuantity, 1.25);

  // Общая мощность автокликеров с учетом множителя
  const totalAutoClickPower = autoClickerCount * multiAutoClickPower;

  return (
    <div className="game-container">
      {/* Fixed header with game title and dirt counter */}
      <header className="game-header fixed-header">
        <h1>Dirt Clicker</h1>
        <div className="dirt-counter">
          <div className="dirt-count">Dirt: {formatNumber(dirtCount)}</div>
          {autoClickerCount > 0 && (
            <div className="dirt-per-second">
              <span>{formatNumber(totalAutoClickPower)}/s</span>
            </div>
          )}
        </div>
      </header>

      {/* Add spacing div to prevent content from going under the fixed header */}
      <div className="header-spacer"></div>

      {/* Отдельный контейнер для всех анимаций, вынесенный на уровень страницы */}
      <div className="animations-container">
        <AnimatePresence>
          {[...clickAnimations, ...autoClickAnimations].map(anim => (
            <motion.div
              key={anim.id}
              className="click-animation"
              style={{
                position: 'fixed',
                left: `${anim.x}px`,
                top: `${anim.y}px`,
                pointerEvents: 'none',
                zIndex: 60,
              }}
              initial={{ 
                opacity: 1,
                scale: 1,
                translateX: '-50%',
                translateY: '-50%'
              }}
              animate={{ 
                top: `${anim.y - 40}px`,
                opacity: 0,
                scale: 1.2
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src={dirtImage} 
                alt="" 
                className="mini-dirt"
              />
              <span className="click-power-text">+{anim.value}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Отдельный контейнер для лопат на уровне страницы */}
      {activeTab === 'game' && autoClickerCount > 0 && (
        <div className="global-shovels-container">
          <AutoDigger />
        </div>
      )}

      {/* Информационная панель с деталями улучшения */}
      <AnimatePresence>
        {activeInfoPanel && (
          <div className="info-overlay" onClick={() => setActiveInfoPanel(null)}>
            <div onClick={(e) => e.stopPropagation()}>
              <InfoPanel 
                type={activeInfoPanel} 
                onClose={() => setActiveInfoPanel(null)} 
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      <main className="game-main">
        {/* Game Tab Content */}
        {activeTab === 'game' && (
          <div className="clicker-area">
            {/* Убрали AutoDigger отсюда */}
            
            <motion.div 
              ref={dirtBlockRef}
              className="dirt-block-container"
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={handleClick}
              onContextMenu={(e) => e.preventDefault()} // Отключаем контекстное меню на контейнере
            >
              <img 
                src={dirtImage} 
                alt="Dirt Block" 
                draggable="false" 
                onContextMenu={(e) => e.preventDefault()} // Отключаем контекстное меню на изображении
              />
            </motion.div>
          </div>
        )}

        {/* Upgrades Tab Content */}
        {activeTab === 'upgrades' && (
          <div className="upgrades-area">
            <h2>Upgrades</h2>
            
            {/* Purchase Quantity Selector */}
            <div className="quantity-selector">
              <div className="quantity-label">Purchase Quantity:</div>
              <div className="quantity-buttons">
                <button 
                  className={`quantity-btn ${purchaseQuantity === 1 ? 'active' : ''}`}
                  onClick={() => setPurchaseQuantity(1)}
                >
                  x1
                </button>
                <button 
                  className={`quantity-btn ${purchaseQuantity === 10 ? 'active' : ''}`}
                  onClick={() => setPurchaseQuantity(10)}
                >
                  x10
                </button>
                <button 
                  className={`quantity-btn ${purchaseQuantity === 50 ? 'active' : ''}`}
                  onClick={() => setPurchaseQuantity(50)}
                >
                  x50
                </button>
                <button 
                  className={`quantity-btn ${purchaseQuantity === 100 ? 'active' : ''}`}
                  onClick={() => setPurchaseQuantity(100)}
                >
                  x100
                </button>
              </div>
            </div>
            
            <div className="upgrade-buttons">
              <div className="upgrade-container">
                <button 
                  className="upgrade-btn"
                  onClick={() => purchaseClickPower(purchaseQuantity)} 
                  disabled={dirtCount < totalClickPowerPrice}
                >
                  Increase Click Power (Current: {formatNumber(clickPower)})
                  <span className="quantity-tag">+{purchaseQuantity} levels</span>
                  <span className="price">Cost: {formatNumber(totalClickPowerPrice)} dirt</span>
                </button>
                <button 
                  className="info-btn"
                  onClick={() => setActiveInfoPanel('clickPower')}
                >
                  i
                </button>
              </div>
              
              <div className="upgrade-container">
                <button 
                  className="upgrade-btn"
                  onClick={() => purchaseMultiClick(purchaseQuantity)} 
                  disabled={dirtCount < totalMultiClickPrice}
                >
                  Multi-Click (Current: x{multiClickPower.toFixed(1)})
                  <span className="quantity-tag">+{purchaseQuantity} levels</span>
                  <span className="price">Cost: {formatNumber(totalMultiClickPrice)} dirt</span>
                </button>
                <button 
                  className="info-btn"
                  onClick={() => setActiveInfoPanel('multiClick')}
                >
                  i
                </button>
              </div>
              
              <div className="upgrade-container">
                <button 
                  className="upgrade-btn"
                  onClick={() => purchaseAutoClicker(purchaseQuantity)} 
                  disabled={dirtCount < totalAutoClickerPrice}
                >
                  Auto Clicker (Current: {formatNumber(autoClickerCount)})
                  <span className="quantity-tag">+{purchaseQuantity} levels</span>
                  <span className="price">Cost: {formatNumber(totalAutoClickerPrice)} dirt</span>
                  <span className="description">Generates {formatNumber(totalAutoClickPower)} dirt per second</span>
                </button>
                <button 
                  className="info-btn"
                  onClick={() => setActiveInfoPanel('autoClicker')}
                >
                  i
                </button>
              </div>

              {/* Добавляем новую кнопку для улучшения мульти-автоклика */}
              {autoClickerCount > 0 && (
                <div className="upgrade-container">
                  <button 
                    className="upgrade-btn"
                    onClick={() => purchaseMultiAutoClick(purchaseQuantity)} 
                    disabled={dirtCount < totalMultiAutoClickPrice}
                  >
                    Multi-AutoClick (Current: x{multiAutoClickPower.toFixed(1)})
                    <span className="quantity-tag">+{purchaseQuantity} levels</span>
                    <span className="price">Cost: {formatNumber(totalMultiAutoClickPrice)} dirt</span>
                    <span className="description">Multiplies auto clicker efficiency</span>
                  </button>
                  <button 
                    className="info-btn"
                    onClick={() => setActiveInfoPanel('multiAutoClick')}
                  >
                    i
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      {/* Tab Navigation */}
      <nav className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'game' ? 'active' : ''}`} 
          onClick={() => setActiveTab('game')}
        >
          Game
        </button>
        <button 
          className={`tab-button ${activeTab === 'upgrades' ? 'active' : ''}`} 
          onClick={() => setActiveTab('upgrades')}
        >
          Upgrades
        </button>
      </nav>
    </div>
  )
}

export default App
