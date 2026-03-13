const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function initUsers() {
  try {
    // Check if users already exist
    const [users] = await db.query('SELECT COUNT(*) as count FROM users');
    
    if (users[0].count > 0) {
      console.log('Users already exist, skipping initialization');
      return;
    }

    console.log('Initializing default users...');

    // Generate password hash for 'admin123'
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Insert default users
    await db.query(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      ['admin', passwordHash, 'Admin']
    );
    await db.query(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      ['editor', passwordHash, 'Editor']
    );
    await db.query(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      ['viewer', passwordHash, 'Viewer']
    );

    console.log('✅ Default users created successfully!');
    console.log('   - admin/admin123 (Admin)');
    console.log('   - editor/admin123 (Editor)');
    console.log('   - viewer/admin123 (Viewer)');

  } catch (error) {
    console.error('❌ Error initializing users:', error.message);
  }
}

module.exports = initUsers;
