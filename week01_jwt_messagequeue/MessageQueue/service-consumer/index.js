import { createClient } from "redis";

const CHAT_TOPIC = "chat:messages";

// Tạo Redis client
const redisClient = createClient({
  url: "redis://127.0.0.1:6379",
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
  process.exit(1);
});

// Kết nối Redis
await redisClient.connect();
console.log("Đã kết nối Redis thành công!");

console.log("========================================");
console.log("   SERVICE CONSUMER - CHAT CONSOLE");
console.log("========================================");
console.log("Đang lắng nghe tin nhắn từ Redis...");
console.log("(Nhấn Ctrl+C để dừng)");
console.log("----------------------------------------\n");
console.log(">>> Đang chờ tin nhắn... ");

// Subscribe vào channel
const subscriber = redisClient.duplicate();
await subscriber.connect();

await subscriber.subscribe(CHAT_TOPIC, (message) => {
  try {
    const msg = JSON.parse(message);
    console.log(`${msg.sender}: ${msg.content}`);
  } catch (error) {
    console.error("Lỗi khi parse message:", error);
  }
});

// Xử lý khi dừng chương trình
process.on("SIGINT", async () => {
  console.log("\n\nĐang dừng service...");
  await subscriber.quit();
  await redisClient.quit();
  process.exit(0);
});
