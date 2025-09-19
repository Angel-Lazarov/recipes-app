import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // <- указваме път до root .env

export const PORT = process.env.PORT || 3000;
export const CATBOX_USERHASH = process.env.CATBOX_USERHASH;
