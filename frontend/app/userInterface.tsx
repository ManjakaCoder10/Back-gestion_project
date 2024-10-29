import { useEffect, useState } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
}

interface UserInterfaceProps {
  userId: string;
}

export default function UserInterface({ userId }: UserInterfaceProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(`http://localhost:3000/tasks/assigned?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
    
    fetchTasks();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1>Bienvenue sur l'Interface Utilisateur</h1>
      <p>Votre ID utilisateur : {userId}</p>
      <h2 className="mt-6 mb-4 font-bold">Vos tâches assignées :</h2>
      <ul className="list-disc pl-5 space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="p-2 bg-white rounded shadow">
            <h3 className="font-semibold">{task.title}</h3>
            <p>{task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
