const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');

require('dotenv').config();

async function startClient() {
    // Configure Puppeteer for Render environment
    const puppeteerOptions = {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    };

    const client = new Client({
        puppeteer: puppeteerOptions
    });

    client.on('qr', qr => qrcode.generate(qr, { small: true }));
    client.on('ready', () => console.log('✅ البوت جاهز للعمل!'));
   
    client.on('message', message => {
        const text = message.body.trim();
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
}

startClient().catch(error => {
    console.error('Error starting client:', error);
    process.exit(1);
});