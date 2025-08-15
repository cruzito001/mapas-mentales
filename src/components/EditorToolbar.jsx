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
  onNodeDelete,
  connectionStyles,
  onConnectionStylesChange,
  selectedConnection,
  onConnectionDelete,
  onUndo,
  onRedo,
  onClearAll,
  canUndo,
  canRedo,
  onExportPDF,
  nodes,
  connections,
  pan,
  currentMapInfo
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

  const [isExporting, setIsExporting] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [mapName, setMapName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('personal');

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      if (onExportPDF) {
        await onExportPDF();
      } else {
        alert('Funcionalidad de exportar PDF no disponible');
      }
    } finally {
      setIsExporting(false);
    }
    setShowSaveMenu(false);
  };

  const handleSaveProgress = async () => {
    setShowSaveMenu(false);
    
    // Si es un mapa existente (abierto desde 'Mis Mapas'), actualizar directamente
    if (currentMapInfo && currentMapInfo.isExisting) {
      await updateExistingMap();
    } else {
      // Si es un mapa nuevo, mostrar diálogo
      setShowSaveDialog(true);
      setSelectedCategory('personal'); // Reset to default
    }
  };

  const updateExistingMap = async () => {
    try {
      const now = new Date();
      const savedMaps = JSON.parse(localStorage.getItem('savedMindMaps') || '[]');
      
      // Generate thumbnail
      const thumbnail = await generateMapThumbnail();
      
      // Buscar el mapa existente por ID
      const existingMapIndex = savedMaps.findIndex(map => map.id === currentMapInfo.id);
      
      if (existingMapIndex !== -1) {
        const existingMap = savedMaps[existingMapIndex];
        
        // Actualizar solo los datos del mapa, manteniendo título, categoría e ID
        const updatedMap = {
          ...existingMap,
          data: {
            nodes: nodes || [],
            connections: connections || [],
            zoom: zoom || 1,
            pan: pan || { x: 0, y: 0 }
          },
          thumbnail: thumbnail,
          lastModified: now.toISOString(),
          updatedAt: now.toISOString()
        };
        
        savedMaps[existingMapIndex] = updatedMap;
        localStorage.setItem('savedMindMaps', JSON.stringify(savedMaps));
        
        alert('Mapa actualizado exitosamente');
      } else {
        alert('Error: No se pudo encontrar el mapa para actualizar');
      }
    } catch (error) {
      console.error('Error al actualizar el mapa:', error);
      alert('Error al actualizar el mapa');
    }
  };

  const generateMapThumbnail = async () => {
    try {
      // Find the canvas element
      const canvasElement = document.querySelector('.mind-map-canvas');
      if (!canvasElement) return null;

      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(canvasElement, {
        backgroundColor: 'transparent',
        scale: 0.3, // Smaller scale for thumbnail
        width: 400,
        height: 300,
        useCORS: true,
        allowTaint: true
      });
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return null;
    }
  };

  const confirmSaveProgress = async () => {
    if (mapName.trim()) {
      const now = new Date();
      const savedMaps = JSON.parse(localStorage.getItem('savedMindMaps') || '[]');
      
      // Generate thumbnail
      const thumbnail = await generateMapThumbnail();
      
      // Buscar si ya existe un mapa con el mismo nombre
      const existingMapIndex = savedMaps.findIndex(map => 
        map.title === mapName.trim() || map.name === mapName.trim()
      );
      
      const mapData = {
        title: mapName.trim(),
        name: mapName.trim(), // Keep for backward compatibility
        category: selectedCategory,
        data: {
          nodes: nodes || [],
          connections: connections || [],
          zoom: zoom || 1,
          pan: pan || { x: 0, y: 0 }
        },
        thumbnail: thumbnail,
        lastModified: now.toISOString(),
        updatedAt: now.toISOString()
      };
      
      if (existingMapIndex !== -1) {
        // Actualizar mapa existente
        const existingMap = savedMaps[existingMapIndex];
        mapData.id = existingMap.id;
        mapData.createdAt = existingMap.createdAt; // Mantener fecha de creación original
        savedMaps[existingMapIndex] = mapData;
        alert('Mapa actualizado exitosamente');
      } else {
        // Crear nuevo mapa
        mapData.id = Date.now().toString();
        mapData.createdAt = now.toISOString();
        savedMaps.push(mapData);
        alert('Mapa guardado exitosamente');
      }
      
      localStorage.setItem('savedMindMaps', JSON.stringify(savedMaps));
      
      setShowSaveDialog(false);
      setMapName('');
      setSelectedCategory('personal');
    }
  };

  const cancelSaveProgress = () => {
    setShowSaveDialog(false);
    setMapName('');
    setSelectedCategory('personal');
  };

  const handleClearAllWithConfirm = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todo el mapa mental? Esta acción no se puede deshacer.')) {
      onClearAll();
    }
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
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFD700" stroke="none"></path>
                    <circle cx="6" cy="6" r="2" fill="#FF6B6B"></circle>
                    <circle cx="18" cy="6" r="2" fill="#4ECDC4"></circle>
                    <circle cx="6" cy="18" r="2" fill="#45B7D1"></circle>
                    <circle cx="18" cy="18" r="2" fill="#96CEB4"></circle>
                    <circle cx="12" cy="12" r="2" fill="#FFEAA7"></circle>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
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

      {/* Right section - Export and Theme toggle */}
      <div className={styles.toolbarSection}>
        {/* History Controls */}
        <div className={styles.toolGroup}>
          <button 
            className={`${styles.toolButton} ${!canUndo ? styles.disabled : ''}`}
            onClick={onUndo}
            disabled={!canUndo}
            title="Deshacer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7v6h6"></path>
              <path d="m21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
            </svg>
          </button>
          <button 
            className={`${styles.toolButton} ${!canRedo ? styles.disabled : ''}`}
            onClick={onRedo}
            disabled={!canRedo}
            title="Rehacer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 7v6h-6"></path>
              <path d="m3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path>
            </svg>
          </button>
          <button 
            className={styles.toolButton}
            onClick={handleClearAllWithConfirm}
            title="Borrar todo"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>

        <div className={styles.saveContainer}>
          <button 
            className={styles.saveButton}
            onClick={() => setShowSaveMenu(!showSaveMenu)}
            title="Opciones de guardado"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17,21 17,13 7,13 7,21"></polyline>
              <polyline points="7,3 7,8 15,8"></polyline>
            </svg>
            <span>Guardar</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.dropdownIcon}>
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </button>
          
          {showSaveMenu && (
            <div className={styles.saveMenu}>
              <button 
                className={styles.saveMenuItem}
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7,10 12,15 17,10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>{isExporting ? 'Exportando...' : 'Exportar PDF'}</span>
              </button>
              <button 
                className={styles.saveMenuItem}
                onClick={handleSaveProgress}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17,21 17,13 7,13 7,21"></polyline>
                  <polyline points="7,3 7,8 15,8"></polyline>
                </svg>
                <span>
                  {currentMapInfo && currentMapInfo.isExisting 
                    ? `Actualizar "${currentMapInfo.title}"` 
                    : 'Guardar Progreso'
                  }
                </span>
              </button>
            </div>
          )}
        </div>
        
        {showSaveDialog && (
          <div className={styles.saveDialog}>
            <div className={styles.saveDialogContent}>
              <h3>Guardar Progreso</h3>
              <p>Ingresa un nombre para tu mapa mental:</p>
              <input 
                type="text"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                placeholder="Nombre del mapa mental"
                className={styles.saveInput}
                autoFocus
              />
              
              <div className={styles.categorySelector}>
                <p>Selecciona una categoría:</p>
                <div className={styles.categoryOptions}>
                  <button 
                    className={`${styles.categoryOption} ${selectedCategory === 'personal' ? styles.selected : ''}`}
                    onClick={() => setSelectedCategory('personal')}
                  >
                    <span className={styles.categoryIcon}>👤</span>
                    <span>Personal</span>
                  </button>
                  <button 
                    className={`${styles.categoryOption} ${selectedCategory === 'escuela' ? styles.selected : ''}`}
                    onClick={() => setSelectedCategory('escuela')}
                  >
                    <span className={styles.categoryIcon}>🎓</span>
                    <span>Escuela</span>
                  </button>
                  <button 
                    className={`${styles.categoryOption} ${selectedCategory === 'negocio' ? styles.selected : ''}`}
                    onClick={() => setSelectedCategory('negocio')}
                  >
                    <span className={styles.categoryIcon}>💼</span>
                    <span>Negocio</span>
                  </button>
                </div>
              </div>
              
              <div className={styles.saveDialogActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={cancelSaveProgress}
                >
                  Cancelar
                </button>
                <button 
                  className={styles.confirmButton}
                  onClick={confirmSaveProgress}
                  disabled={!mapName.trim()}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default EditorToolbar;