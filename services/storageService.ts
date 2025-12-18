import { QuizSubmission } from '../types';
import { uploadSubmission, fetchAllSubmissions, deleteRemoteSubmissions, isConfigured } from './supabaseService';

const STORAGE_KEY = 'fsz_quiz_submissions';

export const saveSubmission = async (submission: QuizSubmission): Promise<void> => {
  const existing = getSubmissionsLocally();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, submission]));
  
  if (isConfigured()) {
    await uploadSubmission(submission);
  }
};

export const getSubmissionsLocally = (): QuizSubmission[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getAllSubmissions = async (): Promise<{data: QuizSubmission[], error: string | null}> => {
  if (isConfigured()) {
    const { data, error } = await fetchAllSubmissions();
    if (error) return { data: getSubmissionsLocally(), error };
    
    // Merge local for safety
    const localData = getSubmissionsLocally();
    const combined = [...data];
    localData.forEach(l => {
      if (!combined.find(c => c.id === l.id)) combined.push(l);
    });
    return { data: combined, error: null };
  }
  return { data: getSubmissionsLocally(), error: "Cloud nicht konfiguriert" };
};

export const clearSubmissions = async (): Promise<void> => {
  localStorage.removeItem(STORAGE_KEY);
  if (isConfigured()) await deleteRemoteSubmissions();
};