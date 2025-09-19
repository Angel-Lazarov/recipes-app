// backend/config.js
import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const CATBOX_USERHASH = process.env.CATBOX_USERHASH;

// FRONTEND_URL: използва се URL на деплойнатия фронтенд, fallback към localhost
export const FRONTEND_URL =
  process.env.FRONTEND_URL || 'http://localhost:3001';
