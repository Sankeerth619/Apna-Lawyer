# Apna-Lawyer: AI Public Defender

<div align="center">
  <h3>🏛️ AI-Powered Legal Assistant for Indian Citizens</h3>
  <p>Democratizing legal guidance through intelligent technology</p>
</div>

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [System Architecture](#system-architecture)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Solution Design](#solution-design)

---

## 📌 Overview

**Apna-Lawyer** is a full-stack web application that leverages AI to provide accessible legal guidance and document generation for Indian citizens. It acts as a virtual AI Public Defender, helping users understand their legal rights, analyze legal documents, and generate formal legal documents like FIRs and legal notices.

**Problem Addressed:**
- Legal services are expensive and inaccessible to average citizens
- People lack understanding of legal processes and court procedures
- Document preparation requires specialized knowledge
- No centralized guidance on Indian legal framework

**Solution:**
- Conversational AI bot powered by Google Gemini API
- Real-time legal analysis with case severity assessment
- Automated document generation and analysis
- User dashboard to track cases and legal documents
- Secure authentication with case history management

---

## ✨ Features

### 1. **AI Legal Chat Bot**
- Real-time conversation with AI legal assistant
- Case type and severity detection
- Structured legal analysis with:
  - Applicable laws and court guidance
  - Step-by-step process guidance
  - Document requirements
  - Timeline and cost estimates
  - Risk assessment

### 2. **Document Management**
- Upload and analyze legal documents (PDFs, images)
- OCR for scanned documents
- Extract key legal points and identify risks
- Organize documents by case

### 3. **Legal Document Generation**
- Auto-generate FIRs (First Information Reports)
- Generate legal notices and formal letters
- Download documents as PDF
- Copy to clipboard for easy sharing

### 4. **Case Dashboard**
- Track all legal cases and matters
- View case history and analysis
- Schedule reminders for hearings
- Download case summaries

### 5. **User Management**
- Secure registration and login
- JWT-based authentication
- Personal case tracking
- Review and rating system

### 6. **Reviews & Community**
- Read verified reviews from other users
- Submit your own experience
- Build trust through community feedback

---

## 🏗️ System Architecture

### **Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE LAYER                    │
│  (React + TypeScript + Vite + Tailwind CSS + Framer Motion) │
├─────────────────────────────────────────────────────────────┤
│                    ROUTING & PAGES                           │
│  Landing → Auth (Login/Signup) → Protected (Bot/Dashboard)  │
├─────────────────────────────────────────────────────────────┤
│              API CLIENT LAYER (Axios + React Query)         │
│  Services: gemini.ts | api.ts | Auth Context               │
├─────────────────────────────────────────────────────────────┤
│                   EXPRESS.JS SERVER                         │
│  ┌─────────────┬──────────────┬───────────────┬─────────┐  │
│  │   Auth API  │   Cases API  │  Documents API│Reviews  │  │
│  │ (JWT Token) │  (CRUD Ops)  │  (File Mgmt)  │  API    │  │
│  └─────────────┴──────────────┴───────────────┴─────────┘  │
├─────────────────────────────────────────────────────────────┤
│                  EXTERNAL AI SERVICE                        │
│          Google Gemini API (gemini-3-flash-preview)        │
│  - Legal issue analysis                                     │
│  - Document analysis & extraction                          │
│  - FIR & Legal notice generation                           │
├─────────────────────────────────────────────────────────────┤
│                   DATABASE LAYER                            │
│        SQLite (better-sqlite3) - defender.db               │
│  Tables: users | cases | documents | reviews | contacts    │
└─────────────────────────────────────────────────────────────┘
```

### **Data Flow**

#### **User Legal Consultation Flow:**
```
User Input → Validation → Gemini API Analysis → Structured JSON Response
   ↓
Database Save (case record) → Display formatted analysis → User Dashboard
```

#### **Document Analysis Flow:**
```
File Upload (PDF/Image) → OCR Extraction (Tesseract.js) → Text Parsing
   ↓
Gemini Analysis → Extract Legal Points & Risks → Save to DB → Display
```

#### **Authentication Flow:**
```
User Registration/Login → Password Hashing (bcryptjs) → JWT Token Generation
   ↓
Token Validation → API Access → Secure Case/Document Operations
```

---

## 🛠️ Tech Stack

### **Frontend**
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 19 + TypeScript | UI components and state management |
| Build Tool | Vite 6 | Fast bundling and HMR |
| Styling | Tailwind CSS 4 + Tailwind Merge | Utility-first CSS |
| Animations | Framer Motion | Smooth page transitions |
| Routing | React Router v7 | Client-side navigation |
| HTTP Client | Axios | API requests |
| State Management | React Query + Context API | Data fetching & auth |
| UI Icons | Lucide React | Icon library |
| File Upload | React Dropzone | Drag-and-drop uploads |
| PDF Processing | pdf-lib, pdf-parse | PDF manipulation |
| OCR | Tesseract.js | Extract text from images |
| Notifications | React Hot Toast | Toast notifications |
| Markdown | React Markdown | Render formatted responses |

### **Backend**
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Express.js 4 | REST API server |
| Authentication | JWT (jsonwebtoken) | Secure token-based auth |
| Password Security | bcryptjs | Hash passwords |
| Database | SQLite + better-sqlite3 | Lightweight persistent storage |
| File Upload | Multer | Handle multipart form data |
| Environment | dotenv | Config management |

### **AI & External Services**
| Service | Purpose |
|---------|---------|
| Google Gemini API (gemini-3-flash-preview) | Legal analysis and document generation |
| Tesseract.js | OCR for document scanning |

### **DevTools**
- **TypeScript** - Type safety
- **TSX/tsx** - Run TypeScript directly
- **Autoprefixer** - CSS vendor prefixes

---

## 📂 Project Structure

```
apna-lawyer/
├── src/
│   ├── pages/                    # Page components
│   │   ├── LandingPage.tsx       # Hero and value proposition
│   │   ├── AboutPage.tsx         # App information
│   │   ├── AIBotPage.tsx         # Main chat interface (22.5 KB)
│   │   ├── DashboardPage.tsx     # Case tracking dashboard
│   │   ├── ReviewsPage.tsx       # User testimonials
│   │   ├── ContactPage.tsx       # Contact form
│   │   ├── LoginPage.tsx         # Authentication
│   │   └── SignupPage.tsx        # User registration
│   │
│   ├── components/               # Reusable components
│   │   ├── Navbar.tsx            # Navigation header
│   │   ├── Footer.tsx            # Footer
│   │   ├── ProtectedRoute.tsx    # Auth guard
│   │   └── TypewriterText.tsx    # Animation component
│   │
│   ├── services/                 # API & AI services
│   │   ├── gemini.ts             # Gemini API integration
│   │   │   ├── analyzeLegalIssue()      # Core analysis function
│   │   │   ├── analyzeDocument()        # Document analysis
│   │   │   ├── generateFIR()            # FIR generation
│   │   │   └── generateLegalNotice()    # Notice generation
│   │   └── api.ts                # Axios instance & HTTP calls
│   │
│   ├── context/                  # React Context
│   │   └── AuthContext.tsx       # Auth state management
│   │
│   ├── App.tsx                   # Main app router & layout
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles
│
├── server.ts                      # Express.js backend (215 lines)
│   ├── Database initialization   # SQLite setup
│   ├── Auth endpoints            # /api/auth/*
│   ├── Cases endpoints           # /api/cases/*
│   ├── Documents endpoints       # /api/documents/*
│   ├── Reviews endpoints         # /api/reviews
│   └── Contact endpoints         # /api/contact
│
├── public/
│   └── index.html                # HTML template
│
├── package.json                  # Dependencies & scripts
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
└── .env.example                 # Environment variables template
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 16+ (with npm/yarn)
- Google Gemini API Key
- 500MB disk space

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd apna-lawyer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   JWT_SECRET=lexai-secret-key-2026
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

### **Building for Production**

```bash
npm run build      # Build frontend
npm run preview    # Preview production build
```

---

## 📡 API Documentation

### **Base URL:** `http://localhost:3000/api`

### **Authentication Endpoints**

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (201):
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "token": "eyJhbGc...",
  "user": { ... }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response (200):
{
  "id": 1,
  "email": "john@example.com",
  "full_name": "John Doe"
}
```

### **Cases Endpoints**

#### Create Case
```http
POST /cases
Authorization: Bearer <token>
Content-Type: application/json

{
  "case_type": "Employment Dispute",
  "severity": "MEDIUM",
  "question": "I was wrongfully terminated...",
  "analysis_json": { ... },
  "next_step": "File complaint with labor board",
  "expected_hearing": "2025-05-15",
  "reminder_date": "2025-05-10"
}

Response (200):
{
  "id": 1
}
```

#### Get User's Cases
```http
GET /cases/my-cases
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "case_type": "Employment Dispute",
    "severity": "MEDIUM",
    "question": "...",
    "analysis_json": { ... },
    "created_at": "2025-04-07T10:30:00Z"
  }
]
```

#### Delete Case
```http
DELETE /cases/:id
Authorization: Bearer <token>

