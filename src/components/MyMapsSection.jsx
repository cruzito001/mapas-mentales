import React, { useState, useEffect } from 'react';
import MindMapCard from './MindMapCard.jsx';
import styles from './MyMapsSection.module.css';

const MyMapsSection = () => {
  const [savedMaps, setSavedMaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedMaps();
  }, []);

  const loadSavedMaps = () => {
    try {
      const saved = localStorage.getItem('savedMindMaps');
      if (saved) {
        const maps = JSON.parse(saved);
        // Convertir las fechas de string a Date objects
        const mapsWithDates = maps.map(map => ({
          ...map,
          lastModified: new Date(map.lastModified)
        }));
        // Ordenar por fecha de modificación (más reciente primero)
        mapsWithDates.sort((a, b) => b.lastModified - a.lastModified);
        setSavedMaps(mapsWithDates);
      } else {
        setSavedMaps([]);
      }
    } catch (error) {
      console.error('Error loading saved maps:', error);
      setSavedMaps([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (mapId) => {
    // Navegar al editor con el mapa seleccionado
    window.location.href = `/editor?mapId=${mapId}`;
  };

  const getNodeCount = (mapData) => {
    if (!mapData || !mapData.nodes) return 0;
    return mapData.nodes.length;
  };

  const generateThumbnail = (title, category = 'personal') => {
    const prompts = {
      empresarial: `business%20mind%20map%20${encodeURIComponent(title)}%20professional%20clean%20design`,
      academico: `academic%20mind%20map%20${encodeURIComponent(title)}%20educational%20style`,
      personal: `personal%20mind%20map%20${encodeURIComponent(title)}%20colorful%20creative%20design`
    };
    
    const prompt = prompts[category] || prompts.personal;
    return `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=${prompt}&image_size=landscape_4_3`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando mapas guardados...</p>
      </div>
    );
  }

  if (savedMaps.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h9l4 4V12z" />
          </svg>
        </div>
        <h3>No hay mapas guardados</h3>
        <p>Los mapas que guardes aparecerán aquí. ¡Crea tu primer mapa mental!</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Mis Mapas</h2>
        <p>{savedMaps.length} mapa{savedMaps.length !== 1 ? 's' : ''} guardado{savedMaps.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className={styles.cardsGrid}>
        {savedMaps.map((map) => (
          <MindMapCard
            key={map.id}
            title={map.title}
            description={map.description || `Mapa mental creado el ${map.lastModified.toLocaleDateString()}`}
            category={map.category || 'personal'}
            lastModified={map.lastModified}
            nodeCount={getNodeCount(map.data)}
            thumbnail={map.thumbnail || generateThumbnail(map.title, map.category)}
            onClick={() => handleMapClick(map.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default MyMapsSection;