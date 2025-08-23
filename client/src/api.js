import { API_ENDPOINTS } from './config';

// API методы
export const getMemes = () => fetch(API_ENDPOINTS.MEMES).then(res => res.json());

export const uploadMeme = (formData) => {
  return fetch(API_ENDPOINTS.UPLOAD, {
    method: 'POST',
    body: formData,
  });
};

export const deleteAllMemes = (password) => {
  return fetch(API_ENDPOINTS.DELETE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  }).then(res => res.json());
};

export const getMemeDescription = (filename) => {
  return fetch(API_ENDPOINTS.DESCRIPTION(filename)).then(res => res.json());
};