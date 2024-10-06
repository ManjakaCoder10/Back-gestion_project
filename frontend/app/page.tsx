"use client";  // Ajoutez cette ligne en haut du fichier

import { useState } from 'react';
import Login from './login'; 
import Dashboard from './dashboard';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div>
      {isAuthenticated ? <Dashboard /> : <Login onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
}
