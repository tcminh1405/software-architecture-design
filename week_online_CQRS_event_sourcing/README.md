# Bài Tập CQRS – Software Architecture Design

Thư mục này chứa 2 bài tập thực hành pattern **CQRS (Command Query Responsibility Segregation)**.

---

## Cấu trúc thư mục

```
CQRS/
├── README.md
├── bai1-todo-cqrs/          # Bài 1: Todo App với CQRS thuần
└── bai2-order-cqrs-events/  # Bài 2: Order System với CQRS + Events
```

---

## 🧩 Bài 1: Todo App với CQRS

**Port:** `3001` | **Chạy:** `cd bai1-todo-cqrs && npm run dev`

### Cấu trúc dự án

```
src/
├── domain/
│   └── todo.entity.ts          # Domain model (Todo, TodoStatus)
├── infrastructure/
│   ├── todo.write-store.ts     # Write Store (in-memory, Write side)
│   └── todo.read-store.ts      # Read Store (denormalized, Query side)
├── commands/
│   ├── todo.commands.ts        # Định nghĩa Commands
│   └── todo.command-handler.ts # Xử lý Write operations
├── queries/
│   ├── todo.queries.ts         # Định nghĩa Queries
│   └── todo.query-handler.ts  # Xử lý Read operations
├── controllers/
│   └── todo.controller.ts      # Express routes
└── index.ts                    # Entry point
```

### API Endpoints

| Side | Method | URL | Mô tả |
|------|--------|-----|-------|
| **COMMAND** | `POST` | `/todos` | Tạo todo mới |
| **COMMAND** | `PUT` | `/todos/:id` | Cập nhật todo |
| **COMMAND** | `DELETE` | `/todos/:id` | Xoá todo |
| **QUERY** | `GET` | `/todos` | Lấy danh sách (filter: `?status=`) |
| **QUERY** | `GET` | `/todos/:id` | Xem chi tiết |

---

## 🧩 Bài 2: Order System với CQRS + Events

**Port:** `3002` | **Chạy:** `cd bai2-order-cqrs-events && npm run dev`

### Cấu trúc dự án

```
src/
├── domain/
│   ├── order.entity.ts                    # Domain model (Order, OrderItem)
│   └── events/
│       ├── base.event.ts                  # DomainEvent interface
│       ├── order-created.event.ts         # Event: OrderCreated
│       └── order-cancelled.event.ts       # Event: OrderCancelled
├── infrastructure/
│   ├── event-bus.ts                       # In-process EventBus (pub/sub)
│   ├── order.write-store.ts              # Write Store
│   └── order.read-store.ts               # Read Store (denormalized)
├── application/
│   └── order.event-handlers.ts           # Subscribe & sync ReadStore
├── commands/
│   ├── order.commands.ts                 # Command definitions
│   └── order.command-handler.ts          # Write + publish events
├── queries/
│   ├── order.queries.ts                  # Query definitions
│   └── order.query-handler.ts           # Read từ ReadStore
├── controllers/
│   └── order.controller.ts              # Express routes
└── index.ts                              # Entry point
```
