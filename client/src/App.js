import React, { useState, useEffect } from 'react';
import Game1 from './games/Game1';
import Game2 from './games/Game2';
import AdminPanel from './components/AdminPanel';
import { getMemes } from './api';
import './styles/App.css';

function App() {
  const [currentView, setCurrentView] = useState('menu');
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMemes();
      if (data.success) {
        setMemes(data.memes);
      } else {
        setError('Failed to load memes');
      }
    } catch (error) {
      console.error('Error fetching memes:', error);
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const views = {
    menu: (
      <div className="menu">
        <h1>QA Мемология</h1>
        <button onClick={() => setCurrentView('game1')}>Режим 1: Объяснение мемов</button>
        <button onClick={() => setCurrentView('game2')}>Режим 2: Битва мемов</button>
        <button onClick={() => setCurrentView('admin')}>Панель управления</button>
      </div>
    ),
    game1: <Game1 memes={memes} goBack={() => setCurrentView('menu')} />,
    game2: <Game2 memes={memes} goBack={() => setCurrentView('menu')} />,
    admin: <AdminPanel goBack={() => setCurrentView('menu')} refreshMemes={fetchMemes} />
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button onClick={fetchMemes}>Попробовать снова</button>
      </div>
    );
  }

  return views[currentView];
}

export default App;