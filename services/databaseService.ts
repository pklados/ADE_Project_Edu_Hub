import initSqlJs from 'sql.js';

// Initialize SQLite database
let SQL: any;
let db: any;

const initDB = async () => {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
    });
  }

  // Load database from localStorage if exists
  const savedDbData = localStorage.getItem('sqlite_db');
  if (savedDbData) {
    const dbArray = new Uint8Array(JSON.parse(savedDbData));
    db = new SQL.Database(dbArray);
  } else {
    db = new SQL.Database();
    // Create tables
    db.run(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        password TEXT,
        createdAt TEXT
      )
    `);
    db.run(`
      CREATE TABLE courses (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        userId TEXT,
        createdAt TEXT,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
  }
};

// Save database to localStorage
const saveDB = () => {
  if (db) {
    const data = db.export();
    const buffer = Array.from(data);
    localStorage.setItem('sqlite_db', JSON.stringify(buffer));
  }
};

// User operations
export const createUser = async (user: { id: string; email: string; name: string; password: string; createdAt: string }) => {
  await initDB();
  const stmt = db.prepare('INSERT INTO users (id, email, name, password, createdAt) VALUES (?, ?, ?, ?, ?)');
  stmt.run([user.id, user.email, user.name, user.password, user.createdAt]);
  stmt.free();
  saveDB();
};

export const getUserByEmail = async (email: string) => {
  await initDB();
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const result = stmt.getAsObject([email]);
  stmt.free();
  return result.id ? result : null;
};

export const getUserById = async (id: string) => {
  await initDB();
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const result = stmt.getAsObject([id]);
  stmt.free();
  return result.id ? result : null;
};

// Course operations (placeholder)
export const getCoursesByUserId = async (userId: string) => {
  await initDB();
  const stmt = db.prepare('SELECT * FROM courses WHERE userId = ?');
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
};

export const createCourse = async (course: { id: string; title: string; description: string; userId: string; createdAt: string }) => {
  await initDB();
  const stmt = db.prepare('INSERT INTO courses (id, title, description, userId, createdAt) VALUES (?, ?, ?, ?, ?)');
  stmt.run([course.id, course.title, course.description, course.userId, course.createdAt]);
  stmt.free();
  saveDB();
};

// Export database contents for viewing
export const exportDatabase = async () => {
  await initDB();
  const users = [];
  const stmt = db.prepare('SELECT * FROM users');
  while (stmt.step()) {
    users.push(stmt.getAsObject());
  }
  stmt.free();

  const courses = [];
  const stmt2 = db.prepare('SELECT * FROM courses');
  while (stmt2.step()) {
    courses.push(stmt2.getAsObject());
  }
  stmt2.free();

  return { users, courses };
};

// Attach to window for console access
if (typeof window !== 'undefined') {
  (window as any).exportDatabase = exportDatabase;
}