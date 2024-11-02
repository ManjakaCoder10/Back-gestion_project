"use client";
import React, { useState, useEffect } from 'react';

export default function GestionUser() {
  const [formData, setFormData] = useState({
    id:'',
    nom: '',
    role: '',
    email: '',
    password: '', 
  });
  const [message, setMessage] = useState('');
  const [User, setUser] = useState([]);


  const fetchAvailableUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/available/user-all');
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs disponibles:', error);
    }
  };
  useEffect(() => {
    fetchAvailableUsers();
  }, []);


  const generatePassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    const password = generatePassword();
    const dataToSend = { ...formData, password };
    const nomProjet=   formData.nom;

    try {
      const response = await fetch('http://localhost:3001/users/create-or-update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify(dataToSend), 
      });

      const result = await response.json();
      if (response.ok) {if(formData.id===null){
        await fetch('http://localhost:3001/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: `Projet ${nomProjet} créé avec succès.` }),
        });}
        
         else{  await fetch('http://localhost:3001/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: `mofication du ${nomProjet}  avec succès.` }),
        });}
        setMessage('Utilisateur ajouté avec succès avec le mot de passe généré !');
        setFormData({ nom: '', role: '', email: '', password: '' ,id:''}); 
        fetchAvailableUsers(); 
      } else {
        setMessage(`Erreur: ${result.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données:', error);
      setMessage('Erreur lors de l\'envoi des données');
    }
  };

  // Fonction pour supprimer un utilisateur
  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {await fetch('http://localhost:3001/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: `User  avec id ${userId} supprimé avec succès.` }),
      });
        setMessage('Utilisateur supprimé avec succès');
        fetchAvailableUsers(); 
      } else {
        setMessage('Erreur lors de la suppression de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      setMessage('Erreur lors de la suppression de l\'utilisateur');
    }
  };

 
  const handleEdit = (user) => {
    setFormData({
      nom: user.name,
      role: user.role,
      email: user.email,
      password: user.password, 
      id: user.user_id
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-4xl font-bold mb-8 text-center text-blue-600 animate-fadeInDown">Ajouter un utilisateur</h1>
  
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-out">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Nom :</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-800 focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
          required
        />
      </div>
  
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Rôle :</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-800 focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
          required
        />
      </div>
  
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Email :</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-800 focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
          required
        />
      </div>
  
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 hover:shadow-lg transition duration-300 ease-in-out"
      >
        Ajouter l'utilisateur
      </button>
    </form>
  
    {message && <p className="mt-4 text-center text-green-500 animate-fadeIn">{message}</p>}
  
    <div className="bg-white p-6 rounded-lg shadow-md mt-6 animate-fadeInUp">
      <h2 className="text-2xl font-bold mb-4 text-blue-500">User</h2>
  
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">Nom</th>
            <th className="border px-4 py-2 text-left">Rôle</th>
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {User.length === 0 ? (
            <tr>
              <td className="border px-4 py-2 text-center" colSpan="4">
                Aucun utilisateur disponible ce mois-ci
              </td>
            </tr>
          ) : (
            User.map((user) => (
              <tr key={user.user_id} className="border-t hover:bg-gray-100 transition duration-150 ease-in-out">
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-yellow-500 text-white py-1 px-2 rounded mr-2 hover:bg-yellow-600 transition duration-300 ease-in-out"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(user.user_id)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-300 ease-in-out"
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
  </div>
  
  );
}
