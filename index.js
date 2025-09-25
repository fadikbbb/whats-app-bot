import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const isRender = process.env.RENDER === "true";

// ✅ MongoDB Connection
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");
} catch (err) {
  console.error("❌ MongoDB connection error:", err);
}

// ✅ Session Schema
const sessionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sessionData: { type: Object, required: true },
});
const Session = mongoose.model("Session", sessionSchema);

// ✅ Load session from DB
let sessionData = null;
try {
  const existing = await Session.findOne({ name: 'whatsappSession' });
  if (existing) {
    console.log("💾 Loaded existing session");
    sessionData = existing.sessionData;
  } else {
    console.log("⚠️ No saved session found");
  }
} catch (err) {
  console.error("❌ Error loading session:", err);
}

// ✅ Client Config
const client = new Client({
  session: sessionData,
  puppeteer: {
    headless: true,
    executablePath: isRender
      ? '/usr/bin/google-chrome-stable'
      : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-gpu',
      '--window-size=1920,1080',
    ],
  },
});

// ✅ Events
client.on('qr', (qr) => {
  console.log("📱 Scan this QR code:");
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', async (session) => {
  try {
    await Session.findOneAndUpdate(
      { name: 'whatsappSession' },
      { sessionData: session },
      { upsert: true }
    );
    console.log("💾 Session saved successfully");
  } catch (err) {
    console.error("❌ Error saving session:", err);
  }
});

client.on('ready', () => {
  console.log("🤖 WhatsApp Bot is ready!");
});

// ✅ Message handling
client.on('message', async (msg) => {
  const text = msg.body.trim();
  console.log(`📩 Message from ${msg.from}: ${text}`);

  if (["1", "١"].includes(text)) {
    await msg.reply(`📲 تابعنا على وسائل التواصل:

🌐 فيسبوك: https://www.facebook.com/share/1C9nxNg6Ug/
📸 إنستغرام: https://www.instagram.com/sahl_cash
📨 تيليجرام: https://t.me/sahlcash`);
  } else if (["2", "٢"].includes(text)) {
    await msg.reply(`🛠️ الدعم الفني وخدمة العملاء:

📞 خدمة العملاء: +963 958 498 134
📞 الدعم الفني: +963 958 498 149
📞 الإدارة العامة: +963 981 805 653
📧 الإيميل: sahlcash@gmail.com`);
  } else if (["3", "٣"].includes(text)) {
    await msg.reply(`💼 خدماتنا:

📱 شحن أرصدة الموبايل (سوريا ولبنان)
🎮 شحن ألعاب (UC ببجي، فري فاير...)
🌐 شحن حسابات تواصل اجتماعي
💳 تحويل واستلام الأموال
🌎 موقعنا: https://www.sahl-cash.com/`);
  }
});

// ✅ Initialize bot
client.initialize();
