-- ============================================================
-- 1. HORIZONTAL PARTITIONING (Phân mảnh ngang)
-- Ý tưởng: Chia bảng lớn thành nhiều bảng nhỏ hơn theo HÀNG
-- Điều kiện phân vùng: Giới tính (Nam -> table_user_01, Nữ -> table_user_02)
-- ============================================================

USE master;
GO
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'PartitionDemo')
    CREATE DATABASE PartitionDemo;
GO
USE PartitionDemo;
GO

-- -------------------------------------------------------
-- Bảng gốc (chưa partition) - dùng để so sánh performance
-- -------------------------------------------------------
IF OBJECT_ID('dbo.Users_All', 'U') IS NOT NULL DROP TABLE dbo.Users_All;
CREATE TABLE Users_All (
    UserID   INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50)  NOT NULL,
    Gender   NVARCHAR(10)  NOT NULL CHECK (Gender IN (N'Nam', N'Nữ')),
    Email    NVARCHAR(100) NOT NULL,
    Age      INT
);

-- -------------------------------------------------------
-- Sau khi Horizontal Partition: tách thành 2 bảng theo giới tính
-- -------------------------------------------------------
IF OBJECT_ID('dbo.table_user_01', 'U') IS NOT NULL DROP TABLE dbo.table_user_01;
CREATE TABLE table_user_01 (                          -- Partition cho Nam
    UserID   INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50)  NOT NULL,
    Gender   NVARCHAR(10)  NOT NULL DEFAULT N'Nam' CHECK (Gender = N'Nam'),
    Email    NVARCHAR(100) NOT NULL,
    Age      INT
);

IF OBJECT_ID('dbo.table_user_02', 'U') IS NOT NULL DROP TABLE dbo.table_user_02;
CREATE TABLE table_user_02 (                          -- Partition cho Nữ
    UserID   INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50)  NOT NULL,
    Gender   NVARCHAR(10)  NOT NULL DEFAULT N'Nữ' CHECK (Gender = N'Nữ'),
    Email    NVARCHAR(100) NOT NULL,
    Age      INT
);

-- -------------------------------------------------------
-- Stored Procedure: Routing tự động (thay thế logic ở tầng App)
-- Tương đương: if gender == "Nam" -> insert table_user_01
-- -------------------------------------------------------
GO
CREATE OR ALTER PROCEDURE sp_InsertUser
    @Username NVARCHAR(50),
    @Gender   NVARCHAR(10),
    @Email    NVARCHAR(100),
    @Age      INT
AS
BEGIN
    IF @Gender = N'Nam'
        INSERT INTO table_user_01 (Username, Gender, Email, Age)
        VALUES (@Username, @Gender, @Email, @Age);
    ELSE IF @Gender = N'Nữ'
        INSERT INTO table_user_02 (Username, Gender, Email, Age)
        VALUES (@Username, @Gender, @Email, @Age);
    ELSE
        RAISERROR('Gender không hợp lệ. Chỉ chấp nhận Nam hoặc Nữ.', 16, 1);
END;
GO

-- -------------------------------------------------------
-- Insert dữ liệu mẫu qua Stored Procedure
-- -------------------------------------------------------
EXEC sp_InsertUser N'Nguyễn Văn An',   N'Nam', N'an@email.com',   22;
EXEC sp_InsertUser N'Trần Thị Bình',   N'Nữ',  N'binh@email.com', 25;
EXEC sp_InsertUser N'Lê Văn Cường',    N'Nam', N'cuong@email.com', 30;
EXEC sp_InsertUser N'Phạm Thị Dung',   N'Nữ',  N'dung@email.com', 28;
EXEC sp_InsertUser N'Hoàng Văn Em',    N'Nam', N'em@email.com',   35;

-- -------------------------------------------------------
-- Kiểm tra kết quả: dữ liệu đã được route đúng bảng
-- -------------------------------------------------------
SELECT 'table_user_01 (Nam)' AS Partition, * FROM table_user_01;
SELECT 'table_user_02 (Nữ)' AS Partition, * FROM table_user_02;

-- -------------------------------------------------------
-- So sánh performance: Query trên bảng gốc vs partition
-- Khi data lớn, query trên table_user_01 nhanh hơn vì
-- chỉ scan 1/2 số rows so với Users_All
-- -------------------------------------------------------
-- Bảng gốc: phải scan toàn bộ
SELECT * FROM Users_All WHERE Gender = N'Nam';

-- Sau partition: chỉ scan table_user_01 (nhỏ hơn ~50%)
SELECT * FROM table_user_01;
