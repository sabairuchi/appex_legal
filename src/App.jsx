import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

import './styles/global.css';
import './styles/components.css';
import './styles/navigation.css';
import './styles/footer.css';
import './styles/home.css';
import './styles/practice-areas.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
