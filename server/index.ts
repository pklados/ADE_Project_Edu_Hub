import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();

// CORS middleware - must be first
app.use(cors());

app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'academic_auth',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Initialize database tables
async function initDB() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        userId VARCHAR(255) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables initialized');
  } finally {
    connection.release();
  }
}

// User endpoints
app.post('/api/users', async (req: Request, res: Response) => {
  try {
    const { id, email, name, password, createdAt } = req.body;
    console.log(`[POST] /api/users - Received:`, { id, email, name, password, createdAt });
    const connection = await pool.getConnection();
    try {
      await connection.query(
        'INSERT INTO users (id, email, name, password, createdAt) VALUES (?, ?, ?, ?, ?)',
        [id, email, name, password, createdAt]
      );
      console.log(`  ✅ User created successfully`);
      res.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('[ERROR] POST /api/users:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/users/email/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    console.log(`[GET] /api/users/email/${email}`);
    const connection = await pool.getConnection();
    try {
      const [rows]: any = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      console.log(`  Result:`, rows[0] || 'null');
      res.json(rows[0] || null);
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('[ERROR] GET /api/users/email:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/users/id/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
      const [rows]: any = await connection.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      res.json(rows[0] || null);
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('Error fetching user by id:', error);
    res.status(400).json({ error: error.message });
  }
});

// Course endpoints
app.post('/api/courses', async (req: Request, res: Response) => {
  try {
    const { id, title, description, userId, createdAt } = req.body;
    const connection = await pool.getConnection();
    try {
      await connection.query(
        'INSERT INTO courses (id, title, description, userId, createdAt) VALUES (?, ?, ?, ?, ?)',
        [id, title, description, userId, createdAt]
      );
      res.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('Error creating course:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/courses/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const connection = await pool.getConnection();
    try {
      const [rows]: any = await connection.query(
        'SELECT * FROM courses WHERE userId = ?',
        [userId]
      );
      res.json(rows);
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    res.status(400).json({ error: error.message });
  }
});

// Export database (for debugging)
app.get('/api/export', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [users]: any = await connection.query('SELECT * FROM users');
      const [courses]: any = await connection.query('SELECT * FROM courses');
      res.json({ users, courses });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('Error exporting database:', error);
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5050;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
