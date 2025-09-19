// backend/config.js
import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
export const CATBOX_USERHASH = process.env.CATBOX_USERHASH || '';
