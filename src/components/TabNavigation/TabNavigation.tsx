import React from 'react';
import { TabType } from '../../types';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

/**
 * Component for navigation between different game tabs
 */
export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tab-navigation">
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
    </div>
  );
};