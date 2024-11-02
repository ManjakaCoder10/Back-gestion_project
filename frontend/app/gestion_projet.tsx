import React, { useEffect, useState } from 'react';

import './porject.css';
export default function GestionProjet() {
  const [nomProjet, setNomProjet] = useState('');
  const [id, setProjectId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [description, setDescription] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [message, setMessage] = useState('');
  const [devs, setDevs] = useState([]);
  const [tasks, setTasks] = useState([{ taskID: '', nom: '', deadline: '', id: '' }]);

  useEffect(() => {
    fetchAvailableUsers();
    fetchProjects();
  }, []);

  const fetchAvailableUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/available/project');
      const data = await response.json();
      setDevs(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs disponibles:', error);
    }
  };

  const handleDelete = async (project_id) => {
    try {
      const response = await fetch(`http://localhost:3001/projet/${project_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetch('http://localhost:3001/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: `Projet avec id ${project_id} supprimé avec succès.` }),
        });
        setMessage('Projet supprimé avec succès');
        fetchProjects();
      } else {
        setMessage('Erreur lors de la suppression du projet');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      setMessage('Erreur lors de la suppression du projet');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3001/projet/liste/table_project');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const projetData = {
      id,
      nomProjet,
      description,
      dateDebut,
      dateFin,
      taches: tasks.filter(task => !task.deleted),
    };
  
    try {
      const response = await fetch(`http://localhost:3001/projet${id ? `/${id}` : ''}`, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projetData),
      });
  
      if (response.ok) {
        setMessage(id ? 'Projet mis à jour avec succès' : 'Projet et tâches ajoutés avec succès');
        resetForm();
        fetchProjects();
      } else {
        setMessage("Erreur lors de l'ajout ou de la mise à jour du projet et des tâches");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données", error);
      setMessage("Erreur lors de l'envoi des données");
    }
  };
  
  const resetForm = () => {
    setNomProjet('');
    setDescription('');
    setDateDebut('');
    setDateFin('');
    setTasks([{ taskID: '', nom: '', deadline: '', id: '' }]);
    setProjectId(null);
  };

  const addTask = () => {
    setTasks([...tasks, { taskID: '', nom: '', deadline: '', id: '' }]);
  };
  
  const removeTask = (index) => {
    setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
  };

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = tasks.map((task, i) => 
      i === index ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks);
  };

  const handleEdit = (project) => {
    const formatDateTimeLocal = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16); 
    };
  
    setProjectId(project.project_id);
    setNomProjet(project.project_name);
    setDescription(project.description);
    setDateDebut(formatDateTimeLocal(project.start_date));
    setDateFin(formatDateTimeLocal(project.end_date));
    
    const formattedTasks = project.tasks.map((task) => ({
      taskID: task.task_id || '',
      nom: task.task_name,
      deadline: formatDateTimeLocal(task.deadline),
      id: task.userUserId,
    }));
    setTasks(formattedTasks);
  };
  
  return (
<div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-8">
  <h1 className="text-4xl font-bold mb-8 text-center text-blue-700 animate-fade-in">
    Ajouter ou Modifier un projet
  </h1>
  <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg transition-all hover:shadow-xl animate-fade-in">
    
    {/* Formulaire */}
    <div className="mb-6">
      <label className="block text-gray-800 text-lg font-semibold mb-2">Nom du projet :</label>
      <input
        type="text"
        value={nomProjet}
        onChange={(e) => setNomProjet(e.target.value)}
        className="w-full p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>

    {/* Description */}
    <div className="mb-6">
      <label className="block text-gray-800 text-lg font-semibold mb-2">Description :</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
        required
      ></textarea>
    </div>

    {/* Date de début */}
    <div className="mb-6">
      <label className="block text-gray-800 text-lg font-semibold mb-2">Date de début :</label>
      <input
        type="datetime-local"
        value={dateDebut}
        onChange={(e) => setDateDebut(e.target.value)}
        className="w-full p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>

    {/* Date de fin */}
    <div className="mb-6">
      <label className="block text-gray-800 text-lg font-semibold mb-2">Date de fin :</label>
      <input
        type="datetime-local"
        value={dateFin}
        onChange={(e) => setDateFin(e.target.value)}
        className="w-full p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>

    {/* Tâches Dynamiques */}
    {tasks.map((task, index) => (
      <div key={index} className="mb-6 border p-6 rounded-lg bg-gray-50 shadow-sm animate-fade-in">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Tâche {index + 1}</h3>
        <label className="block text-gray-800 text-lg font-semibold mb-2">Nom de la tâche :</label>
        <input
          type="text"
          value={task.nom}
          onChange={(e) => handleTaskChange(index, 'nom', e.target.value)}
          className="w-full p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
          required
        />
        <label className="block text-gray-800 text-lg font-semibold mt-4 mb-2">Date limite :</label>
        <input
          type="datetime-local"
          value={task.deadline}
          onChange={(e) => handleTaskChange(index, 'deadline', e.target.value)}
          className="w-full p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
          required
        />
        <label className="block text-gray-800 text-lg font-semibold mt-4 mb-2">Responsable :</label>
        <select
          value={task.id}
          onChange={(e) => handleTaskChange(index, 'id', e.target.value)}
          className="w-full p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Sélectionner un responsable</option>
          {devs.map((user) => (
            <option key={user.user_id} value={user.user_id}>
              {user.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => removeTask(index)} className="mt-4 text-red-600 hover:text-red-800 transition-colors">
          Supprimer cette tâche
        </button>
      </div>
    ))}

    <button
      type="button"
      onClick={addTask}
      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all mb-6 animate-bounce-slow"
    >
      Ajouter une tâche
    </button>

    {/* Bouton de soumission */}
    <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all animate-pulse">
      {id ? 'Mettre à jour le projet' : 'Ajouter le projet'}
    </button>
  </form>

  {/* Affichage des projets */}
  <div className="mt-10">
    <h2 className="text-3xl font-semibold mb-6 text-gray-700 animate-fade-in">Liste des projets</h2>
    <ul className="bg-white p-6 rounded-lg shadow-md space-y-4">
      {projects.map((project) => (
        <li key={project.project_id} className="border-b last:border-none py-4 flex justify-between items-center animate-fade-in">
          <span className="text-lg font-medium">{project.project_name}</span>
          <div>
            <button
              onClick={() => handleEdit(project)}
              className="text-blue-500 hover:text-blue-700 mr-4 transition-all"
            >
              Modifier
            </button>
            <button
              onClick={() => handleDelete(project.project_id)}
              className="text-red-500 hover:text-red-700 transition-all"
            >
              Supprimer
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>

  {/* Message de retour */}
  {message && (
    <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded animate-fade-in">
      {message}
    </div>
  )}
</div>

  );
}
