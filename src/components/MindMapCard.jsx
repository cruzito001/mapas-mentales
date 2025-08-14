import React from 'react';
import { useThemeSafe } from '../hooks/useThemeSafe';
import styles from './MindMapCard.module.css';

const MindMapCard = ({ 
  title, 
  description, 
  category, 
  lastModified, 
  thumbnail, 
  nodeCount = 0,
  onClick 
}) => {
  const { isDarkMode } = useThemeSafe();
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'academico': return '🎓';
      case 'empresarial': return '💼';
      case 'personal': return '👤';
      default: return '📋';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'academico': return '#007AFF';
      case 'empresarial': return '#FF9500';
      case 'personal': return '#5856D6';
      default: return '#00A651';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Hace un momento';
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return new Date(date).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.cardHeader}>
        <div className={styles.categoryBadge} style={{ backgroundColor: getCategoryColor(category) }}>
          <span className={styles.categoryIcon}>{getCategoryIcon(category)}</span>
          <span className={styles.categoryLabel}>{category || 'General'}</span>
        </div>
        <div className={styles.cardActions}>
          <button className={styles.actionButton}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
        </div>
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
        
        {thumbnail && (
          <div className={styles.thumbnailContainer}>
            <img src={thumbnail} alt={title} className={styles.thumbnail} />
          </div>
        )}
        
        <div className={styles.cardFooter}>
          <div className={styles.cardStats}>
            <span className={styles.statItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6"></path>
                <path d="m21 12-6 0m-6 0-6 0"></path>
              </svg>
              {nodeCount} nodos
            </span>
            <span className={styles.statItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
              {formatDate(lastModified)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindMapCard;