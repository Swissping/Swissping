import React, { useState, useEffect } from 'react';
import { QuizSubmission } from '../types';
import { getAllSubmissions, clearSubmissions } from '../services/storageService';
import { analyzeApplicantMotivation } from '../services/geminiService';
import { isConfigured } from '../services/supabaseService';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSetupHelp, setShowSetupHelp] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    const result = await getAllSubmissions();
    setSubmissions(result.data);
    if (result.error && isConfigured()) {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleClear = async () => {
    if (window.confirm("Alles löschen?")) {
      await clearSubmissions();
      setSubmissions([]);
    }
  };

  const cloudActive = isConfigured();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Status & Error Bar */}
        <div className={`p-4 mb-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between shadow-sm border-l-4 ${error ? 'bg-red-50 border-red-500' : (cloudActive ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-400')}`}>
          <div className="mb-2 md:mb-0">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${error ? 'bg-red-500' : (cloudActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500')}`}></div>
              <span className="font-bold text-sm">
                {error ? 'Verbindungsfehler' : (cloudActive ? 'Cloud Online' : 'Lokaler Modus (Key fehlt)')}
              </span>
            </div>
            {error && <p className="text-xs text-red-600 font-mono mt-1">Fehler: {error}</p>}
            {!cloudActive && !error && <p className="text-xs text-gray-500 mt-1">Bitte den langen Anon-Key in supabaseService.ts eintragen.</p>}
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setShowSetupHelp(!showSetupHelp)} className="text-xs text-blue-600 underline">
              Hilfe zur Einrichtung
            </button>
            <button onClick={refreshData} disabled={loading} className="bg-white px-4 py-2 rounded-lg border text-sm font-bold shadow-sm hover:bg-gray-50 disabled:opacity-50">
              {loading ? 'Lädt...' : 'Daten aktualisieren'}
            </button>
          </div>
        </div>

        {showSetupHelp && (
          <div className="mb-8 p-6 bg-slate-800 text-white rounded-2xl shadow-lg border border-slate-700">
            <h3 className="text-lg font-bold mb-4">Schritt-für-Schritt Einrichtung</h3>
            <ol className="list-decimal list-inside space-y-4 text-sm text-slate-300">
              <li>
                <strong>Tabelle erstellen:</strong> Kopiere diesen Code in den <strong>SQL Editor</strong> von Supabase und drücke <strong>Run</strong>:
                <pre className="bg-slate-900 p-3 rounded mt-2 text-xs font-mono text-blue-400 border border-slate-700 overflow-x-auto">
{`create table submissions (
  id text primary key,
  data jsonb not null,
  created_at timestamptz default now()
);

alter table submissions enable row level security;
create policy "Allow All" on submissions for all using (true) with check (true);`}
                </pre>
              </li>
              <li>
                <strong>Anon Key finden:</strong> Gehe zu <em>Settings -> API</em>. Der Key ist ein sehr langer Text (nicht die Projekt-ID!).
              </li>
              <li>
                <strong>Browser-Refresh:</strong> Lade diese Seite neu, sobald du den Key im Code eingetragen hast.
              </li>
            </ol>
          </div>
        )}

        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Ergebnisse</h1>
            <p className="text-gray-500">Eingänge von allen Geräten</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleClear} className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-200">
              Datenbank leeren
            </button>
            <button onClick={onLogout} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-300">
              Abmelden
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Zeit</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-red-500 uppercase bg-red-50/50">Passwort</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Punkte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-gray-400 italic">
                    Keine Daten gefunden. Versuche "Daten aktualisieren".
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sub.timestamp).toLocaleString('de-DE')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {sub.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-red-600 bg-red-50/30">
                      {sub.user.password}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md font-bold">
                        {sub.score} / {sub.maxScore}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;