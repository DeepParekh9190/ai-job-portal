# 🚀 AI Job Portal - Complete Setup Instructions

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Environment Configuration](#environment-configuration)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - OR MongoDB Atlas account (cloud database)
- **npm** or **yarn** package manager
- **Git** - [Download](https://git-scm.com/)
- **Anthropic API Key** or **OpenAI API Key** for AI features

---

## Project Structure

```
ai-job-portal/
├── server/              # Backend (Node.js + Express)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── client/              # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## Backend Setup

### Step 1: Navigate to Server Directory

```bash
cd server
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- Express.js
- Mongoose
- JWT
- Bcrypt
- Cors
- And more...

### Step 3: Configure Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/ai-job-portal
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-job-portal

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=30d

# AI Service Configuration (Choose one)
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key_here
# OR
# OPENAI_API_KEY=your_openai_api_key_here

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### Step 4: Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS/Linux
sudo mongod

# Windows
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

**Option B: MongoDB Atlas**
- Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Get connection string
- Add to `.env` as `MONGO_URI`

### Step 5: Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend will run on: **http://localhost:5000**

---

## Frontend Setup

### Step 1: Navigate to Client Directory

```bash
cd client
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- React 18
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- And more...

### Step 3: Configure Environment Variables (Optional)

Create `.env` in `client/` directory if you need custom API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

## Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Option 2: Using Concurrently (Recommended)

Add to root `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"cd server && npm run dev\" \"cd client && npm run dev\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

Then run:
```bash
npm install
npm run dev
```

---

## Environment Configuration

### Required Environment Variables

#### Backend (`server/.env`)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment | Yes | `development` |
| `PORT` | Server port | Yes | `5000` |
| `MONGO_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/ai-job-portal` |
| `JWT_SECRET` | Secret for JWT tokens | Yes | `your_secret_key` |
| `JWT_EXPIRE` | Token expiration | No | `30d` |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | Yes* | `sk-ant-...` |
| `OPENAI_API_KEY` | OpenAI API key | Yes* | `sk-...` |
| `CLIENT_URL` | Frontend URL | Yes | `http://localhost:5173` |

*One AI provider key is required

#### Frontend (`client/.env`)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | No | `http://localhost:5000/api` |

---

## Testing

### Backend Testing

```bash
cd server
npm test
```

### Frontend Testing

```bash
cd client
npm test
```

### Manual Testing Endpoints

Use tools like **Postman** or **Thunder Client**:

1. **Register User:**
   - POST `http://localhost:5000/api/auth/register/user`
   - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`

2. **Login:**
   - POST `http://localhost:5000/api/auth/login`
   - Body: `{ "email": "john@example.com", "password": "password123" }`

3. **Get Jobs:**
   - GET `http://localhost:5000/api/user/jobs`

---

## Deployment

### Backend Deployment (Heroku Example)

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create ai-job-portal-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongo_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set ANTHROPIC_API_KEY=your_key

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel Example)

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to client folder
cd client

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# VITE_API_URL=https://your-backend-url.herokuapp.com/api
```

### Alternative Deployment Options

- **Backend:** Railway, Render, DigitalOcean, AWS
- **Frontend:** Netlify, GitHub Pages, AWS S3

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error

**Error:** `MongooseServerSelectionError`

**Solution:**
- Check if MongoDB is running
- Verify `MONGO_URI` in `.env`
- Check network connectivity
- For Atlas: whitelist your IP address

#### 2. Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Find process using port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in .env
PORT=5001
```

#### 3. CORS Errors

**Error:** `Access to fetch has been blocked by CORS policy`

**Solution:**
- Check `CLIENT_URL` in backend `.env`
- Ensure frontend is running on correct port
- Clear browser cache

#### 4. AI Features Not Working

**Error:** `AI API key not configured`

**Solution:**
- Verify API key in `.env`
- Check API key format
- Ensure key has credits
- Check API provider status

#### 5. Module Not Found

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 6. Build Errors

**Frontend build fails:**
```bash
# Clear cache and rebuild
npm run build -- --force
```

---

## Default Credentials (After Setup)

For testing, you can create:

### User Account (Job Seeker)
- Email: `user@example.com`
- Password: `password123`
- Role: `user`

### Client Account (Employer)
- Email: `client@example.com`
- Password: `password123`
- Role: `client`

### Admin Account
- Create manually via MongoDB
- Set role to `admin`

---

## Additional Commands

### Backend Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Next Steps

1. ✅ Complete backend and frontend setup
2. ✅ Configure environment variables
3. ✅ Start both servers
4. ✅ Test API endpoints
5. ✅ Create test accounts
6. ✅ Test AI features
7. ✅ Build components (see component templates)
8. ✅ Deploy to production

---

## Support

For issues or questions:
- Check [Troubleshooting](#troubleshooting) section
- Review error logs
- Check API documentation in README.md
- Verify all environment variables

---

## License

MIT License - See LICENSE file for details

---

**Project Status:** ✅ Backend Complete | ⚙️ Frontend Foundation Ready

**Last Updated:** December 2024