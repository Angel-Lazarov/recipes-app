import express from 'express';
import multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// --- Разрешаваме фронтенда да прави заявки ---
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3001";
app.use(cors({ origin: allowedOrigin }));

// --- Middleware за парсване на JSON заявки ---
app.use(express.json());

// --- Настройка на multer за памет ---
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- Тестови рецепти ---
let recipes = [
  { id: '1', name: 'Test Recipe 1' },
  { id: '2', name: 'Test Recipe 2' },
];

// --- Ендпойнт за рецепти ---
app.get('/recipes', (req, res) => {
  res.json(recipes);
});

app.post('/recipes', (req, res) => {
  const newRecipe = { id: `${recipes.length + 1}`, ...req.body };
  recipes.push(newRecipe);
  res.json(newRecipe);
});

// --- Ендпойнт за качване на изображение към Catbox ---
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Не е избран файл!' });

  try {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('userhash', process.env.CATBOX_USERHASH);
    formData.append('fileToUpload', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error(`Catbox upload failed: ${response.status}`);
    const imageUrl = await response.text();
    res.json({ url: imageUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Качването на изображението неуспя!' });
  }
});

// --- Тестов рут ---
app.get('/', (req, res) => res.send('Backend is running!'));

// --- Стартиране на сървъра ---
app.listen(port, () => console.log(`Server running on port ${port}`));
