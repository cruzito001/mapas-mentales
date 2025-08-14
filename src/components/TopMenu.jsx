import React from 'react';
import styles from './TopMenu.module.css';

const TopMenu = () => {
  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: '🏠' },
    { id: 'editor', label: 'Editor', icon: '✏️' },
    { id: 'plantillas', label: 'Plantillas', icon: '📋' },
    { id: 'configuracion', label: 'Configuración', icon: '⚙️' }
  ];

  const handleMenuClick = (itemId) => {
    console.log(`Navegando a: ${itemId}`);
    // Aquí se implementará la navegación
  };

  return (
    <nav className={styles.topMenu}>
      <div className={styles.menuContainer}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🧠</span>
          <span className={styles.logoText}>Mapas Mentales</span>
        </div>
        
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.id} className={styles.menuItem}>
              <button 
                className={styles.menuButton}
                onClick={() => handleMenuClick(item.id)}
                aria-label={item.label}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <span className={styles.menuLabel}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TopMenu;