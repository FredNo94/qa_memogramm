// Вспомогательные функции
export const getMemeDescription = async (filename) => {
    try {
        const response = await fetch(`/api/meme/${filename}/description`);
        const data = await response.json();
        return data.success ? data.description : filename.split('.')[0];
    } catch (error) {
        console.error('Error fetching description:', error);
        return filename.split('.')[0];
    }
};

export const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Функция для отображения уведомлений
export const showNotification = (message, duration = 3000) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 20px 30px;
    border-radius: 10px;
    z-index: 1000;
    text-align: center;
  `;

    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, duration);
};