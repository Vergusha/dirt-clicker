import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dirtImage from './assets/dirt.webp';
import './App.css';
import { useGameStore } from './store/gameStore';
import { formatNumber } from './utils/formatNumber';
import { DirtBlock } from './components/DirtBlock';
import { AutoDigger } from './components/AutoDigger';
import { TabType, ClickAnimation, UpgradeType } from './types';
import { InfoPanel } from './components/InfoPanel';
import { UpgradesPanel } from './components/Upgrades/UpgradesPanel';

function App() {
  const { 
    dirtCount, 
    clickPower, 
    autoClickerCount, 
    multiClickPower,
    multiAutoClickPower,
    increaseDirtCount,
  } = useGameStore();
  
  // State for click animations
  const [clickAnimations, setClickAnimations] = useState<ClickAnimation[]>([]);
  const [autoClickAnimations, setAutoClickAnimations] = useState<ClickAnimation[]>([]);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<TabType>('game');
  
  // State for active info panel
  const [activeInfoPanel, setActiveInfoPanel] = useState<UpgradeType | null>(null);
  
  // Ref for tracking dirt block position
  const dirtBlockRef = useRef<HTMLDivElement>(null);
  const [blockPosition, setBlockPosition] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  
  // Use useCallback to prevent the function from being recreated on every render
  const handleBlockPositionUpdate = useCallback((position: { x: number, y: number, width: number, height: number }) => {
    setBlockPosition(position);
  }, []); // Empty dependency array ensures the function is created only once
  
  // Handle auto clickers
  useEffect(() => {
    // Если не на вкладке Game, прерываем выполнение эффекта
    if (activeTab !== 'game') return;
    
    const interval = setInterval(() => {
      if (autoClickerCount > 0) {
        // Общее количество земли от деревянных лопат (Wood Shovels) с учетом множителя
        const autoClickPower = autoClickerCount * multiAutoClickPower;
        increaseDirtCount(autoClickPower);
        
        // Создаем анимацию для автоматического копания с фиксированным размером
        if (blockPosition) {
          // Случайный угол для позиционирования анимации вокруг блока
          const randomAngle = Math.random() * Math.PI * 2;
          // Случайное расстояние от центра блока
          const randomDistance = Math.random() * (blockPosition.width / 2 - 10);
          
          // Вычисляем позицию на основе случайного угла и расстояния
          const randomX = blockPosition.x + Math.cos(randomAngle) * randomDistance;
          const randomY = blockPosition.y + Math.sin(randomAngle) * randomDistance;
          
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
          }, 800);
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [autoClickerCount, multiAutoClickPower, increaseDirtCount, blockPosition, activeTab]);

  // Очистка анимаций при смене вкладки
  useEffect(() => {
    // Если пользователь перешёл на вкладку отличную от Game - очищаем все анимации
    if (activeTab !== 'game') {
      setClickAnimations([]);
      setAutoClickAnimations([]);
    }
  }, [activeTab]);

  // Обработчик клика по блоку земли
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const power = clickPower * multiClickPower;
    increaseDirtCount(power);
    
    // Получаем позицию клика относительно документа
    const clickX = event.clientX;
    const clickY = event.clientY;
    
    // Создаем новую анимацию в позиции клика
    const newAnimation = {
      id: Date.now(),
      x: clickX,
      y: clickY,
      value: power
    };
    
    setClickAnimations(prev => [...prev, newAnimation]);
    
    // Удаляем анимацию после ее завершения
    setTimeout(() => {
      setClickAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id));
    }, 800);
  };

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

      {/* Контейнер для всех анимаций (клики и автоклики) */}
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
        {/* Game Tab Content - Блок земли в центре */}
        {activeTab === 'game' && (
          <div className="clicker-area">
            {/* DirtBlock всегда в центре */}
            <DirtBlock 
              blockRef={dirtBlockRef} 
              onBlockClick={handleClick}
              onPositionUpdate={handleBlockPositionUpdate}
            />
            
            {/* Лопаты вокруг блока земли */}
            {autoClickerCount > 0 && (
              <AutoDigger blockPosition={blockPosition} />
            )}
          </div>
        )}

        {/* Upgrades Tab Content */}
        {activeTab === 'upgrades' && (
          <div className="upgrades-area">
            <UpgradesPanel />
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
  );
}

export default App;
