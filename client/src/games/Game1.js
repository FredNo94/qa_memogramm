import React, { useState, useEffect } from 'react';
import '../styles/Games.css';

const Game1 = ({ memes, goBack }) => {
    const [currentMemeIndex, setCurrentMemeIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showDescription, setShowDescription] = useState(false);
    const [gameActive, setGameActive] = useState(true);

    useEffect(() => {
        if (memes.length > 0) {
            selectRandomMeme();
        }
    }, [memes]);

    const selectRandomMeme = () => {
        const randomIndex = Math.floor(Math.random() * memes.length);
        setCurrentMemeIndex(randomIndex);
        setShowDescription(false);
    };

    const handleAnswer = (isCorrect) => {
        if (!gameActive) return;

        if (isCorrect) {
            setScore(score + 1);
            selectRandomMeme();
        } else {
            setGameActive(false);
        }
    };

    if (memes.length === 0) return <div>Загрузка мемов...</div>;

    return (
        <div className="game-container">
            <button className="back-button" onClick={goBack}>← Назад</button>

            <h2>Режим 1: Объяснение мемов</h2>
            <div className="score">Счет: {score}</div>

            {gameActive ? (
                <>
                    <div className="meme-container">
                        <img
                            src={`/api/memes/${memes[currentMemeIndex]}`}
                            alt="Meme"
                            className="meme-image"
                        />
                    </div>

                    <div className="controls">
                        <button
                            className="control-btn incorrect"
                            onClick={() => handleAnswer(false)}
                        >✕</button>

                        <button
                            className="control-btn show-description"
                            onClick={() => setShowDescription(!showDescription)}
                        >
                            {showDescription ? 'Скрыть описание' : 'Показать описание'}
                        </button>

                        <button
                            className="control-btn correct"
                            onClick={() => handleAnswer(true)}
                        >✓</button>
                    </div>

                    {showDescription && (
                        <div className="description">
                            {memes[currentMemeIndex].split('.')[0]}
                        </div>
                    )}
                </>
            ) : (
                <div className="game-over">
                    <h3>Игра окончена!</h3>
                    <button onClick={() => { setScore(0); setGameActive(true); selectRandomMeme(); }}>
                        Начать заново
                    </button>
                </div>
            )}
        </div>
    );
};

export default Game1;