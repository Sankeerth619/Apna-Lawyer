import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'lexai-secret-key-2026';
const PORT = 3000;

// Database Setup
const db = new Database('defender.db');

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    case_type TEXT,
    severity TEXT,
    question TEXT,
    analysis_json TEXT,
    next_step TEXT,
    expected_hearing TEXT,
    reminder_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    case_id INTEGER,
    doc_type TEXT,
    content TEXT,
    pdf_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (case_id) REFERENCES cases(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT,
    rating INTEGER,
    text TEXT,
    is_verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Reviews if empty
const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get() as { count: number };
if (reviewCount.count === 0) {
  const seedReviews = [
    ['Aarav Sharma', 5, 'Apna-Lawyer helped me understand my rights after a workplace dispute. Truly revolutionary.', 1],
    ['Priya Patel', 4, 'The FIR generator is so easy to use. Saved me hours of stress.', 1],
    ['Vikram Singh', 5, 'Futuristic interface and very accurate legal guidance.', 1],
    ['Ananya Iyer', 5, 'Finally, a way to get legal help without spending a fortune.', 1],
    ['Rahul Verma', 4, 'Great tool, though I wish it covered more local laws.', 0],
    ['Sanya Gupta', 5, 'The document analysis feature is a lifesaver for complex contracts.', 1],
    ['Ishaan Reddy', 5, 'Highly recommended for anyone feeling lost in the legal system.', 1],
    ['Meera Das', 4, 'Fast, efficient, and very professional results.', 1]
  ];
  const insertReview = db.prepare('INSERT INTO reviews (user_name, rating, text, is_verified) VALUES (?, ?, ?, ?)');
  seedReviews.forEach(r => insertReview.run(...r));
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // Auth
  app.post('/api/auth/register', async (req, res) => {
    const { full_name, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare('INSERT INTO users (full_name, email, hashed_password) VALUES (?, ?, ?)');
      const result = stmt.run(full_name, email, hashedPassword);
      const token = jwt.sign({ id: result.lastInsertRowid, email, full_name }, JWT_SECRET);
      res.json({ token, user: { id: result.lastInsertRowid, full_name, email } });
    } catch (e: any) {
      res.status(400).json({ error: e.message.includes('UNIQUE') ? 'Email already exists' : 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user || !(await bcrypt.hash(password, 10) && await bcrypt.compare(password, user.hashed_password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, full_name: user.full_name }, JWT_SECRET);
    res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email } });
  });

  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    res.json(req.user);
  });

  // Cases
  app.post('/api/cases', authenticateToken, (req: any, res) => {
    const { case_type, severity, question, analysis_json, next_step, expected_hearing, reminder_date } = req.body;
    const stmt = db.prepare(`
      INSERT INTO cases (user_id, case_type, severity, question, analysis_json, next_step, expected_hearing, reminder_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(req.user.id, case_type, severity, question, JSON.stringify(analysis_json), next_step, expected_hearing, reminder_date);
    res.json({ id: result.lastInsertRowid });
  });

  app.get('/api/cases/my-cases', authenticateToken, (req: any, res) => {
    const cases = db.prepare('SELECT * FROM cases WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(cases.map((c: any) => ({ ...c, analysis_json: JSON.parse(c.analysis_json) })));
  });

  app.delete('/api/cases/:id', authenticateToken, (req: any, res) => {
    db.prepare('DELETE FROM cases WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ success: true });
  });

  // Reviews
  app.get('/api/reviews', (req, res) => {
    const reviews = db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
    res.json(reviews);
  });

  app.post('/api/reviews', (req, res) => {
    const { user_name, rating, text } = req.body;
    const stmt = db.prepare('INSERT INTO reviews (user_name, rating, text) VALUES (?, ?, ?)');
    const result = stmt.run(user_name, rating, text);
    res.json({ id: result.lastInsertRowid });
  });

  // Contact
  app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    const stmt = db.prepare('INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)');
    db.prepare('INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)').run(name, email, subject, message);
    res.json({ success: true });
  });

  // Documents
  app.post('/api/documents', authenticateToken, (req: any, res) => {
    const { case_id, doc_type, content } = req.body;
    const stmt = db.prepare('INSERT INTO documents (user_id, case_id, doc_type, content) VALUES (?, ?, ?, ?)');
    const result = stmt.run(req.user.id, case_id, doc_type, content);
    res.json({ id: result.lastInsertRowid });
  });

  app.get('/api/documents/my-documents', authenticateToken, (req: any, res) => {
    const docs = db.prepare('SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(docs);
  });

  // --- Vite Setup ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
