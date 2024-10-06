// src/components/Dashboard.js
"use client";
import { useState, useEffect } from 'react';


import GestionProjet from './gestion_projet'; // Importation du composant GestionProjet

// Enregistrement des éléments de chart.js


export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [showGestionProjet, setShowGestionProjet] = useState(false); // État pour afficher ou cacher gestion_projet

  // Récupérer les utilisateurs dès le chargement du composant
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
    setShowGestionProjet(true); // Afficher le composant GestionProjet et masquer le reste
  };

  // Gérer le retour au tableau de bord
  const handleBackToDashboardClick = () => {
    setShowGestionProjet(false); // Réafficher le tableau de bord et masquer la gestion de projet
  };

  // Données pour le graphique de l'évolution du projet (exemple de graphique en ligne)
  const projectProgressData = {
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Projets terminés',
        data: [5, 10, 6, 8, 15, 12],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
      },
    ],
  };

  // Données pour le graphique de l'évolution des tâches (exemple de graphique en barres)
  const taskProgressData = {
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Tâches complétées',
        data: [50, 75, 60, 90, 120, 100],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Tableau de bord</h1>

      {/* Si showGestionProjet est false, on affiche les panneaux et le tableau des utilisateurs */}
      {!showGestionProjet ? (
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
              onClick={() => alert("Interface de gestion des utilisateurs - fonctionnalité à venir")}
              className="bg-purple-500 text-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-purple-600 transition duration-300"
            >
              <h2 className="text-2xl font-bold">Gérer les utilisateurs</h2>
              <p className="mt-2">Cliquez ici pour ajouter et gérer les utilisateurs.</p>
            </div>
          </div>

     
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
      ) : (
        <>
  
          <GestionProjet />
          <button
            onClick={handleBackToDashboardClick}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
          >
            Retour au tableau de bord
          </button>
        </>
      )}
    </div>
  );
}
