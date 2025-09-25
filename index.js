const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // مسار جوجل كروم
    headless: true,
  },
});

// إظهار QR code أول مرة
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

// عندما يكون البوت جاهز
client.on("ready", () => {
  console.log("✅ البوت جاهز للعمل!");
});

// الردود الآلية
client.on("message", (message) => {
  const text = message.body.trim();

  // خيارات الرد
  if (text === "1" || text === "١") {
    message.reply(
      `📲 تابعنا على وسائل التواصل:

🌐 فيسبوك: https://www.facebook.com/share/1C9nxNg6Ug/

📸 إنستغرام: https://www.instagram.com/sahl_cash

📨 تيليجرام: https://t.me/sahlcash`
    );
  } else if (text === "2" || text === "٢") {
    message.reply(
      `🛠️ الدعم الفني وخدمة العملاء:

📞 واتساب خدمة العملاء :
+963 958 498 134

📞 واتساب الدعم الفني :
+963 958 498 149

📞 واتساب الادارة العامة:
+963 981 805 653

📧 الإيميل: sahlcash@gmail.com`
    );
  } else if (text === "3" || text === "٣") {
    message.reply(
      `💼 خدماتنا:

📱 شحن أرصدة الموبايل (سوريا ولبنان).

🎮 شحن ألعاب (UC ببجي، فري فاير، وغيرهم).

🌐 شحن حسابات تواصل اجتماعي (فيسبوك، ياهو، إنستغرام...).

💳 تحويل واستلام الأموال (شام كاش، وش ماني، USDT وغيرها).

🌎 رابط موقعنا: https://www.sahl-cash.com/`
    );
  }
});

client.initialize();
