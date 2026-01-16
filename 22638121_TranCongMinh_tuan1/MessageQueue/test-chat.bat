@echo off
REM Script test ứng dụng chat qua console cho Windows
REM Sử dụng: test-chat.bat

set PRODUCER_URL=http://localhost:8080
set CONSUMER_URL=http://localhost:8081

echo ==========================================
echo   TEST CHAT APPLICATION - CONSOLE
echo ==========================================
echo.

REM Kiểm tra service producer
echo 1. Kiểm tra Service Producer...
curl -s %PRODUCER_URL%/api/chat/status
if errorlevel 1 (
    echo    ✗ Service Producer không khả dụng!
    exit /b 1
)
echo.

REM Kiểm tra service consumer
echo 2. Kiểm tra Service Consumer...
curl -s %CONSUMER_URL%/api/chat/status
if errorlevel 1 (
    echo    ✗ Service Consumer không khả dụng!
    exit /b 1
)
echo.

echo 3. Gửi tin nhắn test...
echo.

REM Gửi tin nhắn 1
echo Gửi tin nhắn từ User1...
curl -s -X POST %PRODUCER_URL%/api/chat/send -H "Content-Type: application/json" -d "{\"sender\":\"User1\",\"content\":\"Xin chào mọi người!\"}"
timeout /t 1 /nobreak >nul

REM Gửi tin nhắn 2
echo Gửi tin nhắn từ User2...
curl -s -X POST %PRODUCER_URL%/api/chat/send -H "Content-Type: application/json" -d "{\"sender\":\"User2\",\"content\":\"Chào bạn! Bạn khỏe không?\"}"
timeout /t 1 /nobreak >nul

REM Gửi tin nhắn 3
echo Gửi tin nhắn từ User1...
curl -s -X POST %PRODUCER_URL%/api/chat/send -H "Content-Type: application/json" -d "{\"sender\":\"User1\",\"content\":\"Mình khỏe, cảm ơn bạn!\"}"
timeout /t 2 /nobreak >nul

echo.
echo 4. Lấy danh sách tin nhắn từ Service Consumer...
echo.
curl -s %CONSUMER_URL%/api/chat/messages

echo.
echo ==========================================
echo   Test hoàn tất!
echo ==========================================
pause
