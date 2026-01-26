---
description: How to get an OpenAI API Key
---

1. **Visit OpenAI Platform**: Open your web browser and navigate to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys).
2. **Login/Sign Up**: Log in with your OpenAI account (or create one if you don't have it).
3. **Create Key**:
   - Click on **"Create new secret key"**.
   - Give it a name (e.g., "JobPortal").
   - Click "Create secret key".
4. **Copy Key**: The key will start with `sk-...`. **Copy it immediately**—you won't be able to see it again!
5. **Update .env**:
   - Go back to VS Code.
   - Open `server/.env`.
   - Find `OPENAI_API_KEY=your_openai_api_key_here`.
   - Replace `your_openai_api_key_here` with your copied key.
   - Ensure `AI_PROVIDER=openai` (or change it if it says anthropic).
6. **Restart Server**:
   - In your terminal running the server, press `Ctrl+C` to stop it.
   - Run `npm run dev` (or `node server.js`) to restart it so the new key is loaded.
