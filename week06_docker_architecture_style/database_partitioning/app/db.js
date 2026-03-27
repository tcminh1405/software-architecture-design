const sql = require('mssql');

const config = {
  server:   process.env.DB_SERVER   || 'localhost',
  database: process.env.DB_NAME     || 'PartitionDemo',
  options:  { encrypt: false, trustServerCertificate: true },
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER     || 'sa',
      password: process.env.DB_PASSWORD || 'YourPassword123!'
    }
  }
};

let pool;
const getPool = async () => {
  if (!pool) pool = await sql.connect(config);
  return pool;
};

module.exports = { getPool, sql };
