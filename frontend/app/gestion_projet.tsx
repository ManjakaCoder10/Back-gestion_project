import React, { useEffect, useState } from 'react';

export default function GestionProjet() {
  const [nomProjet, setNomProjet] = useState('');
  const [id, setProjectId] = useState(null);
  const [projects, setProjects] = useState([]); // Correction de la variable de projet
  const [description, setDescription] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [message, setMessage] = useState('');
  const [devs, setDevs] = useState([]);
  const [tasks, setTasks] = useState([{ nom: '', deadline: '', id: '' }]);

  useEffect(() => {
    fetchAvailableUsers();
    fetchProjects(); // Renommé pour être plus clair
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
        fetchProjects(); // Renommé pour être cohérent
      } else {
        setMessage('Erreur lors de la suppression du projet');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      setMessage('Erreur lors de la suppression du projet');
    }
  };

  const fetchProjects = async () => { // Correction du nom de la fonction
    try {
      const response = await fetch('http://localhost:3001/projet/liste/table_project');
      const data = await response.json();
      setProjects(data); // Correction de la variable de projet
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
      taches: tasks.filter(task => !task.deleted), // Filtrer les tâches supprimées
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
        fetchProjects(); // Renommé pour être cohérent
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
    setTasks([{ nom: '', deadline: '', id: '' }]);
    setProjectId(null);
  };

  const addTask = () => {
    setTasks([...tasks, { nom: '', deadline: '', id: '' }]);
  };
  
  const removeTask = (index) => {
    setTasks(prevTasks => prevTasks.map((task, i) =>
      i === index ? { ...task, deleted: true } : task
    ));
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
      nom: task.task_name,
      deadline: formatDateTimeLocal(task.deadline),
      id: task.userUserId || '',
    }));
    setTasks(formattedTasks);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Ajouter ou Modifier un projet</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        
        {/* Formulaire */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Nom du projet :</label>
          <input
            type="text"
            value={nomProjet}
            onChange={(e) => setNomProjet(e.target.value)}
            className="w-full p-2 border rounded text-gray-800"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description :</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded text-gray-800"
            required
          ></textarea>
        </div>

        {/* Date de début */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Date de début :</label>
          <input
            type="datetime-local"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            className="w-full p-2 border rounded text-gray-800"
            required
          />
        </div>

        {/* Date de fin */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Date de fin :</label>
          <input
            type="datetime-local"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            className="w-full p-2 border rounded text-gray-800"
            required
          />
        </div>

        {/* Tâches Dynamiques */}
        {tasks.filter(task => !task.deleted).map((task, index) => (
          <div key={index} className="mb-4 border p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Tâche {index + 1}</h3>
            <label className="block text-gray-700 text-sm font-bold mb-2">Nom de la tâche :</label>
            <input
              type="text"
              value={task.nom}
              onChange={(e) => handleTaskChange(index, 'nom', e.target.value)}
              className="w-full p-2 border rounded text-gray-800"
              required
            />
            <label className="block text-gray-700 text-sm font-bold mb-2">Date limite :</label>
            <input
              type="datetime-local"
              value={task.deadline}
              onChange={(e) => handleTaskChange(index, 'deadline', e.target.value)}
              className="w-full p-2 border rounded text-gray-800"
              required
            />
            <label className="block text-gray-700 text-sm font-bold mb-2">Responsable :</label>
            <select
              value={task.id}
              onChange={(e) => handleTaskChange(index, 'id', e.target.value)}
              className="w-full p-2 border rounded text-gray-800"
              required
            >
              <option value="">Sélectionner un responsable</option>
              {devs.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => removeTask(index)} className="mt-2 text-red-500">
              Supprimer cette tâche
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        >
          Ajouter une tâche
        </button>

        {/* Message */}
        {message && <div className="mb-4 text-green-500">{message}</div>}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {id ? 'Modifier le projet' : 'Ajouter le projet'}
        </button>
      </form>

      {/* Liste des Projets */}
      <h2 className="text-3xl font-bold mt-8 mb-4">Liste des Projets</h2>
      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project.project_id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{project.project_name}</h3>
            <p>{project.description}</p>
            <p><strong>Date de début :</strong> {new Date(project.start_date).toLocaleString()}</p>
            <p><strong>Date de fin :</strong> {new Date(project.end_date).toLocaleString()}</p>
            <button onClick={() => handleEdit(project)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 mr-2">
              Modifier
            </button>
            <button onClick={() => handleDelete(project.project_id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
