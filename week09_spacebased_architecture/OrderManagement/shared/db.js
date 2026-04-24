const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/sba_db'
});

async function initDB() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id UUID PRIMARY KEY,
                customer_name TEXT NOT NULL,
                total_amount DECIMAL(10, 2) NOT NULL,
                status TEXT DEFAULT 'PENDING',
                items JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Cơ sở dữ liệu Đơn hàng đã được khởi tạo');
    } finally {
        client.release();
    }
}

module.exports = { pool, initDB };
