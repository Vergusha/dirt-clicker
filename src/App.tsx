import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dirtImage from './assets/dirt.webp'
import './App.css'
import { useGameStore } from './store/gameStore'

// Define an interface for click animation
interface ClickAnimation {
  id: number;
  x: number;
  y: number;
  value: number;
}

function App() {
  const { 
    dirtCount, 
    clickPower, 
    autoClickerCount, 
    multiClickPower,
    increaseDirtCount, 
    buyClickPower, 
    buyAutoClicker,
    buyMultiClick,
    clickPowerPrice,
    autoClickerPrice,
    multiClickPrice
  } = useGameStore()
  
  // State for click animations
  const [clickAnimations, setClickAnimations] = useState<ClickAnimation[]>([])
  
  // Handle auto clickers
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoClickerCount > 0) {
        increaseDirtCount(autoClickerCount)
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [autoClickerCount, increaseDirtCount])

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const power = clickPower * multiClickPower;
    increaseDirtCount(power)
    
    // Get click position relative to the clicked element
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Add a new animation at the click position
    const newAnimation = {
      id: Date.now(),
      x,
      y,
      value: power
    };
    
    setClickAnimations(prev => [...prev, newAnimation]);
    
    // Remove the animation after it completes
    setTimeout(() => {
      setClickAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id));
    }, 1000);
  }

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>Dirt Clicker</h1>
        <div className="dirt-counter">Dirt: {dirtCount.toFixed(0)}</div>
      </header>

      <main className="game-main">
        <div className="clicker-area">
          <motion.div 
            className="dirt-block"
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={handleClick}
            style={{ position: 'relative', overflow: 'visible' }}
            onContextMenu={(e) => e.preventDefault()} // Отключаем контекстное меню на контейнере
          >
            <img 
              src={dirtImage} 
              alt="Dirt Block" 
              draggable="false" 
              onContextMenu={(e) => e.preventDefault()} // Отключаем контекстное меню на изображении
            />
            
            {/* Click animations */}
            <AnimatePresence>
              {clickAnimations.map(anim => (
                <motion.div
                  key={anim.id}
                  className="click-animation"
                  style={{
                    position: 'absolute',
                    left: `${anim.x}px`,
                    top: `${anim.y}px`,
                    pointerEvents: 'none',
                    transform: 'translate(-50%, -50%)' // Центрирование анимации относительно точки клика
                  }}
                  initial={{ 
                    opacity: 1,
                    scale: 1 // Фиксированный начальный размер
                  }}
                  animate={{ 
                    top: `${anim.y - 40}px`,  // Move upward from click point
                    opacity: 0,
                    scale: 1.2 // Фиксированный конечный размер
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <img 
                    src={dirtImage} 
                    alt="" 
                    className="mini-dirt"
                    style={{ width: '24px', height: '24px' }} // Увеличиваю размер миниатюры в два раза
                  />
                  <span className="click-power-text">+{anim.value}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          <div className="click-power-display">
            <div className="click-power-title">Click Power</div>
            <div className="click-power-formula">
              <span className="power-value">{clickPower}</span>
              <span className="power-operator">×</span>
              <span className="power-value">{multiClickPower}</span>
              <span className="power-operator">=</span>
              <span className="power-result">{clickPower * multiClickPower}</span>
            </div>
            <div className="click-power-label">per click</div>
          </div>
        </div>

        <div className="upgrades-area">
          <h2>Upgrades</h2>
          <div className="upgrade-buttons">
            <button 
              className="upgrade-btn"
              onClick={buyClickPower} 
              disabled={dirtCount < clickPowerPrice}
            >
              Increase Click Power (Current: {clickPower})
              <span className="price">Cost: {clickPowerPrice} dirt</span>
            </button>
            
            <button 
              className="upgrade-btn"
              onClick={buyMultiClick} 
              disabled={dirtCount < multiClickPrice}
            >
              Multi-Click (Current: x{multiClickPower})
              <span className="price">Cost: {multiClickPrice} dirt</span>
            </button>
            
            <button 
              className="upgrade-btn"
              onClick={buyAutoClicker} 
              disabled={dirtCount < autoClickerPrice}
            >
              Auto Clicker (Current: {autoClickerCount})
              <span className="price">Cost: {autoClickerPrice} dirt</span>
              <span className="description">Generates {autoClickerCount} dirt per second</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
