import dotenv from 'dotenv';
import { callAI } from './server/utils/aiService.js';

dotenv.config({ path: './server/.env' });

async function test() {
  try {
    console.log('Testing AI connection...');
    const res = await callAI('Hello, are you there?', 'Respond with one word');
    console.log('AI Response:', res);
  } catch (err) {
    console.error('AI Error:', err.message);
  }
}

test();
