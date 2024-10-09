"use client";
import { useState, useEffect } from 'react';

import GestionProjet from './gestion_projet'; 
import GestionUser from './gestion_user'; // Importer le composant de gestion des utilisateurs

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [showGestionProjet, setShowGestionProjet] = useState(false); 
  const [showGestionUser, setShowGestionUser] = useState(false); 

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users/available/month');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des utilisateurs');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchAvailableUsers();
  }, []);

  // Gérer le clic pour afficher la gestion de projet
  const handleGestionProjetClick = () => {
    setShowGestionProjet(true); 
    setShowGestionUser(false); // Masquer la gestion des utilisateurs
  };

  // Gérer le clic pour afficher la gestion des utilisateurs
  const handleGestionUserClick = () => {
    setShowGestionUser(true); 
    setShowGestionProjet(false); // Masquer la gestion des projets
  };

  // Gérer le retour au tableau de bord
  const handleBackToDashboardClick = () => {
    setShowGestionProjet(false); 
    setShowGestionUser(false); // Réafficher le tableau de bord
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Tableau de bord</h1>

      {/* Si showGestionProjet et showGestionUser sont false, on affiche le tableau de bord */}
      {!showGestionProjet && !showGestionUser ? (
        <>
          <div className="grid grid-cols-2 gap-6">
            {/* Panel d'ajout de projet */}
            <div
              onClick={handleGestionProjetClick}
              className="bg-blue-500 text-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-blue-600 transition duration-300"
            >
              <h2 className="text-2xl font-bold">Ajouter un projet</h2>
              <p className="mt-2">Cliquez ici pour ajouter un nouveau projet.</p>
            </div>

            {/* Panel de gestion des utilisateurs */}
            <div
              onClick={handleGestionUserClick}
              className="bg-purple-500 text-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-purple-600 transition duration-300"
            >
              <h2 className="text-2xl font-bold">Gérer les utilisateurs</h2>
              <p className="mt-2">Cliquez ici pour ajouter et gérer les utilisateurs.</p>
            </div>
          </div>

          {/* Tableau des utilisateurs */}
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-500">Utilisateurs disponibles</h2>

            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-left">ID</th>
                  <th className="border px-4 py-2 text-left">Nom</th>
                  <th className="border px-4 py-2 text-left">Email</th>
                  <th className="border px-4 py-2 text-left">Rôle</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td className="border px-4 py-2 text-center">
                      Aucun utilisateur disponible ce mois-ci
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="border px-4 py-2">{user.id}</td>
                      <td className="border px-4 py-2">{user.name}</td>
                      <td className="border px-4 py-2">{user.email}</td>
                      <td className="border px-4 py-2">{user.role}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
             {/* Statistiques - évolution du projet et des tâches côte à côte */}
             <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Statistiques - évolution du projet */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-blue-500">Évolution du projet</h2>
              <div className="flex justify-center">
                {/* Graphique de l'évolution du projet */}
              
              </div>
            </div>

            {/* Statistiques - évolution des tâches */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-blue-500">Évolution des tâches</h2>
              <div className="flex justify-center">
                {/* Graphique de l'évolution des tâches */}
             
              </div>
            </div>
          </div>
        </>
      ) : showGestionProjet ? (
        <>
          <GestionProjet />
          <button
            onClick={handleBackToDashboardClick}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
          >
            Retour au tableau de bord
          </button>
        </>
      ) : showGestionUser ? (
        <>
          <GestionUser />
          <button
            onClick={handleBackToDashboardClick}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
          >
            Retour au tableau de bord
          </button>
        </>
      ) : null}
    </div>
  );
}
