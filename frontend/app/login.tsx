"use client";
import { useState } from 'react';

interface LoginProps {
  onLoginSuccess: (data: { isAdmin: boolean; id: string }) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log('Is Admin:', data.isAdmin);
      onLoginSuccess({ isAdmin: data.isAdmin, id: data.id });
    } else {
      setErrorMessage('Mot de passe incorrect');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      <div className="flex items-center justify-between max-w-5xl bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Image de connexion à gauche */}
        <div className="w-1/2 hidden lg:flex items-center justify-center bg-blue-500">
          <img 
            src="/3d-computer-website-loading-speed-test.jpg" 
            alt="Login Symbol" 
            className="h-3/4 transform transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Formulaire de connexion à droite */}
        <div className="w-full lg:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">Connexion</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition duration-200"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <button 
              type="submit" 
              className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Se connecter
            </button>
            {errorMessage && <p className="text-red-500 mt-2 text-center">{errorMessage}</p>}
          </form>

          {/* Liens supplémentaires */}
          <div className="mt-6 text-center">
           
            <p className="text-gray-600 mt-2">Mot de passe oublié ? 
              <a href="#" className="text-blue-500 hover:underline ml-1">Réinitialisez-le</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