Response (200):
{ "success": true }
```

### **Documents Endpoints**

#### Upload Document
```http
POST /documents
Authorization: Bearer <token>
Content-Type: application/json

{
  "case_id": 1,
  "doc_type": "FIR",
  "content": "Document content here..."
}

Response (200):
{ "id": 1 }
```

#### Get User's Documents
```http
GET /documents/my-documents
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "case_id": 1,
    "doc_type": "FIR",
    "content": "...",
    "created_at": "2025-04-07T10:30:00Z"
  }
]
```

### **Reviews Endpoints**

#### Get All Reviews
```http
GET /reviews

Response (200):
[
  {
    "id": 1,
    "user_name": "Aarav Sharma",
    "rating": 5,
    "text": "Apna-Lawyer helped me...",
    "is_verified": 1,
    "created_at": "2025-04-07T10:30:00Z"
  }
]
```

#### Submit Review
```http
POST /reviews
Content-Type: application/json

{
  "user_name": "New User",
  "rating": 5,
  "text": "Great service!"
}

Response (200):
{ "id": 2 }
```

### **Contact Endpoint**

```http
POST /contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Query",
  "message": "I have a question..."
}

Response (200):
{ "success": true }
```

---

## 📊 Database Schema

### **Users Table**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### **Cases Table**
```sql
CREATE TABLE cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  case_type TEXT,                    -- "Employment Dispute", "Tenant Rights", etc.
  severity TEXT,                     -- "LOW", "MEDIUM", "HIGH", "CRITICAL"
  question TEXT,                     -- User's case description
  analysis_json TEXT,                -- Full Gemini analysis (JSON stringified)
  next_step TEXT,                    -- Recommended next action
  expected_hearing TEXT,             -- Expected hearing date
  reminder_date TEXT,                -- Reminder for hearing
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### **Documents Table**
```sql
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  case_id INTEGER,                   -- Associated case
  doc_type TEXT,                     -- "FIR", "Legal Notice", "Contract", etc.
  content TEXT,                      -- Document content/extracted text
  pdf_path TEXT,                     -- Path to generated PDF
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (case_id) REFERENCES cases(id)
);
```

