import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import QRCode from "qrcode";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

// ✅ إنشاء عميل واتساب
const client = new Client({
  authStrategy: new LocalAuth({ clientId: "bot" }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

// ✅ عند ظهور QR
client.on("qr", async (qr) => {
  const qrImageUrl = await QRCode.toDataURL(qr);
  console.log("⚡ Scan this QR code by opening this link in your browser:");
  console.log(qrImageUrl);
});

// ✅ عند الجاهزية
client.on("ready", () => {
  console.log("✅ WhatsApp bot is ready!");
});

// ✅ الردود التلقائية
client.on("message", async (message) => {
  const text = message.body.trim();

  if (text === "1" || text === "١") {
    await message.reply(`📲 تابعنا على وسائل التواصل:

🌐 فيسبوك: https://www.facebook.com/share/1C9nxNg6Ug/
📸 إنستغرام: https://www.instagram.com/sahl_cash
📨 تيليجرام: https://t.me/sahlcash`);
  } else if (text === "2" || text === "٢") {
    await message.reply(`🛠️ الدعم الفني وخدمة العملاء:

📞 واتساب خدمة العملاء : +963 958 498 134
📞 واتساب الدعم الفني : +963 958 498 149
📞 واتساب الادارة العامة: +963 981 805 653
📧 الإيميل: sahlcash@gmail.com`);
  } else if (text === "3" || text === "٣") {
    await message.reply(`💼 خدماتنا:

📱 شحن أرصدة الموبايل (سوريا ولبنان)
🎮 شحن ألعاب (UC ببجي، فري فاير، وغيرهم)
🌐 شحن حسابات تواصل اجتماعي (فيسبوك، ياهو، إنستغرام...)
💳 تحويل واستلام الأموال (شام كاش، وش ماني، USDT وغيرها)
🌎 رابط موقعنا: https://www.sahl-cash.com/`);
  }
});

// ✅ بدء العميل
client.initialize();

// ✅ سيرفر Express لتشغيل الخدمة على Render
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ WhatsApp bot is running!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Server is running on port ${PORT}`);
});
