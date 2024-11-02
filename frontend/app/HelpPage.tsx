import { useEffect, useState } from 'react';

export default function HelpPage() {
  return (
<div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-10">
  <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-10">
    Assistance et Informations
  </h1>
  <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl p-8">
    
    <h2 className="text-3xl font-semibold text-gray-700 mb-6">
      À propos de <span className="text-blue-600">gestion_projet</span>
    </h2>
    <p className="text-gray-600 mb-6 leading-relaxed">
      L'application <span className="font-semibold text-blue-600">gestion_projet</span> permet aux utilisateurs et administrateurs de gérer et partager des fichiers, documents et données liés aux projets en toute simplicité. 
      Trouvez ici des informations et astuces pour optimiser son utilisation.
    </p>
    
    <h2 className="text-3xl font-semibold text-gray-700 mb-6">Guide d'utilisation</h2>
    <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-600">
      <li>Connectez vos appareils au même réseau sécurisé.</li>
      <li>En tant qu'utilisateur, naviguez vers la section projet pour accéder aux documents partagés.</li>
      <li>En tant qu'administrateur, accédez aux paramètres pour gérer les utilisateurs et permissions de projet.</li>
      <li>Sélectionnez le fichier que vous souhaitez transférer ou mettre à jour.</li>
      <li>Suivez les étapes de validation pour compléter l'action.</li>
    </ol>
    
    <h2 className="text-3xl font-semibold text-gray-700 mb-6">FAQ</h2>
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-700">Q : Comment gérer les autorisations de fichier ?</h3>
        <p className="text-gray-600">
          R : Les administrateurs peuvent gérer les autorisations dans la section paramètres, en attribuant les rôles nécessaires aux utilisateurs de projet.
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-gray-700">Q : Quels formats de fichier sont pris en charge ?</h3>
        <p className="text-gray-600">
          R : Vous pouvez gérer et partager divers formats de fichiers tels que PDF, images, et documents texte. Vérifiez la compatibilité de chaque type de fichier dans les paramètres.
        </p>
      </div>
    </div>

    <h2 className="text-3xl font-semibold text-gray-700 mb-6">Contactez-nous</h2>
    <p className="text-gray-600">
      Si vous avez d'autres questions, n'hésitez pas à nous écrire à 
      <a href="mailto:support@gestion_projet.com" className="text-blue-500 hover:underline ml-1">support@gestion_projet.com</a>.
    </p>
  </div>
</div>

  );
}
