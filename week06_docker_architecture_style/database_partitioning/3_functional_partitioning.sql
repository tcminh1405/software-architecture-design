-- ============================================================
-- 3. FUNCTIONAL PARTITIONING (Phân mảnh theo chức năng)
-- Ý tưởng: Chia dữ liệu theo MỤC ĐÍCH SỬ DỤNG / LOGIC NGHIỆP VỤ
-- Ví dụ: Tách Orders đang xử lý (hot) vs Orders lịch sử (cold/archive)
-- ============================================================

USE PartitionDemo;
GO

-- -------------------------------------------------------
-- Bảng gốc (chưa partition) - chứa tất cả đơn hàng
-- Vấn đề: bảng ngày càng lớn, query chậm dù chỉ cần đơn hàng mới
-- -------------------------------------------------------
IF OBJECT_ID('dbo.Orders_All', 'U') IS NOT NULL DROP TABLE dbo.Orders_All;
CREATE TABLE Orders_All (
    OrderID    INT IDENTITY(1,1) PRIMARY KEY,
    OrderDate  DATETIME DEFAULT GETDATE(),
    CustomerID INT          NOT NULL,
    Amount     DECIMAL(10,2),
    Status     NVARCHAR(20) NOT NULL  -- 'New','Processing','Completed','Cancelled'
);

-- -------------------------------------------------------
-- Sau khi Functional Partition: tách thành 2 bảng theo chức năng
-- -------------------------------------------------------

-- Bảng HOT: đơn hàng đang hoạt động (thường xuyên đọc/ghi)
IF OBJECT_ID('dbo.Orders_Active', 'U') IS NOT NULL DROP TABLE dbo.Orders_Active;
CREATE TABLE Orders_Active (
    OrderID    INT IDENTITY(1,1) PRIMARY KEY,
    OrderDate  DATETIME DEFAULT GETDATE(),
    CustomerID INT          NOT NULL,
    Amount     DECIMAL(10,2),
    Status     NVARCHAR(20) NOT NULL CHECK (Status IN ('New', 'Processing'))
);

-- Bảng COLD: đơn hàng lịch sử (ít đọc, có thể lưu trên disk rẻ hơn)
IF OBJECT_ID('dbo.Orders_History', 'U') IS NOT NULL DROP TABLE dbo.Orders_History;
CREATE TABLE Orders_History (
    OrderID    INT PRIMARY KEY,       -- Không dùng IDENTITY, giữ nguyên ID gốc
    OrderDate  DATETIME,
    CustomerID INT          NOT NULL,
    Amount     DECIMAL(10,2),
    Status     NVARCHAR(20) NOT NULL CHECK (Status IN ('Completed', 'Cancelled')),
    ArchivedAt DATETIME DEFAULT GETDATE()
);

-- -------------------------------------------------------
-- Stored Procedure: Archive đơn hàng hoàn tất sang History
-- Đây là "functional routing" - tự động chuyển data theo trạng thái
-- -------------------------------------------------------
GO
CREATE OR ALTER PROCEDURE sp_ArchiveCompletedOrders
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Chuyển đơn hàng Completed/Cancelled sang bảng History
        INSERT INTO Orders_History (OrderID, OrderDate, CustomerID, Amount, Status)
        SELECT OrderID, OrderDate, CustomerID, Amount, Status
        FROM Orders_Active
        WHERE Status IN ('Completed', 'Cancelled');

        -- Xóa khỏi bảng Active sau khi đã archive
        DELETE FROM Orders_Active WHERE Status IN ('Completed', 'Cancelled');

        COMMIT;
        PRINT 'Archive thành công!';
    END TRY
    BEGIN CATCH
        ROLLBACK;
        PRINT 'Lỗi: ' + ERROR_MESSAGE();
    END CATCH
END;
GO

-- -------------------------------------------------------
-- Insert dữ liệu mẫu
-- -------------------------------------------------------
INSERT INTO Orders_Active (CustomerID, Amount, Status) VALUES
    (101, 250000, 'New'),
    (102, 180000, 'Processing'),
    (103, 320000, 'Completed'),   -- Sẽ được archive
    (104,  95000, 'Cancelled'),   -- Sẽ được archive
    (105, 410000, 'New');

-- Xem trước khi archive
SELECT 'TRƯỚC ARCHIVE' AS TrangThai, * FROM Orders_Active;

-- Chạy archive
EXEC sp_ArchiveCompletedOrders;

-- Xem sau khi archive
SELECT 'Orders_Active (HOT - đang xử lý)' AS Partition, * FROM Orders_Active;
SELECT 'Orders_History (COLD - lịch sử)'  AS Partition, * FROM Orders_History;

-- -------------------------------------------------------
-- Lợi ích về performance:
-- Query đơn hàng đang xử lý chỉ scan Orders_Active (nhỏ)
-- thay vì scan toàn bộ Orders_All (ngày càng lớn theo thời gian)
-- -------------------------------------------------------
SELECT * FROM Orders_Active WHERE Status = 'New';       -- Nhanh: bảng nhỏ
-- SELECT * FROM Orders_All WHERE Status = 'New';       -- Chậm: bảng lớn
