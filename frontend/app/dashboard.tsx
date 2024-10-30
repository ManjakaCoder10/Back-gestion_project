"use client";
import { useState, useEffect } from 'react';
import GestionProjet from './gestion_projet'; 
import GestionUser from './gestion_user'; 
import UserPieChart from './PieChart';
import TaskEvolutionChart from './TaskEvolutionChart';
import ProjectEvolutionChart from './ProjectEvolutionChart';
import { XMarkIcon, BellIcon } from '@heroicons/react/24/solid';
import Helpage from './HelpPage'; 

function NotificationOverlay({ notifications, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white w-full h-full p-6 rounded-lg shadow-lg overflow-y-auto flex flex-col relative" style={{ paddingBottom: '4rem' }}>
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-extrabold text-blue-600 flex items-center">
          <BellIcon className="h-8 w-8 text-blue-600 mr-2" />
          Notifications
        </h2>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white bg-red-500 rounded-full" aria-label="Fermer">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
  
      {notifications.length === 0 ? (
        <p className="text-gray-500 flex items-center justify-center">
          <BellIcon className="h-6 w-6 text-gray-400 mr-2" />
          Aucune notification.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200 max-h-full overflow-y-auto">
          {notifications.map((notification, index) => (
            <li key={index} className="flex items-center py-4 space-x-4">
              <BellIcon className="h-6 w-6 text-blue-500" />
              <div>
                <span className="text-gray-800 text-base">{notification.message}</span>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
  
  );
}
export default function Dashboard() {
  const [completedTasks, setCompletedTasks] = useState<number[]>(Array(30).fill(0));
  const [pendingTasks, setPendingTasks] = useState<number[]>(Array(30).fill(0));
  const [Projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showGestionProjet, setShowGestionProjet] = useState(false); 
  const [showGestionUser, setShowGestionUser] = useState(false); 
  const [devsChart, setDevsChart] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false); 
  const [showDivNotifications, setShowDivNotifications] = useState(true); 
  const [showHelp, setShowHelp] = useState(false);
  
  
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:3001/notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    }
  };
  useEffect(() => {
    
    
    
    fetchNotifications();
  }, []);

  const fetchTaskData = async () => {
    try {
      const response = await fetch('http://localhost:3001/tasks/graphe'); 
      const tasks = await response.json();

      const completed: number[] = Array(30).fill(0);
      const pending: number[] = Array(30).fill(0);
      const today = new Date();

      tasks.forEach((task: { deadline: string }) => {
        const taskDeadline = new Date(task.deadline);
        const taskDay = taskDeadline.getDate() - 1; 

        if (taskDeadline < today) {
          completed[taskDay] += 1;
        } else {
          pending[taskDay] += 1;
        }
      });

      setCompletedTasks(completed);
      setPendingTasks(pending);
    } catch (error) {
      console.error('Erreur lors de la récupération des données des tâches:', error);
    }
  };
  useEffect(() => {
    fetchTaskData();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/available/project');
      const data = await response.json();
      setDevsChart(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs disponibles:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    if (showHelp) {
      document.body.style.overflow = 'hidden'; // Empêche le défilement de la page principale
    } else {
      document.body.style.overflow = 'auto'; // Réactive le défilement de la page principale
    }
  
    // Nettoyage pour éviter tout effet indésirable
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showHelp]);
  useEffect(() => {
    if (showNotifications) {
      document.body.style.overflow = 'hidden'; // Empêche le défilement de la page principale
    } else {
      document.body.style.overflow = 'auto'; // Réactive le défilement de la page principale
    }
  
    // Nettoyage pour éviter tout effet indésirable
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showNotifications]);
  const fetchProject = async () => {
    try {
      const response = await fetch('http://localhost:3001/projet/liste/table_project');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  
  useEffect(() => {
    fetchProject();
  }, []);

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

  useEffect(() => {
    fetchAvailableUsers();
   
  }, []);

  const handleGestionProjetClick = () => {
    setShowDivNotifications(false);
    setShowGestionProjet(true); 
    setShowGestionUser(false); 

    
  };

  const handleGestionUserClick = () => {
    setShowDivNotifications(false);
    setShowGestionUser(true); 
    setShowGestionProjet(false); 
  
  };

  const handleBackToDashboardClick = () => {
    setShowDivNotifications(true);
    setShowGestionProjet(false);
    setShowGestionUser(false);
  
    fetchAvailableUsers();
   
    fetchProject();
    fetchUsers();
    fetchTaskData();
    fetchNotifications();
  };
  


  

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications); //
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Tableau de bord</h1>
      <div className="mt-4 text-center">
        <button 
          onClick={() => setShowHelp(true)} // Ouvrir la page d'aide
          className="p-2 bg-blue-500 text-white rounded"
        >
          Aide
        </button>
      </div>
      {showHelp && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white w-full h-full p-6 rounded-lg shadow-lg overflow-y-auto flex flex-col relative" style={{ paddingBottom: '4rem' }}>
      <div className="min-h-screen">
        <Helpage />
      </div>
      <button 
        onClick={() => setShowHelp(false)} // Fermer la page d'aide
        className="absolute top-4 right-4 p-2 text-white bg-red-500 rounded-full"
        aria-label="Fermer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
)}
      {showDivNotifications && (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <button onClick={toggleNotifications} className="bg-blue-500 text-white p-2 rounded transition duration-300 hover:bg-blue-600">
          {showNotifications ? 'Masquer les notifications' : 'Afficher les notifications'}
        </button>
      </div>
      )}

      {showNotifications && (
        <NotificationOverlay notifications={notifications} onClose={toggleNotifications} />
      )}
    
  
      {/* Reste du code pour afficher les projets, utilisateurs, etc. */}
      {!showGestionProjet && !showGestionUser ? (
        <>
          <div className="grid grid-cols-2 gap-6">
            <div
              onClick={handleGestionProjetClick}
              className="bg-blue-500 text-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-blue-600 transition duration-300"
            >
              <h2 className="text-2xl font-bold">Ajouter un projet</h2>
              <p className="mt-2">Cliquez ici pour ajouter un nouveau projet.</p>
            </div>

            <div
              onClick={handleGestionUserClick}
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

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-blue-500">Graphique des utilisateurs</h2>
              {devsChart.length === 0 ? (
                <p>Aucun utilisateur</p>
              ) : (
                <UserPieChart users={devsChart} /> 
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-blue-500">Évolution des tâches</h2>
              <TaskEvolutionChart completedTasks={completedTasks} pendingTasks={pendingTasks} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-500">Évolution des Projets et des Tâches</h2>
            {Projects.length > 0 ? (
              <ProjectEvolutionChart projects={Projects} />
            ) : (
              <p>Aucun projet disponible pour l'affichage du graphique.</p>
            )}
          </div>
        </>
      ) : showGestionProjet ? (
        <>
          <GestionProjet />
          <button
            onClick={handleBackToDashboardClick}
            className="mt-4 bg-gray-300 text-black p-2 rounded"
          >
            Retour au tableau de bord
          </button>
        </>
      ) : showGestionUser ? (
        <>
          <GestionUser />
          <button
            onClick={handleBackToDashboardClick}
            className="mt-4 bg-gray-300 text-black p-2 rounded"
          >
            Retour au tableau de bord
          </button>
        </>
      ) : null}
    </div>
  );
}
