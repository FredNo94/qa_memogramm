import React, { useState, useEffect } from 'react';
import Game1 from './games/Game1';
import Game2 from './games/Game2';
import AdminPanel from './components/AdminPanel';
import './styles/App.css';

function App() {
    const [currentView, setCurrentView] = useState('menu');
    const [memes, setMemes] = useState([]);

    useEffect(() => {
        fetchMemes();
    }, []);

    const fetchMemes = async () => {
        try {
            const response = await fetch('/api/memes');
            const data = await response.json();
            setMemes(data);
        } catch (error) {
            console.error('Error fetching memes:', error);
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

    return views[currentView];
}

export default App;