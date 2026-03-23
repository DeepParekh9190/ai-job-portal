import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

const key = process.env.GOOGLE_API_KEY;

async function listModels() {
  try {
    const res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    console.log('Available Models:', res.data.models.map(m => m.name));
  } catch (err) {
    console.error('Error listing models:', err.response?.data || err.message);
  }
}

listModels();
