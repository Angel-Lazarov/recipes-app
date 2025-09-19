// backend/server.js
import express from 'express';
import multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';
import cors from 'cors';
import { PORT, CATBOX_USERHASH, FRONTEND_URL } from './config.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();

// CORS - позволява заявки само от фронтенда
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Multer (в памет) за upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Прост in-memory масив за рецепти (title, imageUrl)
let recipes = [
  { id: uuidv4(), title: 'Test Recipe 1', imageUrl: '' },
  { id: uuidv4(), title: 'Test Recipe 2', imageUrl: '' }
];

// --- CRUD endpoints за рецепти ---
app.get('/recipes', (req, res) => {
  res.json(recipes);
});

app.post('/recipes', (req, res) => {
  const { title, imageUrl = '' } = req.body;
  const newRecipe = { id: uuidv4(), title, imageUrl };
  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

app.put('/recipes/:id', (req, res) => {
  const { id } = req.params;
  const idx = recipes.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  recipes[idx] = { ...recipes[idx], ...req.body };
  res.json(recipes[idx]);
});

app.delete('/recipes/:id', (req, res) => {
  const { id } = req.params;
  recipes = recipes.filter(r => r.id !== id);
  res.json({ ok: true, id });
});

// --- Upload към Catbox ---
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });

  try {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    if (CATBOX_USERHASH) form.append('userhash', CATBOX_USERHASH);
    form.append('fileToUpload', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Catbox error:', response.status, text);
      return res.status(502).json({ error: 'Catbox upload failed' });
    }

    const imageUrl = await response.text();
    res.json({ url: imageUrl.trim() });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// health
app.get('/', (req, res) => res.send('Backend is running!'));

// start
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
