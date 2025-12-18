import React, { useState } from 'react';
import { Question } from '../types';

interface QuizProps {
  onSubmit: (answers: Record<number, string>) => void;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: "Wann wurde die Freie Schule Zürich gegründet?",
    options: [
      "1924",
      "1874",
      "1903",
      "1888"
    ],
    correctAnswer: "1874"
  },
  {
    id: 2,
    type: 'multiple-choice',
    question: "Wie heisst der Abschluss, den Schülerinnen und Schüler am Gymnasium der Freien Schule Zürich machen können?",
    options: [
      "Berufsmatur",
      "Fachmatur",
      "Hausmatur",
      "International Baccalaureate"
    ],
    correctAnswer: "Hausmatur"
  },
  {
    id: 3,
    type: 'multiple-choice',
    question: "Welchen Schwerpunkt kann man im Kurzgymnasium der Freien Schule Zürich in der 2.-4. Klasse wählen?",
    options: [
      "Französisch oder Biologie",
      "Spanisch oder Wirtschaft & Recht",
      "Mathematik oder Kunst",
      "Geschichte oder Musik"
    ],
    correctAnswer: "Spanisch oder Wirtschaft & Recht"
  },
  {
    id: 4,
    type: 'multiple-choice',
    question: "Wie würde man die Freie Schule Zürich am besten beschreiben?",
    options: [
      "Eine staatliche öffentliche Schule",
      "Eine Privatschule in freier Trägerschaft",
      "Eine Sportschule für Leistungssport",
      "Eine rein digitale Online-Schule"
    ],
    correctAnswer: "Eine Privatschule in freier Trägerschaft"
  },
  {
    id: 5,
    type: 'multiple-choice',
    question: "Wie findest du die Schule? (1 = Nicht gut, 10 = Super)",
    options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    correctAnswer: undefined // No correct answer for rating
  }
];

const Quiz: React.FC<QuizProps> = ({ onSubmit }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleOptionSelect = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const isComplete = QUESTIONS.every(q => !!answers[q.id]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">FSZ Eignungstest</h2>
          <p className="text-blue-100 text-sm">Bitte beantworten Sie alle Fragen wahrheitsgemäß.</p>
        </div>

        <div className="p-6 space-y-8">
          {QUESTIONS.map((q, index) => (
            <div key={q.id} className="border-b border-gray-100 pb-6 last:border-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {index + 1}. {q.question}
              </h3>
              
              {q.type === 'multiple-choice' && q.options ? (
                <div className={`${q.options.length > 4 ? 'grid grid-cols-5 gap-2' : 'space-y-3'}`}>
                  {q.options.map(option => (
                    <label 
                      key={option} 
                      className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                        answers[q.id] === option 
                          ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 font-bold text-blue-700' 
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option}
                        checked={answers[q.id] === option}
                        onChange={() => handleOptionSelect(q.id, option)}
                        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ${q.options && q.options.length > 4 ? 'sr-only' : 'mr-3'}`}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ihre Antwort hier..."
                  value={answers[q.id] || ''}
                  onChange={(e) => handleOptionSelect(q.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={() => onSubmit(answers)}
            disabled={!isComplete}
            className={`px-6 py-3 rounded-lg font-bold text-white shadow transition-all ${
              isComplete 
                ? 'bg-green-600 hover:bg-green-700 transform hover:scale-105' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Abgeben
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
export { QUESTIONS };