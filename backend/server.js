import express from "express";
import multer from "multer";
import cors from "cors";
import { db } from "./firebase.js"; // връзка към Firebase
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = process.env.PORT || 3000;

// Разрешаваме фронтенда да прави заявки
app.use(cors({ origin: "http://localhost:3000" })); // смени с твоя фронтенд URL
app.use(express.json());

// Multer за качване на файлове в паметта
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- Ендпойнт за рецепти ---
app.get("/recipes", async (req, res) => {
  const snapshot = await db.collection("recipes").get();
  const recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(recipes);
});

app.post("/recipes", async (req, res) => {
  const docRef = await db.collection("recipes").add(req.body);
  res.json({ id: docRef.id });
});

app.put("/recipes/:id", async (req, res) => {
  const { id } = req.params;
  await db.collection("recipes").doc(id).update(req.body);
  res.json({ id });
});

app.delete("/recipes/:id", async (req, res) => {
  const { id } = req.params;
  await db.collection("recipes").doc(id).delete();
  res.json({ id });
});

// --- Ендпойнт за качване на изображения ---
app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Не е избран файл!" });

  try {
    // Тук можеш да добавиш логика за качване на снимката в Catbox или друг сървър
    // За тест, връщаме временно URL
    const imageUrl = `https://via.placeholder.com/300.png?text=${uuidv4()}`;
    res.json({ url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Качването на изображението неуспя!" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
