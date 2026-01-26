# 🚀 AI Job Portal

A comprehensive AI-powered job portal connecting employers with talented job seekers and freelancers. Features include AI resume builder, resume analyzer, and intelligent job matching.

## ✨ Features

### 👔 For Employers (Client Side)
- Post and manage job listings
- Post and manage gig opportunities
- View applicants with AI-powered resume scores
- Dashboard with analytics
- Application tracking system

### 👤 For Job Seekers (User Side)
- Browse jobs and gigs with advanced filters
- Apply for positions with one click
- **AI Resume Builder** - Create professional resumes with AI assistance
- **AI Resume Analyzer** - Get instant feedback and improvement suggestions
- **AI Job Matching** - See compatibility scores for each job
- Track application status

### 👨‍💼 For Administrators
- Manage users and clients
- Approve/reject job postings
- View platform analytics
- Monitor system activity

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **UI Components**: Lucide React icons
- **Charts**: Recharts
- **PDF Generation**: jsPDF

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **AI Integration**: Anthropic Claude / OpenAI

## 📁 Project Structure

```
ai-job-portal/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store & slices
│   │   ├── services/      # API services
│   │   ├── routes/        # Route configuration
│   │   ├── utils/         # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                # Node.js Backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── server.js
│   └── package.json
│
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-job-portal
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# - Add MongoDB URI
# - Add JWT secret
# - Add AI API key (Anthropic/OpenAI)
```

### 3. Frontend Setup
```bash
cd client
npm install
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Client runs on: `http://localhost:5173`

## 🔑 Environment Variables

### Server (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
ANTHROPIC_API_KEY=your_anthropic_api_key
CLIENT_URL=http://localhost:5173
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Jobs (Client)
- `POST /api/client/jobs` - Create job posting
- `GET /api/client/jobs` - Get my job postings
- `PUT /api/client/jobs/:id` - Update job
- `DELETE /api/client/jobs/:id` - Delete job

### Jobs (User)
- `GET /api/user/jobs` - Browse all jobs
- `GET /api/user/jobs/:id` - Get job details
- `POST /api/user/apply` - Apply for job

### AI Features
- `POST /api/ai/generate-resume` - Generate resume with AI
- `POST /api/ai/analyze-resume` - Analyze resume
- `POST /api/ai/match-job` - Calculate job match score

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Get platform analytics
- `PUT /api/admin/jobs/:id/approve` - Approve job posting

## 🎨 User Roles

1. **User (Job Seeker)** - Can apply for jobs, create resumes, use AI features
2. **Client (Employer)** - Can post jobs/gigs, view applicants
3. **Admin** - Full system access, user management, analytics

## 🤖 AI Features Explained

### AI Resume Builder
- Step-by-step guided process
- AI-powered content suggestions
- Professional templates
- Download as PDF

### AI Resume Analyzer
- Upload existing resume (PDF/DOCX)
- Get detailed analysis and score
- Improvement suggestions
- ATS compatibility check

### AI Job Matching
- Automatic scoring when applying
- Skills match analysis
- Experience compatibility
- Improvement recommendations

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers

## 📦 Building for Production

### Frontend Build
```bash
cd client
npm run build
# Output in client/dist/
```

### Backend Production
```bash
cd server
NODE_ENV=production node server.js
```

## 🧪 Testing

```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test
```

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using React, Node.js, and AI**