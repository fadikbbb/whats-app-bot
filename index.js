import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// ✅ 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB Error:', err));

// ✅ 2. Define Session Schema
const sessionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sessionData: { type: Object, required: true },
});
const Session = mongoose.model('Session', sessionSchema);

// ✅ 3. Load existing session
let sessionData = null;
try {
  const existing = await Session.findOne({ name: 'whatsappSession' });
  if (existing) {
    console.log('💾 Loaded existing session from DB');
    sessionData = existing.sessionData;
  } else {
    console.log('⚠️ No saved session, please scan QR code');
  }
} catch (err) {
  console.error('❌ Error loading session:', err);
}

const isRender = process.env.RENDER === "true"; // custom flag

const client = new Client({
  session: sessionData,
  puppeteer: {
    headless: true,
    executablePath: isRender
      ? "/usr/bin/google-chrome-stable"
      : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
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

// ✅ 5. QR Code
client.on('qr', (qr) => {
  console.log('📱 Scan this QR code:');
  qrcode.generate(qr, { small: true });
});

// ✅ 6. Authenticated
client.on('authenticated', async (session) => {
  try {
    await Session.findOneAndUpdate(
      { name: 'whatsappSession' },
      { sessionData: session },
      { upsert: true }
    );
    console.log('💾 تم حفظ الجلسة في قاعدة البيانات');
  } catch (err) {
    console.error('❌ Error saving session:', err);
  }
});

// ✅ 7. Ready
client.on('ready', () => {
  console.log('🤖 WhatsApp Bot is ready!');
});

// ✅ 8. Message Handler
client.on('message', async (message) => {
  const text = message.body.trim();
  console.log(`📩 Message from ${message.from}: ${text}`);

  if (text === "1" || text === "١") {
    await message.reply(`📲 تابعنا على وسائل التواصل:

🌐 فيسبوك: https://www.facebook.com/share/1C9nxNg6Ug/
📸 إنستغرام: https://www.instagram.com/sahl_cash
📨 تيليجرام: https://t.me/sahlcash`);
  } 
  else if (text === "2" || text === "٢") {
    await message.reply(`🛠️ الدعم الفني وخدمة العملاء:

📞 واتساب خدمة العملاء : +963 958 498 134
📞 واتساب الدعم الفني : +963 958 498 149
📞 واتساب الادارة العامة: +963 981 805 653
📧 الإيميل: sahlcash@gmail.com`);
  } 
  else if (text === "3" || text === "٣") {
    await message.reply(`💼 خدماتنا:

📱 شحن أرصدة الموبايل (سوريا ولبنان)
🎮 شحن ألعاب (UC ببجي، فري فاير، وغيرهم)
🌐 شحن حسابات تواصل اجتماعي (فيسبوك، ياهو، إنستغرام...)
💳 تحويل واستلام الأموال (شام كاش، وش ماني، USDT وغيرها)
🌎 رابط موقعنا: https://www.sahl-cash.com/`);
  }
});

// ✅ 9. Start client
client.initialize();
