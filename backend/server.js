// backend/server.js
import express from 'express';
import multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';
import cors from 'cors';
import { PORT, CATBOX_USERHASH, FRONTEND_URL } from './config.js';
import { poolAvailable, query } from './db.js';

// --- Ensure table exists, but do NOT drop it ---
async function ensureRecipesTable() {
  if (!poolAvailable) return;
  await query(`
    CREATE TABLE IF NOT EXISTS recipes (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      image_url TEXT,
      category TEXT,
      ingredients TEXT[],
      steps TEXT[],
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `);
  console.log('Recipes table ensured.');
}

// --- DB helpers ---
async function getRecipesFromDb(filters = {}) {
  const where = [];
  const params = [];
  let idx = 1;

  if (filters.search) {
    where.push(`lower(title) LIKE $${idx++}`);
    params.push(`%${filters.search.toLowerCase()}%`);
  }
  if (filters.category) {
    where.push(`lower(category) = $${idx++}`);
    params.push(filters.category.toLowerCase());
  }
  if (filters.ingredient) {
    where.push(`EXISTS (SELECT 1 FROM unnest(ingredients) i WHERE lower(i) LIKE $${idx++})`);
    params.push(`%${filters.ingredient.toLowerCase()}%`);
  }

  const sql = `
    SELECT id, title, image_url AS "imageUrl", category, ingredients, steps
    FROM recipes
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY created_at DESC
  `;
  const res = await query(sql, params);
  return res.rows;
}

async function createRecipeDb(data) {
  const sql = `
    INSERT INTO recipes (title, image_url, category, ingredients, steps)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, title, image_url AS "imageUrl", category, ingredients, steps
  `;
  const vals = [
    data.title,
    data.imageUrl || null,
    data.category || null,
    data.ingredients || [],
    data.steps || []
  ];
  const res = await query(sql, vals);
  return res.rows[0];
}

async function updateRecipeDb(id, data) {
  const sql = `
    UPDATE recipes
    SET title = $1, image_url = $2, category = $3, ingredients = $4, steps = $5, updated_at = now()
    WHERE id = $6
    RETURNING id, title, image_url AS "imageUrl", category, ingredients, steps
  `;
  const vals = [
    data.title,
    data.imageUrl || null,
    data.category || null,
    data.ingredients || [],
    data.steps || [],
    id
  ];
  const res = await query(sql, vals);
  return res.rows[0];
}

async function deleteRecipeDb(id) {
  await query('DELETE FROM recipes WHERE id = $1', [id]);
  return { ok: true, id };
}

// --- Express setup ---
const app = express();
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- Routes ---
app.get('/recipes', async (req, res) => {
  try {
    const { search, category, ingredient } = req.query;
    const rows = poolAvailable
      ? await getRecipesFromDb({ search, category, ingredient })
      : [];
    res.json(rows);
  } catch (err) {
    console.error('GET /recipes error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/recipes', async (req, res) => {
  try {
    const { title, imageUrl = '', category = '', ingredients = [], steps = [] } = req.body;
    const row = poolAvailable
      ? await createRecipeDb({ title, imageUrl, category, ingredients, steps })
      : null;
    res.status(201).json(row);
  } catch (err) {
    console.error('POST /recipes error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/recipes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = poolAvailable ? await updateRecipeDb(id, req.body) : null;
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /recipes/:id error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/recipes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (poolAvailable) await deleteRecipeDb(id);
    res.json({ ok: true, id });
  } catch (err) {
    console.error('DELETE /recipes/:id error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload към Catbox
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

// Health check
app.get('/', (req, res) => res.send('Backend is running!'));

// --- Стартиране на сървъра ---
(async () => {
  if (poolAvailable) {
    await ensureRecipesTable(); // безопасно създава таблицата, без да триe
  }

  app.listen(PORT, () =>
    console.log(`Backend listening on port ${PORT}  (poolAvailable=${poolAvailable})`)
  );
})();
