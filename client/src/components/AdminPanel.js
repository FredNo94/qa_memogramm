import React, { useState } from 'react';
import { uploadMeme, deleteAllMemes } from '../api';
import '../styles/AdminPanel.css';

const AdminPanel = ({ goBack, refreshMemes }) => {
  const [password, setPassword] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [deleteStatus, setDeleteStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadStatus('error: Выберите файл для загрузки');
      return;
    }

    const formData = new FormData();
    formData.append('meme', selectedFile);
    formData.append('description', description);

    try {
      const response = await uploadMeme(formData);
      const data = await response.json();

      if (data.success) {
        setUploadStatus('success: Файл успешно загружен!');
        setSelectedFile(null);
        setDescription('');
        document.getElementById('file-input').value = '';
        refreshMemes();
      } else {
        setUploadStatus('error: ' + (data.error || 'Ошибка загрузки'));
      }
    } catch (error) {
      setUploadStatus('error: Ошибка соединения');
    }
  };

  const handleDeleteAll = async (e) => {
    e.preventDefault();
    
    if (!password) {
      setDeleteStatus('error: Введите пароль');
      return;
    }

    if (!window.confirm('Вы уверены, что хотите удалить ВСЕ мемы? Это действие нельзя отменить!')) {
      return;
    }

    try {
      const data = await deleteAllMemes(password);

      if (data.success) {
        setDeleteStatus('success: Все мемы успешно удалены!');
        setPassword('');
        refreshMemes();
      } else {
        setDeleteStatus('error: ' + (data.error || 'Ошибка удаления'));
      }
    } catch (error) {
      setDeleteStatus('error: Ошибка соединения');
    }
  };

  const getStatusClass = (status) => {
    if (status.startsWith('success:')) return 'status-success';
    if (status.startsWith('error:')) return 'status-error';
    return '';
  };

  return (
    <div className="admin-panel">
      <button className="back-button" onClick={goBack}>← Назад</button>
      
      <h2>Панель управления</h2>

      {/* Секция загрузки */}
      <div className="upload-section">
        <h3>Загрузить новый мем</h3>
        <form className="upload-form" onSubmit={handleFileUpload}>
          <input
            id="file-input"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            required
          />
          
          <textarea
            placeholder="Описание мема (опционально)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
          
          <button type="submit">Загрузить</button>
        </form>

        {uploadStatus && (
          <div className={`status-message ${getStatusClass(uploadStatus)}`}>
            {uploadStatus.split(':')[1].trim()}
          </div>
        )}
      </div>

      {/* Секция удаления */}
      <div className="delete-section">
        <h3>Удалить все мемы</h3>
        <p style={{ color: '#856404', marginBottom: '15px' }}>
          ⚠️ Внимание: Это действие удалит ВСЕ загруженные мемы без возможности восстановления!
        </p>
        
        <form className="delete-form" onSubmit={handleDeleteAll}>
          <input
            type="password"
            placeholder="Введите пароль администратора"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Удалить всё</button>
        </form>

        {deleteStatus && (
          <div className={`status-message ${getStatusClass(deleteStatus)}`}>
            {deleteStatus.split(':')[1].trim()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;