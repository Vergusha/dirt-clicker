import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dirtImage from './assets/dirt.webp'
import './App.css'
import { useGameStore } from './store/gameStore'

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

  // Handle auto clickers
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoClickerCount > 0) {
        increaseDirtCount(autoClickerCount)
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [autoClickerCount, increaseDirtCount])

  const handleClick = () => {
    increaseDirtCount(clickPower * multiClickPower)
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
          >
            <img src={dirtImage} alt="Dirt Block" />
          </motion.div>
          <div className="click-info">
            <p>Click Power: {clickPower} x {multiClickPower} = {clickPower * multiClickPower} per click</p>
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
