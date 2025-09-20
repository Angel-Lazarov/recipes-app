// backend/server.js
import express from 'express';
import cors from 'cors';
import { query, poolAvailable } from './db.js';
import { FRONTEND_URL, PORT } from './config.js';

const app = express();
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// GET all recipes
app.get('/recipes', async (req, res) => {
  if (!poolAvailable) return res.status(500).json({ error: 'Database not configured' });

  try {
    const result = await query('SELECT * FROM recipes ORDER BY created_at DESC;');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /recipes error', err);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// POST create a recipe
app.post('/recipes', async (req, res) => {
  if (!poolAvailable) return res.status(500).json({ error: 'Database not configured' });

  const { title, image_url, ingredients, steps } = req.body;

  try {
    const result = await query(
      `INSERT INTO recipes (title, image_url, ingredients, steps) 
       VALUES ($1, $2, $3, $4) RETURNING *;`,
      [title, image_url || null, ingredients || [], steps || []]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /recipes error', err);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}  (poolAvailable=${poolAvailable})`);
});
