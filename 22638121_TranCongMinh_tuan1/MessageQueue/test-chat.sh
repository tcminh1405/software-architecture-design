#!/bin/bash

# Script test ứng dụng chat qua console
# Sử dụng: ./test-chat.sh

PRODUCER_URL="http://localhost:8080"
CONSUMER_URL="http://localhost:8081"

echo "=========================================="
echo "  TEST CHAT APPLICATION - CONSOLE"
echo "=========================================="
echo ""

# Kiểm tra service producer
echo "1. Kiểm tra Service Producer..."
PRODUCER_STATUS=$(curl -s "$PRODUCER_URL/api/chat/status")
if [ $? -eq 0 ]; then
    echo "   ✓ Service Producer: $PRODUCER_STATUS"
else
    echo "   ✗ Service Producer không khả dụng!"
    exit 1
fi

# Kiểm tra service consumer
echo "2. Kiểm tra Service Consumer..."
CONSUMER_STATUS=$(curl -s "$CONSUMER_URL/api/chat/status")
if [ $? -eq 0 ]; then
    echo "   ✓ Service Consumer: $CONSUMER_STATUS"
else
    echo "   ✗ Service Consumer không khả dụng!"
    exit 1
fi

echo ""
echo "3. Gửi tin nhắn test..."
echo ""

# Gửi tin nhắn 1
echo "Gửi tin nhắn từ User1..."
curl -s -X POST "$PRODUCER_URL/api/chat/send" \
  -H "Content-Type: application/json" \
  -d '{"sender":"User1","content":"Xin chào mọi người!"}' \
  | jq '.' 2>/dev/null || echo "Đã gửi tin nhắn 1"
sleep 1

# Gửi tin nhắn 2
echo "Gửi tin nhắn từ User2..."
curl -s -X POST "$PRODUCER_URL/api/chat/send" \
  -H "Content-Type: application/json" \
  -d '{"sender":"User2","content":"Chào bạn! Bạn khỏe không?"}' \
  | jq '.' 2>/dev/null || echo "Đã gửi tin nhắn 2"
sleep 1

# Gửi tin nhắn 3
echo "Gửi tin nhắn từ User1..."
curl -s -X POST "$PRODUCER_URL/api/chat/send" \
  -H "Content-Type: application/json" \
  -d '{"sender":"User1","content":"Mình khỏe, cảm ơn bạn!"}' \
  | jq '.' 2>/dev/null || echo "Đã gửi tin nhắn 3"
sleep 2

echo ""
echo "4. Lấy danh sách tin nhắn từ Service Consumer..."
echo ""
curl -s "$CONSUMER_URL/api/chat/messages" | jq '.' 2>/dev/null || \
curl -s "$CONSUMER_URL/api/chat/messages"

echo ""
echo "=========================================="
echo "  Test hoàn tất!"
echo "=========================================="
