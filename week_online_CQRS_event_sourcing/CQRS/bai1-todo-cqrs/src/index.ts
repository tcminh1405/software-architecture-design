import express from 'express';
import { todoRouter } from './controllers/todo.controller';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use('/todos', todoRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Todo CQRS API (Bài 1)',
    available_endpoints: {
      getAll: 'GET /todos',
      getById: 'GET /todos/:id',
      create: 'POST /todos',
      update: 'PUT /todos/:id',
      delete: 'DELETE /todos/:id'
    }
  });
});

app.listen(PORT, () => {
  console.log('==============================================');
  console.log(`🚀 BÀI 1: TODO CQRS đang chạy tại:`);
  console.log(`   http://localhost:${PORT}`);
  console.log('==============================================');
  console.log('📝 ENDPOINTS ĐỂ TEST:');
  console.log(`👉 [GET]    http://localhost:${PORT}/todos (Lấy danh sách)`);
  console.log(`👉 [POST]   http://localhost:${PORT}/todos (Tạo mới)`);
  console.log(`👉 [PUT]    http://localhost:${PORT}/todos/{id} (Cập nhật)`);
  console.log(`👉 [DELETE] http://localhost:${PORT}/todos/{id} (Xóa)`);
  console.log('==============================================');
});
