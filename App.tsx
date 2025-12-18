import React, { useState } from 'react';
import Login from './components/Login';
import Quiz, { QUESTIONS } from './components/Quiz';
import AdminDashboard from './components/AdminDashboard';
import { UserCredentials, ViewState, QuizSubmission } from './types';
import { saveSubmission } from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);
  const [currentUser, setCurrentUser] = useState<UserCredentials | null>(null);

  const handleLogin = (creds: UserCredentials) => {
    if (creds.email === 'admin' && creds.password === 'admin') {
      setView(ViewState.ADMIN);
      return;
    }
    setCurrentUser(creds);
    setView(ViewState.QUIZ);
  };

  const handleQuizSubmit = async (answers: Record<number, string>) => {
    if (!currentUser) return;

    const maxScore = QUESTIONS.filter(q => q.correctAnswer).length;
    const score = QUESTIONS.reduce((acc, q) => 
      (q.correctAnswer && q.correctAnswer === answers[q.id]) ? acc + 1 : acc, 0
    );

    const submission: QuizSubmission = {
      id: Date.now().toString(),
      user: currentUser,
      answers,
      score,
      maxScore,
      timestamp: new Date().toISOString()
    };

    await saveSubmission(submission);
    setView(ViewState.SUCCESS);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView(ViewState.LOGIN);
  };

  return (
    <div className="antialiased text-gray-900">
      {view === ViewState.LOGIN && <Login onLogin={handleLogin} />}
      {view === ViewState.QUIZ && <Quiz onSubmit={handleQuizSubmit} />}
      {view === ViewState.SUCCESS && (
        <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Vielen Dank!</h2>
            <p className="text-gray-600 mb-6">Ihre Antworten wurden erfolgreich gespeichert.</p>
            <button onClick={handleLogout} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
              Zum Startbildschirm
            </button>
          </div>
        </div>
      )}
      {view === ViewState.ADMIN && <AdminDashboard onLogout={handleLogout} />}
    </div>
  );
};

export default App;