### **Reviews Table**
```sql
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name TEXT,
  rating INTEGER,                    -- 1-5 stars
  text TEXT,
  is_verified INTEGER DEFAULT 0,     -- 0 or 1
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### **Contacts Table**
```sql
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎯 Solution Design

### **Problem Analysis**

**Challenge 1: Accessibility**
- Average Indian citizen can't afford ₹5,000-₹20,000 per legal consultation
- Limited availability of lawyers in rural areas
- Language and legal jargon barriers

**Solution:** Conversational AI interface in plain English/Hindi, available 24/7 at zero cost

**Challenge 2: Legal Document Generation**
- FIR creation requires understanding of police procedures
- Legal notices need proper formatting and legal language
- Many people file incorrect documents, leading to case rejection

**Solution:** AI-powered templates that auto-generate documents with proper legal language and structure

**Challenge 3: Case Management**
- No centralized way to track legal matters
- People forget document requirements and deadlines
- Hard to maintain case history

**Solution:** Dashboard with timeline tracking, reminders, and document storage

**Challenge 4: Information Overload**
- Indian legal system is complex with state variations
- People don't know where to file cases or what courts to approach
- No guidance on court procedures and timelines

**Solution:** Structured analysis with step-by-step guidance, cost estimates, and risk assessment

### **Key Design Decisions**

