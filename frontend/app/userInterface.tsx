import { useEffect, useState } from 'react';
import Helpage from './HelpPage'; 
import { io } from 'socket.io-client';
interface Task {
  id: number;
  task_name: string;
  description: string;
  deadline: string;
}

interface User {
  user_id: number;
  name: string;
  role: string;
  password: string;
}

interface UserInterfaceProps {
  userId: string;
}

export default function UserInterface({ userId }: UserInterfaceProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [infos, setInfos] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [message, setMessage] = useState('');
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
 
  const socket = io('http://localhost:3001');
  
  useEffect(() => {
    socket.on('update', (data) => {
      console.log('Mise à jour reçue:', data);
      if (data.entity === 'task' ) {

      
     
      
          fetchTasks();
      
       
      }
      else{
        fetchUser();
      }

    });

    return () => {
      socket.off('update');
    };
  }, []);
  
  async function fetchTasks() {
    try {
      const response = await fetch(`http://localhost:3001/tasks/assigned?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }
  useEffect(() => {
   
    
    fetchTasks();
  }, [userId]);
  useEffect(() => {
    if (showHelp) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto'; 
    }
  
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showHelp]);

  async function fetchUser() {
    try {
      const response = await fetch(`http://localhost:3001/users/assigned?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInfos(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
  useEffect(() => {
  
    
    fetchUser();
  }, [userId]);

  async function handleSendEmail(event: React.FormEvent) {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/users/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          subject,
          message,
        }),
      });
      if (response.ok) {
        setEmailStatus('Email envoyé avec succès');
      } else {
        setEmailStatus('Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      setEmailStatus('Erreur lors de l\'envoi de l\'email');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-8">
      <h1 className="text-2xl font-bold text-center text-blue-800">Bienvenue sur l'Interface Utilisateur</h1>
   
      <div className="mt-4 text-center">
        <button 
          onClick={() => setShowHelp(true)} // Ouvrir la page d'aide
          className="p-2 bg-blue-500 text-white rounded"
        >
          Aide
        </button>
      </div>

      {/* Affichage de la page d'aide */}
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

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Vos informations :</h2>
        <ul className="space-y-4">
          {infos.map((user) => (
            <li key={user.user_id} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
              <p className="text-gray-600">Rôle: {user.role}</p>
              <p className="text-gray-500">Mot de passe: {user.password}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Vos tâches assignées :</h2>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-800">{task.task_name}</h3>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-gray-500">Date limite: {new Date(task.deadline).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Envoyer un Email :</h2>
        <form onSubmit={handleSendEmail} className="space-y-4">
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Sujet"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Envoyer</button>
        </form>
        {emailStatus && <p className="mt-4 text-center text-blue-600">{emailStatus}</p>}
      </section>
    </div>
  );
}
