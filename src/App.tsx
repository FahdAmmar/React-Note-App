// src/App.tsx
import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { NotesProvider } from './context/NotesContext';
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <ThemeProvider>
      <NotesProvider>
        <MainLayout />
      </NotesProvider>
    </ThemeProvider>
  );
}

export default App;