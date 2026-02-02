# Thiết kế Hệ thống Quản lý Khóa học (Course Management System)

Tài liệu này trình bày hai hướng tiếp cận phân chia mô-đun cho hệ thống Course Management: **Domain Decomposition** và **Technical Partitioning**.

---

## 1. Phân chia theo Domain Decomposition

Cách tiếp cận này tập trung vào các nghiệp vụ cụ thể của hệ thống. Mỗi mô-đun đại diện cho một phân vùng nghiệp vụ (Bounded Context) độc lập.

### Cấu trúc Project Spring Boot (Modular/Domain-Driven)

Cách tiếp cận này giúp cô lập các module nghiệp vụ, phù hợp với xu hướng Modular Monolith.

```text
src/main/java/com/cms/
├── common/                    # Cấu hình chung (Security, Swagger, Utils)
├── modules/
│   ├── course/                # Module Quản lý khóa học
│   │   ├── dto/               # Data Transfer Objects (Request/Response)
│   │   ├── entity/            # Spring Data JPA Entities
│   │   ├── repository/        # Spring Data Repositories
│   │   ├── service/           # Business Logic
│   │   └── web/               # RestControllers
│   ├── enrollment/            # Module Đăng ký học
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── service/
│   │   └── web/
│   ├── payment/               # Module Thanh toán
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── service/
│   │   └── web/
│   └── user/                  # Module Người dùng
│       ├── dto/
│       ├── entity/
│       ├── repository/
│       ├── service/
│       └── web/
└── CmsApplication.java        # Main class
```

### Chi tiết các Mô-đun:
- **User & Identity**: Quản lý thông tin người dùng, phân quyền (Giảng viên, Học viên, Admin).
- **Course Catalog**: Quản lý nội dung khóa học, bài giảng, tài liệu học tập.
- **Enrollment & Progress**: Quản lý việc đăng ký học, theo dõi tiến độ hoàn thành, cấp chứng chỉ.
- **Payment & Billing**: Xử lý giao dịch, hóa đơn và các chương trình khuyến mãi.
- **Notification**: Gửi thông báo qua email, tin nhắn hệ thống hoặc forum trao đổi.

---

## 2. Phân chia theo Technical Partitioning

Cách tiếp cận này phân chia hệ thống dựa trên các lớp kỹ thuật (Layered Architecture).

### Cấu trúc Project Spring Boot (Layered Architecture)

Đây là cấu trúc mặc định phổ biến cho các dự án Spring Boot quy mô nhỏ và trung bình.

```text
src/main/java/com/cms/
├── config/                # Cấu hình (WebConfig, SecurityConfig, v.v.)
├── controller/            # RestControllers (Xử lý HTTP Requests)
│   ├── CourseController.java
│   ├── EnrollmentController.java
│   ├── PaymentController.java
│   └── UserController.java
├── service/               # Interface & Service Implementation
│   ├── CourseService.java
│   ├── EnrollmentService.java
│   ├── PaymentService.java
│   └── UserService.java
├── repository/            # Tầng truy cập dữ liệu (Spring Data JPA)
│   ├── CourseRepository.java
│   ├── EnrollmentRepository.java
│   ├── PaymentRepository.java
│   └── UserRepository.java
├── entity/                # Các thực thể JPA (@Entity)
│   ├── Course.java
│   ├── Enrollment.java
│   ├── Payment.java
│   └── User.java
├── dto/                   # Data Transfer Objects
│   ├── CourseRequest.java
│   ├── CourseResponse.java
│   └── ...
├── exception/             # Xử lý lỗi toàn cục (@ControllerAdvice)
└── CmsApplication.java    # Main class
```

### Chi tiết các Lớp:
- **Presentation Layer**: Chịu trách nhiệm hiển thị giao diện người dùng hoặc cung cấp các Endpoint API.
- **Business Logic Layer**: Chứa toàn bộ các quy tắc nghiệp vụ (Business Rules) của hệ thống.
- **Data Access Layer**: Tương tác trực tiếp với cơ sở dữ liệu để thực hiện các thao tác CRUD.
- **Infrastructure Layer**: Cấu hình cơ sở dữ liệu, tích hợp dịch vụ bên thứ ba (như cổng thanh toán, gửi email).

---

## 3. So sánh và Giải thích sự khác biệt
![Domain Decomposition vs Technical Partitioning](<Domain Decomposition vs Technical Partitioning.png>)
Domain Decomposition vs Technical Partitioning
| Đặc điểm | Domain Decomposition | Technical Partitioning |
| :--- | :--- | :--- |
| **Trọng tâm** | Nghiệp vụ (Business Capabilities) | Công nghệ (Technical Layers/Conerns) |
| **Cấu trúc** | Phân chia theo "chiều dọc" (Vertical Slices) | Phân chia theo "chiều ngang" (Horizontal Layers) |
| **Tính đóng gói** | Cao. Một thay đổi nghiệp vụ thường chỉ nằm trong một mô-đun. | Trung bình. Một thay đổi nghiệp vụ thường đòi hỏi sửa đổi ở tất cả các lớp. |
| **Sự phụ thuộc** | Giữa các mô-đun nghiệp vụ (Loose Coupling). | Giữa các lớp kỹ thuật (Tight Coupling giữa các layer). |
| **Khả năng mở rộng** | Dễ dàng chuyển sang Microservices. | Khó khăn hơn khi hệ thống trở nên đồ sộ. |

**Tại sao kết quả khác nhau?**
- **Domain Decomposition** hướng tới việc giải quyết độ phức tạp của **Business Complexity**. Nó giúp các nhóm làm việc độc lập trên từng domain mà không ảnh hưởng lẫn nhau.
- **Technical Partitioning** hướng tới việc giải quyết **Technical Complexity** và tính tái sử dụng của mã nguồn (ví dụ: một Repository có thể được dùng bởi nhiều Service).

---

## 4. Quyết định chọn Kiến trúc Mô-đun

**Quyết định: Chọn Domain Decomposition.**

### Lý do lựa chọn:
1. **Khả năng Bảo trì (Maintainability)**: Hệ thống "Course Management" có các nghiệp vụ rất đặc thù (như tính toán tiến trình học tập khác với xử lý thanh toán). Phân chia theo Domain giúp cô lập lỗi và dễ dàng thay đổi logic nghiệp vụ mà không làm hỏng các phần khác.
2. **Khả năng Phát triển Song song**: Các nhóm phát triển có thể được chia theo Domain (ví dụ: Team Payment, Team Course Content). Họ có thể làm việc song song mà ít xảy ra xung đột code (Merge conflicts).
3. **Dễ dàng Mở rộng (Scalability)**: Nếu sau này mô-đun "Course Catalog" cần xử lý lượng truy cập cực lớn khi có khóa học hot, chúng ta có thể tách riêng nó ra thành một Microservice độc lập một cách dễ dàng.
4. **Phù hợp với xu hướng hiện đại**: Đa số các hệ thống lớn hiện nay đều áp dụng **Domain-Driven Design (DDD)** để đảm bảo code phản ánh đúng thực tế nghiệp vụ, giúp giao tiếp giữa Developer và Stakeholders trở nên thông suốt hơn.

---

*Deliverable cho bài tập thực hành Buổi 2 - Component-Based Thinking.*
