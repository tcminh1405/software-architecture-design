const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'cms_db'
  });

  try {
    console.log('Connected to database');

    // Generate password hash for 'admin123'
    const passwordHash = await bcrypt.hash('admin123', 10);
    console.log('Generated password hash:', passwordHash);

    // Delete existing users
    await connection.query('DELETE FROM users');
    console.log('Cleared existing users');

    // Insert users with correct hash
    await connection.query(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      ['admin', passwordHash, 'Admin']
    );
    await connection.query(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      ['editor', passwordHash, 'Editor']
    );
    await connection.query(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      ['viewer', passwordHash, 'Viewer']
    );

    console.log('Users seeded successfully!');
    console.log('Login with: admin/admin123, editor/admin123, viewer/admin123');

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await connection.end();
  }
}

seedUsers();
