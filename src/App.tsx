import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
import { EndermanAnimation } from './components/EndermanAnimation';
import { AllayHelper } from './components/AllayHelper';
import { LuckyCat } from './components/LuckyCat';
import { PirateParrot } from './components/PirateParrot';
import { OfflineProgress } from './components/OfflineProgress/OfflineProgress';
import { Fox } from './components/Fox/Fox';

// Выносим анимацию клика в отдельный компонент для оптимизации
const ClickAnimationComponent = React.memo(({ animation }: { animation: ClickAnimation }) => {
  return (
    <motion.div
      key={animation.id}
      className={`click-animation ${animation.isLucky ? 'lucky-click' : ''}`}
      style={{
        position: 'fixed',
        left: `${animation.x}px`,
        top: `${animation.y}px`,
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
        top: `${animation.y - 40}px`,
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
      <span className={`click-power-text ${animation.isLucky ? 'lucky-text' : ''}`}>
        +{formatNumber(animation.value)}
      </span>
    </motion.div>
  );
});

function App() {
  const { 
    dirtCount, 
    clickPower, 
    autoClickerCount, 
    friendlyEndermanCount,
    allayCount,
    luckyCatCount,
    pirateParrotCount,
    foxCount,
    increaseDirtCount,
    init,
    updateLastVisitTime,
    getDirtPerSecond
  } = useGameStore();
  
  // State for click animations with throttling
  const [clickAnimations, setClickAnimations] = useState<ClickAnimation[]>([]);
  const [autoClickAnimations, setAutoClickAnimations] = useState<ClickAnimation[]>([]);
  const lastClickTime = useRef(0);
  const CLICK_THROTTLE = 50; // ms
  
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

  // Мемоизируем функцию обновления позиции блока
  const handleBlockPositionUpdate = useCallback((position: { x: number, y: number, width: number, height: number }) => {
    setBlockPosition(position);
  }, []);

  // Оптимизируем автоматическую добычу
  useEffect(() => {
    let animationFrameId: number;
    let lastAutoClickTime = 0;
    const AUTO_CLICK_INTERVAL = 1000; // 1 секунда

    const autoClickLoop = (timestamp: number) => {
      if ((timestamp - lastAutoClickTime) >= AUTO_CLICK_INTERVAL) {
        const totalDirtPerSecond = getDirtPerSecond();
        
        if (totalDirtPerSecond > 0) {
          increaseDirtCount(totalDirtPerSecond);
          
          if (blockPosition && activeTab === 'game') {
            const randomAngle = Math.random() * Math.PI * 2;
            const randomDistance = Math.random() * (blockPosition.width / 2 - 10);
            
            const randomX = blockPosition.x + Math.cos(randomAngle) * randomDistance;
            const randomY = blockPosition.y + Math.sin(randomAngle) * randomDistance;
            
            const newAnimation = {
              id: Date.now(),
              x: randomX,
              y: randomY,
              value: totalDirtPerSecond,
              isLucky: false
            };
            
            setAutoClickAnimations(prev => {
              const filtered = prev.filter(anim => (timestamp - anim.id) < 800);
              return [...filtered, newAnimation];
            });
          }
        }
        
        lastAutoClickTime = timestamp;
      }
      
      animationFrameId = requestAnimationFrame(autoClickLoop);
    };
    
    animationFrameId = requestAnimationFrame(autoClickLoop);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [blockPosition, activeTab, getDirtPerSecond, increaseDirtCount]);

  // Оптимизируем обработчик клика
  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastClickTime.current < CLICK_THROTTLE) return;
    lastClickTime.current = now;

    let clickAmount = clickPower * (1 + 0.15 * clickPower);
    const luckChance = luckyCatCount * 0.1;
    
    if (Math.random() < luckChance) {
      clickAmount *= 10;
    }
    
    increaseDirtCount(clickAmount);
    
    const newAnimation = {
      id: now,
      x: event.clientX,
      y: event.clientY,
      value: clickAmount,
      isLucky: clickAmount > clickPower * (1 + 0.15 * clickPower)
    };
    
    setClickAnimations(prev => {
      const filtered = prev.filter(anim => now - anim.id < 800);
      return [...filtered, newAnimation];
    });
  }, [clickPower, luckyCatCount, increaseDirtCount]);

  // Мемоизируем общую добычу в секунду
  const totalDirtPerSecond = useMemo(() => getDirtPerSecond(), [getDirtPerSecond]);

  // Инициализация и офлайн прогресс
  useEffect(() => {
    const progress = init();
    if (progress.earnedDirt > 0) {
      setOfflineEarnings(progress);
      setShowOfflineProgress(true);
    }
  }, [init]);

  // Обработчик закрытия страницы
  useEffect(() => {
    const handleBeforeUnload = () => {
      updateLastVisitTime();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [updateLastVisitTime]);

  const handleCloseOfflineProgress = useCallback(() => {
    setShowOfflineProgress(false);
  }, []);

  // Мемоизируем компоненты для предотвращения ненужных ререндеров
  const gameTabContent = useMemo(() => (
    activeTab === 'game' && (
      <>
        <EndermanAnimation />
        {allayCount > 0 && <AllayHelper blockPosition={blockPosition} />}
        {luckyCatCount > 0 && <LuckyCat />}
        {pirateParrotCount > 0 && <PirateParrot />}
        {foxCount > 0 && <Fox />}
      </>
    )
  ), [activeTab, allayCount, luckyCatCount, pirateParrotCount, foxCount, blockPosition]);

  return (
    <div className="game-container">
      <AudioPlayer />
      
      {gameTabContent}
      
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

      <div className="header-spacer"></div>

      <div className="animations-container">
        <AnimatePresence>
          {[...clickAnimations, ...autoClickAnimations].map(anim => (
            <ClickAnimationComponent key={anim.id} animation={anim} />
          ))}
        </AnimatePresence>
      </div>

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
        {activeTab === 'game' && (
          <div className="clicker-area">
            <DirtBlock 
              blockRef={dirtBlockRef} 
              onBlockClick={handleClick}
              onPositionUpdate={handleBlockPositionUpdate}
            />
            
            {autoClickerCount > 0 && (
              <div className="global-shovels-container">
                <AutoDigger blockPosition={blockPosition} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'upgrades' && (
          <div className="upgrades-area">
            <UpgradesPanel />
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="settings-area">
            <SettingsPanel />
          </div>
        )}
      </main>
      
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
