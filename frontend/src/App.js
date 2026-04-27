import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AppRoutes />
            </Router>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </DataProvider>
  );
}

export default App;