#### 1. **Gemini API with Structured JSON Response**
- Uses Google Gemini with JSON schema validation
- Ensures consistent, parseable output
- Real-time analysis without requiring heavy backend processing

#### 2. **SQLite for Simplicity & Portability**
- Lightweight database suitable for single-user and small-team deployments
- No separate database server needed
- Easy to backup and migrate (just copy .db file)
- Sufficient for current scale

#### 3. **JWT Authentication**
- Stateless authentication suitable for REST APIs
- Secure token-based access
- Easy to scale horizontally

#### 4. **React + Vite Frontend**
- Fast development experience
- Instant HMR for better developer productivity
- Optimized production builds
- Component-based architecture for maintainability

#### 5. **Framer Motion for Smooth Animations**
- Professional page transitions
- Enhanced user experience
- Not performance-intensive

#### 6. **Tailwind CSS for Styling**
- Rapid UI development
- Consistent design system
- Low CSS bundle size with utility-first approach

#### 7. **Tesseract.js for Client-Side OCR**
- No server-side processing needed
- Instant document analysis feedback
- Privacy: documents stay on client device

### **Security Considerations**

1. **Password Hashing:** bcryptjs with salt rounds
2. **JWT Tokens:** Signed tokens with expiration
3. **Input Validation:** Server-side validation on all API endpoints
4. **Authorization:** Token verification on protected routes
5. **HTTPS Ready:** Configured for secure deployment

### **Performance Optimizations**

- **Code Splitting:** Route-based code splitting in Vite
- **Lazy Loading:** React Query for efficient data fetching
- **Caching:** Browser cache headers on static assets
- **API Optimization:** Endpoint aggregation to reduce N+1 queries

### **Scalability Considerations**

**Current Stage (MVP):**
- Single SQLite database
- Single Node.js server

**Future Scaling Path:**
1. PostgreSQL migration for concurrent users
2. Redis caching layer for frequently accessed cases
3. Separate AI service worker for long-running Gemini requests
4. Message queue (Bull/RabbitMQ) for document generation jobs
5. Microservices for auth, cases, and AI services
6. CDN for static assets
7. Load balancer for multiple server instances

---

## 🔒 Environment Variables

```env
# AI Service
GEMINI_API_KEY=<your-google-gemini-api-key>

# Authentication
JWT_SECRET=lexai-secret-key-2026

# Environment
NODE_ENV=development
PORT=3000
```

---

## 📝 License

This project is provided as-is for educational and legal assistance purposes.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support & Contact

For questions, suggestions, or issues:
- Use the Contact page in the app
- Email through the contact form
- Check existing issues in the repository

---

## 🎓 Legal Disclaimer

Apna-Lawyer is an AI-powered assistant and should not be considered a substitute for professional legal advice. Always consult with a qualified lawyer for critical legal matters. The app provides general guidance based on the Indian legal framework but cannot provide case-specific legal advice.

---

**Built with ❤️ to democratize legal access in India**
