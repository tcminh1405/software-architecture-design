import express from 'express';
import './application/order.event-handlers';
import { orderRouter } from './controllers/order.controller';

import path from 'path';

const app = express();
const PORT = 3002;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public'))); 
app.use('/orders', orderRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Order System CQRS + Events (Bài 2)',
    available_endpoints: {
      getAll: 'GET /orders',
      getById: 'GET /orders/:id',
      create: 'POST /orders',
      cancel: 'DELETE /orders/:id',
      events_log: 'GET /orders (handled via Event Bus)'
    }
  });
});

app.listen(PORT, () => {
  console.log('==============================================');
  console.log(`🚀 BÀI 2: ORDER SYSTEM CQRS + EVENTS đang chạy:`);
  console.log(`   http://localhost:${PORT}`);
  console.log('==============================================');
  console.log('📦 ENDPOINTS ĐỂ TEST:');
  console.log(`👉 [GET]    http://localhost:${PORT}/orders (Danh sách đơn hàng)`);
  console.log(`👉 [POST]   http://localhost:${PORT}/orders (Tạo đơn hàng mới)`);
  console.log(`👉 [DELETE] http://localhost:${PORT}/orders/{id} (Hủy đơn hàng)`);
  console.log('==============================================');
});
