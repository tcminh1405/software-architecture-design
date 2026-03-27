-- ============================================================
-- 2. VERTICAL PARTITIONING (Phân mảnh dọc)
-- Ý tưởng: Chia bảng lớn thành nhiều bảng nhỏ hơn theo CỘT
-- Tách cột hay dùng (hot) ra khỏi cột ít dùng (cold/heavy)
-- ============================================================

USE PartitionDemo;
GO

-- -------------------------------------------------------
-- Bảng gốc (chưa partition) - chứa tất cả cột
-- Vấn đề: mỗi lần SELECT username/email phải load cả Avatar (nặng)
-- -------------------------------------------------------
IF OBJECT_ID('dbo.UserProfile_Full', 'U') IS NOT NULL DROP TABLE dbo.UserProfile_Full;
CREATE TABLE UserProfile_Full (
    UserID   INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50),          -- HOT: dùng thường xuyên
    Email    NVARCHAR(100),         -- HOT: dùng thường xuyên
    Bio      NVARCHAR(MAX),         -- COLD: ít dùng
    Address  NVARCHAR(200),         -- COLD: ít dùng
    Avatar   VARBINARY(MAX)         -- COLD: rất nặng, ít dùng
);

-- -------------------------------------------------------
-- Sau khi Vertical Partition: tách thành 2 bảng
-- -------------------------------------------------------

-- Bảng HOT: thông tin cơ bản, truy cập thường xuyên -> nhỏ, nhanh
IF OBJECT_ID('dbo.UserProfile_Basic', 'U') IS NOT NULL DROP TABLE dbo.UserProfile_Basic;
CREATE TABLE UserProfile_Basic (
    UserID   INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50)  NOT NULL,
    Email    NVARCHAR(100) NOT NULL
);

-- Bảng COLD: thông tin chi tiết, chỉ load khi cần -> tách riêng
IF OBJECT_ID('dbo.UserProfile_Details', 'U') IS NOT NULL DROP TABLE dbo.UserProfile_Details;
CREATE TABLE UserProfile_Details (
    UserID  INT PRIMARY KEY REFERENCES UserProfile_Basic(UserID),
    Bio     NVARCHAR(MAX),
    Address NVARCHAR(200),
    Avatar  VARBINARY(MAX)   -- Lưu ảnh dạng binary (hoặc lưu URL)
);

-- -------------------------------------------------------
-- Insert dữ liệu mẫu
-- -------------------------------------------------------
INSERT INTO UserProfile_Basic (Username, Email) VALUES
    (N'Nguyễn Văn An',  N'an@email.com'),
    (N'Trần Thị Bình',  N'binh@email.com'),
    (N'Lê Văn Cường',   N'cuong@email.com');

INSERT INTO UserProfile_Details (UserID, Bio, Address, Avatar) VALUES
    (1, N'Lập trình viên Backend', N'Hà Nội',    NULL),
    (2, N'Designer UI/UX',         N'TP.HCM',    NULL),
    (3, N'DevOps Engineer',        N'Đà Nẵng',   NULL);

-- -------------------------------------------------------
-- So sánh performance
-- -------------------------------------------------------

-- TRƯỚC partition: SELECT đơn giản nhưng phải load cả Avatar (VARBINARY nặng)
-- SQL Server phải đọc nhiều data pages hơn
SELECT UserID, Username, Email FROM UserProfile_Full;

-- SAU partition: chỉ đọc bảng nhỏ UserProfile_Basic
-- Ít data pages hơn -> Buffer Pool hiệu quả hơn -> NHANH HƠN
SELECT UserID, Username, Email FROM UserProfile_Basic;

-- Khi cần thông tin đầy đủ: JOIN 2 bảng (chỉ khi thực sự cần)
SELECT b.UserID, b.Username, b.Email, d.Bio, d.Address
FROM UserProfile_Basic b
JOIN UserProfile_Details d ON b.UserID = d.UserID;
