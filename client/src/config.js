// Конфигурация API
const isProduction = process.env.NODE_ENV === 'production';

// Замените на ваш реальный домен сервера
export const API_BASE = isProduction 
  ? 'https://qamemogramm-h31w4qcza-alexandrs-projects-c82a2e65.vercel.app' 
  : 'http://localhost:5000';