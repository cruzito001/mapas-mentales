import React, { useState } from 'react';
import { useThemeSafe } from '../hooks/useThemeSafe';
import ThemeToggle from './ThemeToggle';
import styles from './EditorToolbar.module.css';

const EditorToolbar = ({ 
  tool, 
  onToolChange, 
  zoom, 
  onZoom, 
  onResetView, 
  selectedNode, 
  onNodeUpdate, 
  onNodeDelete 
}) => {
  const { isDarkMode } = useThemeSafe();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTextOptions, setShowTextOptions] = useState(false);

  const tools = [
    {
      id: 'select',
      label: 'Seleccionar',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
        </svg>
      )
    },
    {
      id: 'node',
      label: 'Agregar Nodo',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      )
    },
    {
      id: 'connection',
      label: 'Conectar',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M6 9l6 6 6-6"></path>
        </svg>
      )
    }
  ];

  const colors = [
    '#00A651', // Verde principal
    '#007AFF', // Azul
    '#FF3B30', // Rojo
    '#FF9500', // Naranja
    '#AF52DE', // Púrpura
    '#32D74B', // Verde claro
    '#64D2FF', // Azul claro
    '#FF2D92', // Rosa
    '#8E8E93', // Gris
    '#34C759', // Verde sistema
    '#FFD60A', // Amarillo
    '#BF5AF2', // Púrpura claro
    '#FF6B35', // Naranja vibrante
    '#5AC8FA', // Azul cielo
    '#30D158', // Verde menta
    '#FF453A', // Rojo coral
    '#AC8E68', // Marrón
    '#48484A', // Gris oscuro
    '#FFFFFF', // Blanco
    '#000000'  // Negro
  ];

  const handleZoomIn = () => {
    onZoom(0.1, window.innerWidth / 2, window.innerHeight / 2);
  };

  const handleZoomOut = () => {
    onZoom(-0.1, window.innerWidth / 2, window.innerHeight / 2);
  };

  const handleColorChange = (color) => {
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { color });
    }
    setShowColorPicker(false);
  };

  const handleFontSizeChange = (fontSize) => {
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { fontSize });
    }
  };

  const handleDeleteNode = () => {
    if (selectedNode && selectedNode.id !== 'root') {
      onNodeDelete(selectedNode.id);
    }
  };

  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div className={styles.toolbar}>
      {/* Left section - Navigation */}
      <div className={styles.toolbarSection}>
        <button 
          className={styles.homeButton}
          onClick={goHome}
          title="Volver al inicio"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9,22 9,12 15,12 15,22"></polyline>
          </svg>
        </button>
      </div>

      {/* Center section - Tools */}
      <div className={styles.toolbarSection}>
        <div className={styles.toolGroup}>
          {tools.map((toolItem) => (
            <button
              key={toolItem.id}
              className={`${styles.toolButton} ${tool === toolItem.id ? styles.active : ''}`}
              onClick={() => onToolChange(toolItem.id)}
              title={toolItem.label}
            >
              {toolItem.icon}
            </button>
          ))}
        </div>

        <div className={styles.separator}></div>

        {/* Zoom controls */}
        <div className={styles.toolGroup}>
          <button 
            className={styles.toolButton}
            onClick={handleZoomOut}
            title="Alejar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          
          <span className={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
          
          <button 
            className={styles.toolButton}
            onClick={handleZoomIn}
            title="Acercar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          
          <button 
            className={styles.toolButton}
            onClick={onResetView}
            title="Restablecer vista"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M8 16H3v5"></path>
            </svg>
          </button>
        </div>

        {/* Node editing tools */}
        {selectedNode && (
          <>
            <div className={styles.separator}></div>
            <div className={styles.toolGroup}>
              <div className={styles.colorPickerContainer}>
                <button 
                  className={styles.colorButton}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  style={{ backgroundColor: selectedNode.color }}
                  title="Cambiar color"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="13.5" cy="6.5" r=".5"></circle>
                    <circle cx="17.5" cy="10.5" r=".5"></circle>
                    <circle cx="8.5" cy="7.5" r=".5"></circle>
                    <circle cx="6.5" cy="12.5" r=".5"></circle>
                    <path d="m12 2 3.3 6 5.4.7-3.9 3.8.9 5.3L12 15.4l-4.8 2.4.9-5.3L4.2 8.7l5.4-.7L12 2z" fill="currentColor" opacity="0.3"></path>
                    <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1"></path>
                  </svg>
                </button>
                
                {showColorPicker && (
                  <div className={styles.colorPicker}>
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={styles.colorOption}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.fontSizeContainer}>
                <button 
                  className={styles.toolButton}
                  onClick={() => setShowTextOptions(!showTextOptions)}
                  title="Opciones de texto"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="4,7 4,4 20,4 20,7"></polyline>
                    <line x1="9" y1="20" x2="15" y2="20"></line>
                    <line x1="12" y1="4" x2="12" y2="20"></line>
                  </svg>
                </button>
                
                {showTextOptions && (
                  <div className={styles.textOptions}>
                    {[12, 14, 16, 18, 20, 24].map((size) => (
                      <button
                        key={size}
                        className={`${styles.fontSizeOption} ${selectedNode.fontSize === size ? styles.active : ''}`}
                        onClick={() => handleFontSizeChange(size)}
                      >
                        {size}px
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedNode.id !== 'root' && (
                <button 
                  className={`${styles.toolButton} ${styles.deleteButton}`}
                  onClick={handleDeleteNode}
                  title="Eliminar nodo"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right section - Theme toggle */}
      <div className={styles.toolbarSection}>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default EditorToolbar;