import { useState, useEffect } from 'react';

/**
 * Hook seguro para usar el tema que maneja correctamente SSR y hidratación
 * Evita completamente el uso del contexto durante SSR
 * @returns {Object} Objeto con isDarkMode, toggleTheme e isClient
 */
export const useThemeSafe = () => {
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Detectar tema del sistema o localStorage solo en el cliente
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setIsDarkMode(shouldBeDark);
    
    // Aplicar clase al documento
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (!isClient) return;
    
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    // Guardar en localStorage
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    // Aplicar clase al documento
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return {
    isDarkMode,
    toggleTheme,
    theme: isDarkMode ? 'dark' : 'light',
    isClient
  };
};

export default useThemeSafe;