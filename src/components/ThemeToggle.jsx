import React from 'react';
import { useThemeSafe } from '../hooks/useThemeSafe';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useThemeSafe();

  return (
    <button 
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <div className={styles.toggleTrack}>
        <div className={`${styles.toggleThumb} ${isDarkMode ? styles.dark : styles.light}`}>
          {isDarkMode ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          )}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;