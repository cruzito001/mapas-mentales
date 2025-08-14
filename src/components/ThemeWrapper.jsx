import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';

const ThemeWrapper = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

export default ThemeWrapper;