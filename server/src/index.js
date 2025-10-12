import express from 'express';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import cors from 'cors'; // Import the cors package
import crypto from 'crypto';

const app = express();
const port = process.env.PORT || 8080;

// --- MIDDLEWARE SETUP ---
app.use(cors({
  origin: 'http://localhost:5173' // Allow requests from your React app
}));
app.use(express.json()); // To parse JSON request bodies

// --- Configuration ---
const DB_CONFIG = {
  host: process.env.DB_HOST || 'db',
  port: +(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'apppassword', // <-- IMPORTANT: USE YOUR REAL MYSQL PASSWORD
  database: process.env.DB_NAME || 'fastbudget',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// --- Database Connection ---
let pool;

// --- Routes ---
app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Server is healthy' });
});

app.post('/api/auth/signup', async (req, res) => {
  console.log('--- SIGNUP ROUTE HIT ---');
  console.log('Request Body:', req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    console.log('Inserting user into the database...');
    const [rows] = await pool.query('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, passwordHash]);
    const userId = rows.insertId;
    console.log(`User created with ID: ${userId}`);

    const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET || 'supersecretjwt', { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: userId, name, email } });

  } catch (error) {
    console.error('!!! SIGNUP ERROR !!!', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  console.log('--- LOGIN ROUTE HIT ---');
  console.log('Request Body:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.query('SELECT id, name, email, password_hash FROM users WHERE email=?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'supersecretjwt', { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });

  } catch (error) {
    console.error('!!! LOGIN ERROR !!!', error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            // Respond kindly even if user not found, to prevent email enumeration
            return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }
        const user = rows[0];

        // 1. Generate a secure, random token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // 2. Set an expiration date (e.g., 10 minutes from now)
        const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

        // 3. Save the hashed token and expiry date to the database
        await pool.query(
            'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?',
            [passwordResetToken, passwordResetExpires, user.id]
        );

        // 4. Send the email (this is a placeholder, setup is in the next step)
        const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
        console.log('Password Reset URL:', resetURL); // For debugging
        // await sendPasswordResetEmail(user.email, resetURL);

        res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

    } catch (error) {
        console.error('!!! FORGOT PASSWORD ERROR !!!', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
});


// ROUTE 2: RESET THE PASSWORD
app.post('/api/auth/reset-password/:token', async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    // 1. Hash the incoming token so we can find it in the DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
        // 2. Find the user by the hashed token and check if it's expired
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE password_reset_token = ? AND password_reset_expires > NOW()',
            [hashedToken]
        );

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
        }
        const user = rows[0];

        // 3. Hash the new password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 4. Update the user's password and clear the reset token fields
        await pool.query(
            'UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?',
            [passwordHash, user.id]
        );

        res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error('!!! RESET PASSWORD ERROR !!!', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
});


// --- Server Startup ---
const startServer = async () => {
  try {
    console.log('Connecting to the database...');
    pool = mysql.createPool(DB_CONFIG);
    await pool.query('SELECT 1'); // Test connection
    console.log('Database connection successful.');

    app.listen(port, () => {
      console.log(`API listening on ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
