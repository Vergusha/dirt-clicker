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
import { SettingsPanel } from './components/Settings';
import { TabNavigation } from './components/TabNavigation';
import { AudioPlayer } from './components/AudioPlayer';
import { ShovelSoundPlayer } from './components/ShovelSoundPlayer';
import { EndermanAnimation } from './components/EndermanAnimation';
import { AllayHelper } from './components/AllayHelper';
import { LuckyCat } from './components/LuckyCat';
import { PirateParrot } from './components/PirateParrot';
import { OfflineProgress } from './components/OfflineProgress/OfflineProgress';

function App() {
  const { 
    dirtCount, 
    clickPower, 
    autoClickerCount, 
    friendlyEndermanCount,
    allayCount,
    luckyCatCount,
    pirateParrotCount,
    multiAutoClickPower,
    increaseDirtCount,
    init,
    updateLastVisitTime
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
  
  // State for offline progress
  const [showOfflineProgress, setShowOfflineProgress] = useState(false);
  const [offlineEarnings, setOfflineEarnings] = useState({ earnedDirt: 0, timeAwayInSeconds: 0 });
  
  // Use useCallback to prevent the function from being recreated on every render
  const handleBlockPositionUpdate = useCallback((position: { x: number, y: number, width: number, height: number }) => {
    setBlockPosition(position);
  }, []); // Empty dependency array ensures the function is created only once
  
  // Handle auto clickers
  useEffect(() => {
    // Удаляем проверку активной вкладки, чтобы пассивная добыча работала на всех вкладках
    // if (activeTab !== 'game') return;
    
    const interval = setInterval(() => {
      // Calculate total auto click power from wood shovels with level scaling
      // Каждая лопата дает 1 землю в секунду, умноженное на (1 + 0.15 * уровень)
      const autoClickPower = autoClickerCount * (1 + 0.15 * autoClickerCount);
      
      // Calculate extra dirt from Friendly Endermen with level scaling
      // Каждый эндермен дает 5 земли в секунду, умноженное на (1 + 0.15 * уровень)
      const endermanPower = friendlyEndermanCount * 5 * (1 + 0.15 * friendlyEndermanCount);
      
      // Calculate dirt from Pirate Parrots with level scaling
      // Каждый попугай дает 30 земли в секунду, умноженное на (1 + 0.15 * уровень)
      const parrotPower = pirateParrotCount * 30 * (1 + 0.15 * pirateParrotCount);
      
      // Apply Allay multiplier if there are any Allays (each Allay adds 0.2x multiplier)
      const allayMultiplier = allayCount > 0 ? 1 + (allayCount * 0.2) : 1;
      
      // Total dirt generation per second with multipliers applied
      const totalAutoGeneratedDirt = (autoClickPower + endermanPower + parrotPower) * allayMultiplier;
      
      // Only proceed if there are any auto-generating units
      if (totalAutoGeneratedDirt > 0) {
        increaseDirtCount(totalAutoGeneratedDirt);
        
        // Создаем анимацию для автоматического копания только если активна вкладка Game
        if (blockPosition && activeTab === 'game') {
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
            value: totalAutoGeneratedDirt,
            isLucky: false
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
  }, [autoClickerCount, friendlyEndermanCount, pirateParrotCount, allayCount, increaseDirtCount, blockPosition, activeTab]);

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
    // Определяем базовую мощность клика с учетом увеличения на 15% с каждым уровнем
    let clickAmount = clickPower * (1 + 0.15 * clickPower);
    
    // Проверяем, сработала ли удача от Lucky Cat (10% шанс на ×10 к клику за каждого кота)
    const luckChance = luckyCatCount * 0.1; // 10% за каждого кота
    
    // Генерируем случайное число от 0 до 1 и проверяем, меньше ли оно шанса удачи
    if (Math.random() < luckChance) {
      // Если удача сработала, умножаем мощность клика на 10
      clickAmount *= 10;
    }
    
    // Добавляем землю с учетом возможного бонуса от удачи
    increaseDirtCount(clickAmount);
    
    // Получаем позицию клика относительно документа
    const clickX = event.clientX;
    const clickY = event.clientY;
    
    // Создаем новую анимацию в позиции клика
    const newAnimation = {
      id: Date.now(),
      x: clickX,
      y: clickY,
      value: clickAmount,
      isLucky: clickAmount > clickPower * (1 + 0.15 * clickPower) // Признак того, что сработала удача
    };
    
    setClickAnimations(prev => [...prev, newAnimation]);
    
    // Удаляем анимацию после ее завершения
    setTimeout(() => {
      setClickAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id));
    }, 800);
  };

  // Calculate total dirt per second from all sources
  const totalAutoClickPower = autoClickerCount * (1 + 0.15 * autoClickerCount);
  const endermanPower = friendlyEndermanCount * 5 * (1 + 0.15 * friendlyEndermanCount);
  const pirateParrotPower = pirateParrotCount * 10 * (1 + 0.15 * pirateParrotCount);
  const allayMultiplier = allayCount > 0 ? 1 + (allayCount * 0.2) : 1;
  const totalDirtPerSecond = (totalAutoClickPower + endermanPower + pirateParrotPower) * allayMultiplier;

  useEffect(() => {
    const progress = init();
    if (progress.earnedDirt > 0) {
      setOfflineEarnings(progress);
      setShowOfflineProgress(true);
    }
  }, [init]);

  // Добавляем обработчик закрытия страницы
  useEffect(() => {
    const handleBeforeUnload = () => {
      updateLastVisitTime();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [updateLastVisitTime]);

  const handleCloseOfflineProgress = () => {
    setShowOfflineProgress(false);
  };

  return (
    <div className="game-container">
      {/* Аудиокомпоненты */}
      <AudioPlayer />
      <ShovelSoundPlayer activeTab={activeTab} />
      
      {/* Enderman and Allay animations will only be visible in game tab */}
      {activeTab === 'game' && (
        <>
          <EndermanAnimation />
          {allayCount > 0 && <AllayHelper blockPosition={blockPosition} />}
          {luckyCatCount > 0 && <LuckyCat />}
          {pirateParrotCount > 0 && <PirateParrot />}
        </>
      )}
      
      {/* Fixed header with game title and dirt counter */}
      <header className="game-header fixed-header">
        <h1>Dirt Clicker</h1>
        <div className="dirt-counter">
          <div className="dirt-count">Dirt: {formatNumber(dirtCount)}</div>
          {totalDirtPerSecond > 0 && (
            <div className="dirt-per-second">
              <span>{formatNumber(totalDirtPerSecond)}/s</span>
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
              className={`click-animation ${anim.isLucky ? 'lucky-click' : ''}`}
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
              <span className={`click-power-text ${anim.isLucky ? 'lucky-text' : ''}`}>+{formatNumber(anim.value)}</span>
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
              <div className="global-shovels-container">
                <AutoDigger blockPosition={blockPosition} />
              </div>
            )}
          </div>
        )}

        {/* Upgrades Tab Content */}
        {activeTab === 'upgrades' && (
          <div className="upgrades-area">
            <UpgradesPanel />
          </div>
        )}
        
        {/* Settings Tab Content */}
        {activeTab === 'settings' && (
          <div className="settings-area">
            <SettingsPanel />
          </div>
        )}
      </main>
      
      {/* Tab Navigation */}
      <nav className="tab-navigation">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </nav>

      {showOfflineProgress && (
        <OfflineProgress
          earnedDirt={offlineEarnings.earnedDirt}
          timeAwayInSeconds={offlineEarnings.timeAwayInSeconds}
          onClose={handleCloseOfflineProgress}
        />
      )}
    </div>
  );
}

export default App;
