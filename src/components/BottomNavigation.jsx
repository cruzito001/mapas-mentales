import React, { useState, useRef } from 'react';
import { useThemeSafe } from '../hooks/useThemeSafe';
import SettingsPanel from './SettingsPanel';
import styles from './BottomNavigation.module.css';

const BottomNavigation = ({ activeTab = 'mis-mapas', onTabChange }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const configButtonRef = useRef(null);
  
  const { isDarkMode } = useThemeSafe();

  const navigationItems = [
    {
      id: 'mis-mapas',
      label: 'Mis Mapas',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10,9 9,9 8,9"></polyline>
        </svg>
      )
    },
    {
      id: 'crear',
      label: 'Crear',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      )
    },
    {
      id: 'plantillas',
      label: 'Plantillas',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="9" x2="15" y2="15"></line>
          <line x1="15" y1="9" x2="9" y2="15"></line>
        </svg>
      )
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      )
    }
  ];

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    
    // Navigation logic
    switch (tabId) {
      case 'mis-mapas':
        window.location.href = '/';
        break;
      case 'crear':
        window.location.href = '/editor';
        break;
      case 'plantillas':
        // TODO: Implement templates page
        console.log('Templates page not implemented yet');
        break;
      case 'configuracion':
        setIsSettingsOpen(true);
        break;
      default:
        break;
    }
    
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <>
      <nav className={styles.bottomNav}>
      <div className={styles.navContainer}>
        {navigationItems.map((item) => (
          <button
            key={item.id}
            ref={item.id === 'configuracion' ? configButtonRef : null}
            onClick={() => handleTabClick(item.id)}
            className={`${styles.navItem} ${
              currentTab === item.id ? styles.active : ''
            }`}
          >
            <div className={styles.navIcon}>
              {item.icon}
            </div>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </div>
      </nav>
      
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        buttonRef={configButtonRef}
      />
    </>
  );
};

export default BottomNavigation;