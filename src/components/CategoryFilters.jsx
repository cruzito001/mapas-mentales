import React, { useState } from 'react';
import styles from './CategoryFilters.module.css';

const CategoryFilters = ({ onCategoryChange, initialCategory = 'todos' }) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const categories = [
    {
      id: 'todos',
      label: 'Todos',
      icon: '📋',
      count: 12
    },
    {
      id: 'academico',
      label: 'Académico',
      icon: '🎓',
      count: 5
    },
    {
      id: 'empresarial',
      label: 'Empresarial',
      icon: '💼',
      count: 4
    },
    {
      id: 'personal',
      label: 'Personal',
      icon: '👤',
      count: 3
    }
  ];

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersWrapper}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`${styles.filterButton} ${
              activeCategory === category.id ? styles.active : ''
            }`}
          >
            <span className={styles.filterIcon}>{category.icon}</span>
            <span className={styles.filterLabel}>{category.label}</span>
            <span className={styles.filterCount}>({category.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilters;