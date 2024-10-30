import { useEffect, useState } from 'react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Aide et Informations</h1>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">À propos de notre application</h2>
        <p className="text-gray-600 mb-4">
          Cette application vous permet de transférer des fichiers facilement entre appareils via WiFi. 
          Utilisez cette page pour trouver des informations utiles et des conseils sur l'utilisation de l'application.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Comment utiliser l'application</h2>
        <ul className="list-disc list-inside mb-4">
          <li className="text-gray-600">1. Connectez vos appareils au même réseau WiFi.</li>
          <li className="text-gray-600">2. Sélectionnez le fichier que vous souhaitez envoyer.</li>
          <li className="text-gray-600">3. Choisissez l'appareil destinataire dans la liste.</li>
          <li className="text-gray-600">4. Cliquez sur le bouton "Envoyer" pour commencer le transfert.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">FAQ</h2>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-600">Q: Pourquoi ne puis-je pas voir d'autres appareils ?</h3>
          <p className="text-gray-600">
            R: Assurez-vous que tous les appareils sont connectés au même réseau WiFi et que l'application est ouverte sur chaque appareil.
          </p>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-600">Q: Quels types de fichiers puis-je envoyer ?</h3>
          <p className="text-gray-600">
            R: Vous pouvez envoyer des fichiers d'images, de documents PDF, et plus encore. Assurez-vous que le format est pris en charge par l'application.
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Nous contacter</h2>
        <p className="text-gray-600 mb-4">
          Si vous avez d'autres questions, n'hésitez pas à nous contacter à l'adresse suivante : 
          <a href="mailto:support@example.com" className="text-blue-500 hover:underline"> support@example.com</a>.
        </p>
      </div>
    </div>
  );
}
