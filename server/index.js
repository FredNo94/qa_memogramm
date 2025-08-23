require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Определяем разрешенные домены
const allowedOrigins = [
  'https://qamemogrammv2.vercel.app',
  'http://localhost:3000'
];

// Настройка CORS
app.use(cors({
  origin: function (origin, callback) {
    // Разрешаем запросы без origin (например, из мобильных приложений или Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'memes')));

// Создание папки для мемов, если её нет
const memesDir = path.join(__dirname, 'memes');
fs.mkdir(memesDir, { recursive: true }).catch(console.error);

// Конфигурация Multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'memes/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Только изображения разрешены'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Вспомогательные функции
const getMemeList = async () => {
  try {
    const files = await fs.readdir('./memes');
    return files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
  } catch (error) {
    return [];
  }
};

// Маршруты
app.get('/api/memes', async (req, res) => {
  try {
    const memes = await getMemeList();
    res.json({ success: true, memes });
  } catch (error) {
    console.error('Error loading memes:', error);
    res.status(500).json({ success: false, error: 'Failed to load memes' });
  }
});

app.post('/api/upload', upload.single('meme'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
    // Добавляем описание из формы
    const description = req.body.description || req.file.originalname.split('.')[0];
    const filePath = path.join(__dirname, 'memes', req.file.filename);
    const descriptionPath = filePath + '.txt';
    
    await fs.writeFile(descriptionPath, description);
    res.json({ success: true, file: req.file.filename, description });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
});

app.delete('/api/memes', async (req, res) => {
  try {
    if (req.body.password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }

    const files = await getMemeList();
    const deletePromises = files.map(async file => {
      await fs.unlink(path.join(__dirname, 'memes', file));
      // Удаляем файл описания если существует
      const descPath = path.join(__dirname, 'memes', file + '.txt');
      try {
        await fs.unlink(descPath);
      } catch (e) {
        // Файл описания может не существовать
      }
    });
    
    await Promise.all(deletePromises);
    res.json({ success: true, message: `Deleted ${files.length} files` });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, error: 'Delete failed' });
  }
});

// Получение описания мема
app.get('/api/meme/:filename/description', async (req, res) => {
  try {
    const descPath = path.join(__dirname, 'memes', req.params.filename + '.txt');
    const description = await fs.readFile(descPath, 'utf8');
    res.json({ success: true, description });
  } catch (error) {
    res.json({ success: false, description: req.params.filename.split('.')[0] });
  }
});

// Обработчик для Vercel
module.exports = app;

// Локальный запуск
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}