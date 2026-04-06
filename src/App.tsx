// src/App.tsx
import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { NotesProvider } from './context/NotesContext';
import { SnackbarProvider } from './context/SnackbarProvider'
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <ThemeProvider>
      <NotesProvider>
        <SnackbarProvider>

          <MainLayout />
        </SnackbarProvider>
      </NotesProvider>
    </ThemeProvider>
  );
}

export default App;