import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const theme = {
    darkMode,
    toggleDarkMode,
    colors: {
      primary: {
        50: '#e6ecf5',
        100: '#c1d0e6',
        200: '#98b1d6',
        300: '#6f92c5',
        400: '#4b7ab9',
        500: '#3a64a0',
        600: '#1a365d',
        700: '#142945',
        800: '#0d1b2e',
        900: '#060e17',
      },
      secondary: {
        50: '#fff3e0',
        100: '#ffe0b2',
        200: '#ffcd80',
        300: '#ffb74d',
        400: '#ffa726',
        500: '#f6ad55',
        600: '#fb8c00',
        700: '#f57c00',
        800: '#ef6c00',
        900: '#e65100',
      },
      accent: {
        50: '#f9e4e1',
        100: '#f0bbb3',
        200: '#e58e82',
        300: '#d96150',
        400: '#cf3c2a',
        500: '#c62a15',
        600: '#b62613',
        700: '#9c4221',
        800: '#86190f',
        900: '#6d0f0a',
      },
      success: {
        500: '#48bb78',
      },
      warning: {
        500: '#ed8936',
      },
      error: {
        500: '#e53e3e',
      },
      neutral: {
        50: '#f7fafc',
        100: '#edf2f7',
        200: '#e2e8f0',
        300: '#cbd5e0',
        400: '#a0aec0',
        500: '#718096',
        600: '#4a5568',
        700: '#2d3748',
        800: '#1a202c',
        900: '#171923',
      },
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div className={darkMode ? 'dark-mode' : 'light-mode'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};