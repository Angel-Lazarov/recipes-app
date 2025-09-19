import express from 'express';
import multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { PORT, CATBOX_USERHASH } from './config.js';

const app = express();

// CORS
const allowedOrigin = "http://localhost:3000"; // смени с URL на фронтенда
app.use(cors({ origin: allowedOrigin }));

// JSON Middleware
app.use(express.json());

// Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Не е избран файл!' });

  try {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('userhash', CATBOX_USERHASH);
    formData.append('fileToUpload', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error(`Catbox upload failed with status ${response.status}`);

    const imageUrl = await response.text();
    console.log(`Image uploaded: ${imageUrl}`);
    res.json({ url: imageUrl });

  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ error: 'Качването на изображението неуспя!' });
  }
});

// Anti-cache .js files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use((req, res, next) => {
  if (req.url.endsWith(".js")) res.setHeader("Cache-Control", "no-store");
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Test route
app.get('/', (req, res) => res.send('Server is running!'));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
