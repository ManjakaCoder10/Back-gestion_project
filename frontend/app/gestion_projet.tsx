import React, { useEffect, useState } from 'react';

export default function GestionProjet() {
  const [nomProjet, setNomProjet] = useState('');
  const [id, setProjectId] = useState(null);
  const [Project, setProject] = useState([]);
  const [description, setDescription] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [message, setMessage] = useState('');
  const [devs, setDevs] = useState([]);
  const [tasks, setTasks] = useState([{ nom: '', deadline: '', id: '' }]);

  useEffect(() => {
    fetchAvailableUsers();
    fetchProject();
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
        fetchProject();
      } else {
        setMessage('Erreur lors de la suppression du projet');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      setMessage('Erreur lors de la suppression du projet');
    }
  };

  const fetchProject = async () => {
    try {
      const response = await fetch('http://localhost:3001/projet/liste/table_project');
      const data = await response.json();
      setProject(data);
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
      taches: tasks,
    };

    try {
      const response = await fetch(`http://localhost:3001/projet${id ? `/${id}` : ''}`, {
        method: id ? 'PUT' : 'POST', // Utiliser PUT pour la mise à jour, POST pour un nouveau projet
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projetData),
      });

      if (response.ok) {
        setMessage(id ? 'Projet mis à jour avec succès' : 'Projet et tâches ajoutés avec succès');
        resetForm();
        fetchProject();
      } else {
        setMessage("Erreur lors de l'ajout ou de la mise à jour du projet et des tâches");
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données', error);
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
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = tasks.map((task, i) => 
      i === index ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks);
  };

  const handleEdit = (project) => {
    setProjectId(project.project_id);
    setNomProjet(project.project_name);
    setDescription(project.description);
    setDateDebut(project.start_date);
    setDateFin(project.end_date);
    setTasks(project.tasks);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Ajouter ou Modifier un projet</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        
        {/* Formulaire */}
        {/*... (Même formulaire que dans votre code initial) */}
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
            type="date"
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
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            className="w-full p-2 border rounded text-gray-800"
            required
          />
        </div>

        {/* Tâches Dynamiques */}
        {tasks.map((task, index) => (
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
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
        >
          Ajouter une tâche
        </button>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md mt-4">
          Enregistrer le projet
        </button>

        {message && <p className="mt-4 text-center text-green-500">{message}</p>}

        {/* Liste des projets */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-500">Projets</h2>
          <table className="min-w-full bg-white border-collapse">
          <thead>
      <tr>
        <th className="border px-4 py-2 text-left">Nom du projet</th>
        <th className="border px-4 py-2 text-left">Description</th>
        <th className="border px-4 py-2 text-left">Date de début</th>
        <th className="border px-4 py-2 text-left">Date de fin</th>
        <th className="border px-4 py-2 text-left">Tâches</th>
        <th className="border px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {Project.length === 0 ? (
        <tr>
          <td className="border px-4 py-2 text-center" colSpan={6}>
            Aucun projet disponible ce mois-ci
          </td>
        </tr>
      ) : (
        Project.map((project) => (
          <tr key={project.project_id} className="border-t">
            <td className="border px-4 py-2">{project.project_name}</td>
            <td className="border px-4 py-2">{project.description}</td>
            <td className="border px-4 py-2">{project.start_date}</td>
            <td className="border px-4 py-2">{project.end_date}</td>
            <td className="border px-4 py-2">
              <ul>
                {project.tasks.map((task) => (
                  <li key={task.task_id}>
                    {task.task_name} - Assigné à : {task.user ? task.user.name : 'Non assigné'}
                  </li>
                ))}
              </ul>
            </td>
            <td className="border px-4 py-2 text-center">
              <button
            
                className="bg-yellow-500 text-white py-1 px-2 rounded mr-2 hover:bg-yellow-600"
                onClick={() => handleEdit(project)}
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(project.project_id)}
                className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
              >
                Supprimer
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
          </table>
        </div>
      </form>
    </div>
  );
}
