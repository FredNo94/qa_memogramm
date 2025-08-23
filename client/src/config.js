// Конфигурация API
const isProduction = process.env.NODE_ENV === 'production';

// Замените на ваш реальный домен сервера
export const API_BASE = isProduction 
  ? 'https://qamemogramm.vercel.app/' 
  : 'http://localhost:5000';

// Экспортируем объект с endpoint'ами
export const API_ENDPOINTS = {
  MEMES: `${API_BASE}/api/memes`,
  UPLOAD: `${API_BASE}/api/upload`,
  DELETE: `${API_BASE}/api/memes`,
  DESCRIPTION: (filename) => `${API_BASE}/api/meme/${filename}/description`,
};