import React, { useState, useEffect } from 'react';
import { useThemeSafe } from '../hooks/useThemeSafe';
import styles from './SettingsPanel.module.css';

const SettingsPanel = ({ isOpen, onClose, buttonRef }) => {
  const { isDarkMode, toggleTheme } = useThemeSafe();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleClearData = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los datos guardados? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('mindmap-data');
      localStorage.removeItem('mindmap-settings');
      window.location.reload();
    }
  };

  useEffect(() => {
    if (isOpen && buttonRef?.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 200; // ancho del dropdown
      const dropdownHeight = 120; // altura aproximada del dropdown
      
      setPosition({
        top: buttonRect.top - dropdownHeight - 10, // 10px de margen
        left: buttonRect.left + (buttonRect.width / 2) - (dropdownWidth / 2)
      });
    }
  }, [isOpen, buttonRef]);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose}></div>
      <div 
        className={styles.dropdown}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`
        }}
      >
        <div className={styles.arrow}></div>
        
        {/* Theme Toggle */}
        <div className={styles.settingItem}>
          <span className={styles.settingLabel}>Tema</span>
          <div className={styles.themeToggle}>
            <button
              className={`${styles.themeButton} ${!isDarkMode ? styles.active : ''}`}
              onClick={() => !isDarkMode || toggleTheme()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="5"></circle>
                <path d="m12 1 0 2"></path>
                <path d="m12 21 0 2"></path>
                <path d="m4.22 4.22 1.42 1.42"></path>
                <path d="m18.36 18.36 1.42 1.42"></path>
                <path d="m1 12 2 0"></path>
                <path d="m21 12 2 0"></path>
                <path d="m4.22 19.78 1.42-1.42"></path>
                <path d="m18.36 5.64 1.42-1.42"></path>
              </svg>
            </button>
            <button
              className={`${styles.themeButton} ${isDarkMode ? styles.active : ''}`}
              onClick={() => isDarkMode || toggleTheme()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.divider}></div>

        {/* Clear Data */}
        <div className={styles.settingItem}>
          <button className={styles.clearButton} onClick={handleClearData}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Limpiar mapas guardados
          </button>
        </div>
      </div>
    </>
  )
};

export default SettingsPanel;