import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import FormData from "form-data";
import cors from "cors";
import { CATBOX_USERHASH } from "./config.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded!" });

  try {
    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    formData.append("userhash", CATBOX_USERHASH);
    formData.append("fileToUpload", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: formData,
    });

    const imageUrl = await response.text();
    res.json({ url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image upload failed!" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
