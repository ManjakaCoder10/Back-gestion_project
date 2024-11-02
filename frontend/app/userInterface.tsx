import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './interface.css';

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
      if (data.entity === 'task') {
        fetchTasks();
      } else {
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
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  async function fetchUser() {
    try {
      const response = await fetch(`http://localhost:3001/users/assigned?userId=${userId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setInfos(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  useEffect(() => {
    fetchTasks();
    fetchUser();
  }, [userId]);

  async function handleSendEmail(event: React.FormEvent) {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/users/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, message }),
      });
      setEmailStatus(response.ok ? 'Email envoyé avec succès' : 'Erreur lors de l\'envoi de l\'email');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      setEmailStatus('Erreur lors de l\'envoi de l\'email');
    }
  }

  function handleLogout() {
 
    window.location.reload(); 
    console.log("Déconnexion");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-8">
      <div className="container mx-auto p-6 bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-lg max-w-3xl">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-900">Bienvenue sur l'Interface Utilisateur</h1>
        
          <img src="/se-deconnecter (1).png" alt="Notifications" className="h-9 w-9"     onClick={handleLogout} />
      
        </header>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Vos informations :</h2>
          <ul className="space-y-4">
            {infos.map((user) => (
              <li key={user.user_id} className="p-4 bg-white rounded-lg shadow-md transform transition-transform hover:scale-105">
                <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                <p className="text-gray-600">Rôle : {user.role}</p>
                <p className="text-gray-500">Mot de passe : {user.password}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Vos tâches assignées :</h2>
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task.id} className="p-4 bg-white rounded-lg shadow-md transform transition-transform hover:scale-105">
                <h3 className="text-lg font-semibold text-gray-800">{task.task_name}</h3>
                <p className="text-gray-600">{task.description}</p>
                <p className="text-gray-500">Date limite : {new Date(task.deadline).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 p-6 bg-white rounded-lg shadow-lg animate-slideIn">
          <h2 className="text-lg font-bold text-blue-700 mb-4 text-center">Envoyer un Email :</h2>
          <form onSubmit={handleSendEmail} className="space-y-5">
            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Sujet"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            ></textarea>
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
            >
              Envoyer
            </button>
          </form>
          {emailStatus && <p className="mt-4 text-center text-blue-600">{emailStatus}</p>}
        </section>
      </div>
    </div>
  );
}
