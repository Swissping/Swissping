import React, { useState } from 'react';
import { UserCredentials } from '../types';

interface LoginProps {
  onLogin: (creds: UserCredentials) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Bitte geben Sie Email und Passwort an.');
      return;
    }
    onLogin({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">FSZ Quiz Portal</h1>
          <p className="text-gray-500 mt-2">Bitte identifizieren Sie sich um fortzufahren.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Adresse</label>
            <input
              type="text" // Using text to allow simple usernames if desired, normally 'email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="ihre.email@beispiel.de"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Ihr Passwort"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md transform hover:scale-[1.02]"
          >
            Starten
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-6 text-center">
          * Ihre Daten werden für die Auswertung gespeichert.
        </p>
      </div>
    </div>
  );
};

export default Login;