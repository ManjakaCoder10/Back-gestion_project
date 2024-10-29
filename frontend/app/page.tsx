"use client";


import { useState } from 'react';
import Login from './login';
import Dashboard from './dashboard';
import UserInterface from './userInterface';

export default function App() {
  const [user, setUser] = useState<{ isAdmin: boolean; id: string } | null>(null);

  const handleLoginSuccess = (data: { isAdmin: boolean; id: string }) => {
    setUser(data);
  };

  if (user) {
    return user.isAdmin ? <Dashboard /> : <UserInterface userId={user.id} />;
  }

  return <Login onLoginSuccess={handleLoginSuccess} />;
}
