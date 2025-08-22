import React, { useState, useEffect } from 'react';
import { getMemeDescription } from '../utils';
import '../styles/Games.css';

const Game2 = ({ memes, goBack }) => {
    const [gameState, setGameState] = useState('setup'); // setup, playing, round-result, game-over
    const [currentRound, setCurrentRound] = useState(1);
    const [maxRounds] = useState(3);
    const [scores, setScores] = useState({ player1: 0, player2: 0 });
    const [currentMemes, setCurrentMemes] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [showDescription, setShowDescription] = useState(false);
    const [selectedWinner, setSelectedWinner] = useState(null);

    useEffect(() => {
        if (memes.length >= 2) {
            selectRandomMemes();
        }
    }, [memes]);

    const selectRandomMemes = () => {
        const shuffled = [...memes].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 2);
        setCurrentMemes(selected);

        // Загружаем описания
        Promise.all(selected.map(meme => getMemeDescription(meme)))
            .then(descs => setDescriptions(descs));
    };

    const startRound = () => {
        setGameState('playing');
        setShowDescription(false);
        setSelectedWinner(null);
    };

    const handleWinnerSelection = (winner) => {
        setSelectedWinner(winner);

        // Обновляем счет
        setScores(prev => ({
            ...prev,
            [winner]: prev[winner] + 1
        }));

        // Автоматически переходим к следующему раунду через 2 секунды
        setTimeout(() => {
            if (currentRound < maxRounds) {
                setCurrentRound(prev => prev + 1);
                selectRandomMemes();
                setGameState('playing');
            } else {
                setGameState('game-over');
            }
        }, 2000);
    };

    const restartGame = () => {
        setGameState('setup');
        setCurrentRound(1);
        setScores({ player1: 0, player2: 0 });
        selectRandomMemes();
    };

    if (memes.length < 2) {
        return (
            <div className="game-container">
                <button className="back-button" onClick={goBack}>← Назад</button>
                <div className="notification">
                    Нужно как минимум 2 мема для игры!
                </div>
            </div>
        );
    }

    return (
        <div className="game-container">
            <button className="back-button" onClick={goBack}>← Назад</button>

            <h2>Режим 2: Битва мемов</h2>

            <div className="round-info">
                Раунд: {currentRound} / {maxRounds}
            </div>

            <div className="score">
                Счет: Игрок 1 - {scores.player1} | Игрок 2 - {scores.player2}
            </div>

            {gameState === 'setup' && (
                <div className="setup-screen">
                    <button
                        className="control-btn"
                        onClick={startRound}
                        style={{ padding: '20px 40px', fontSize: '1.3rem' }}
                    >
                        Начать раунд
                    </button>
                </div>
            )}

            {gameState === 'playing' && (
                <>
                    <div className="battle-container">
                        {currentMemes.map((meme, index) => (
                            <div key={index} className="battle-meme">
                                <img
                                    src={`/api/memes/${meme}`}
                                    alt={`Meme ${index + 1}`}
                                    className="meme-image"
                                />
                                <div className="player-label">Игрок {index + 1}</div>
                            </div>
                        ))}
                    </div>

                    <div className="controls">
                        <button
                            className="control-btn winner-btn"
                            onClick={() => handleWinnerSelection('player1')}
                        >
                            Победил Игрок 1
                        </button>

                        <button
                            className="control-btn show-description"
                            onClick={() => setShowDescription(!showDescription)}
                        >
                            {showDescription ? 'Скрыть описание' : 'Показать описание'}
                        </button>

                        <button
                            className="control-btn winner-btn"
                            onClick={() => handleWinnerSelection('player2')}
                        >
                            Победил Игрок 2
                        </button>
                    </div>

                    {showDescription && (
                        <div className="description">
                            <h4>Описания мемов:</h4>
                            {descriptions.map((desc, index) => (
                                <p key={index}>Игрок {index + 1}: {desc}</p>
                            ))}
                        </div>
                    )}
                </>
            )}

            {selectedWinner && (
                <div className="notification">
                    {selectedWinner === 'player1' ? 'Игрок 1' : 'Игрок 2'} победил в раунде!
                </div>
            )}

            {gameState === 'game-over' && (
                <div className="game-over">
                    <h3>Игра окончена!</h3>
                    <h4>Финальный счет:</h4>
                    <p>Игрок 1: {scores.player1}</p>
                    <p>Игрок 2: {scores.player2}</p>
                    <p>
                        {scores.player1 > scores.player2 ? 'Игрок 1 победил!' :
                            scores.player2 > scores.player1 ? 'Игрок 2 победил!' :
                                'Ничья!'}
                    </p>
                    <button onClick={restartGame}>
                        Начать новую игру
                    </button>
                </div>
            )}
        </div>
    );
};

export default Game2;