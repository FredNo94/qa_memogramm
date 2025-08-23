// Конфигурация API endpoints
export const API_BASE = 
  process.env.NODE_ENV === 'production' 
    ? 'https://qamemogramm-g7ffotqhe-alexandrs-projects-c82a2e65.vercel.app' 
    : 'http://localhost:5000';

export const API_ENDPOINTS = {
  MEMES: `${API_BASE}/api/memes`,
  UPLOAD: `${API_BASE}/api/upload`,
  DELETE: `${API_BASE}/api/memes`,
  DESCRIPTION: (filename) => `${API_BASE}/api/meme/${filename}/description`,
};