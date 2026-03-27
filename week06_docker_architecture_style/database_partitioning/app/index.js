const express = require('express');
const { getPool, sql } = require('./db');
const app = express();
app.use(express.json());

// ============================================================
// 1. HORIZONTAL PARTITIONING - Routing theo giới tính
//    Nam  -> table_user_01
//    Nữ   -> table_user_02
// ============================================================
app.post('/users', async (req, res) => {
  const { username, gender, email, age } = req.body;
  try {
    const pool = await getPool();
    // Routing logic: tương đương if/else trong Spring Boot Service
    await pool.request()
      .input('Username', sql.NVarChar, username)
      .input('Gender',   sql.NVarChar, gender)
      .input('Email',    sql.NVarChar, email)
      .input('Age',      sql.Int,      age)
      .execute('sp_InsertUser');  // SP tự route vào đúng bảng

    const table = gender === 'Nam' ? 'table_user_01' : 'table_user_02';
    res.json({ message: `Đã insert vào ${table}`, data: req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy users theo giới tính - chỉ query đúng partition
app.get('/users/:gender', async (req, res) => {
  const { gender } = req.params;
  const table = gender === 'Nam' ? 'table_user_01' : 'table_user_02';
  try {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM ${table}`);
    res.json({ partition: table, count: result.recordset.length, data: result.recordset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// 2. VERTICAL PARTITIONING - Chỉ load cột cần thiết
// ============================================================
// Lấy thông tin cơ bản (HOT) - không load Bio/Avatar
app.get('/profiles/basic', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM UserProfile_Basic');
    res.json({ table: 'UserProfile_Basic (HOT)', data: result.recordset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy thông tin đầy đủ khi thực sự cần (JOIN 2 bảng)
app.get('/profiles/full/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('UserID', sql.Int, req.params.id)
      .query(`SELECT b.*, d.Bio, d.Address
              FROM UserProfile_Basic b
              JOIN UserProfile_Details d ON b.UserID = d.UserID
              WHERE b.UserID = @UserID`);
    res.json({ data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// 3. FUNCTIONAL PARTITIONING - Archive đơn hàng hoàn tất
// ============================================================
app.post('/orders', async (req, res) => {
  const { customerID, amount } = req.body;
  try {
    const pool = await getPool();
    await pool.request()
      .input('CustomerID', sql.Int,          customerID)
      .input('Amount',     sql.Decimal(10,2), amount)
      .input('Status',     sql.NVarChar,      'New')
      .query('INSERT INTO Orders_Active (CustomerID, Amount, Status) VALUES (@CustomerID, @Amount, @Status)');
    res.json({ message: 'Đơn hàng mới đã tạo trong Orders_Active' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Trigger archive: chuyển Completed/Cancelled sang History
app.post('/orders/archive', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request().execute('sp_ArchiveCompletedOrders');
    const active  = await pool.request().query('SELECT COUNT(*) AS cnt FROM Orders_Active');
    const history = await pool.request().query('SELECT COUNT(*) AS cnt FROM Orders_History');
    res.json({
      message: 'Archive thành công',
      Orders_Active:  active.recordset[0].cnt,
      Orders_History: history.recordset[0].cnt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server chạy tại http://localhost:3000'));
