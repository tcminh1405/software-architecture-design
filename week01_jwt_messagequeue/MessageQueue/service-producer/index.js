import { createClient } from "redis";
import readline from "readline";

const CHAT_TOPIC = "chat:messages";
const sender = "User";

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

// Tạo readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("========================================");
console.log("   SERVICE PRODUCER - CHAT CONSOLE");
console.log("========================================");
console.log("Bắt đầu chat! (Gõ 'exit' để thoát)");
console.log("----------------------------------------\n");

// Hàm chat
const chat = () => {
  rl.question(`[${sender}]: `, async (content) => {
    if (!content.trim()) {
      chat();
      return;
    }

    if (content.toLowerCase() === "exit") {
      console.log("Đã thoát chat!");
      await redisClient.quit();
      rl.close();
      process.exit(0);
    }

    // Tạo message object
    const message = {
      sender: sender,
      content: content,
    };

    // Publish message vào Redis
    try {
      await redisClient.publish(CHAT_TOPIC, JSON.stringify(message));
      console.log(`${message.sender}: ${message.content}`);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }

    chat();
  });
};

chat();
