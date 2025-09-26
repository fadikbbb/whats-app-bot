import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const SESSION_FILE = process.env.SESSION_FILE || 'session.json';

// إعداد authStrategy مع تخزين الجلسة
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "bot",         // لتجنب تعارض مع جلسات أخرى
        dataPath: './',          // حفظ session في نفس المجلد
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }
});

// QR code عند الحاجة
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('⚡ Scan QR code with WhatsApp!');
});

// جاهزية البوت
client.on('ready', () => {
    console.log('✅ WhatsApp bot is ready!');
});

// الردود التلقائية
client.on('message', async message => {
    const text = message.body.trim();

    if (text === "1" || text === "١") {
        await message.reply(
            `📲 تابعنا على وسائل التواصل:

🌐 فيسبوك: https://www.facebook.com/share/1C9nxNg6Ug/

📸 إنستغرام: https://www.instagram.com/sahl_cash

📨 تيليجرام: https://t.me/sahlcash`
        );
        console.log('✅ Sent social media info');
    } else if (text === "2" || text === "٢") {
        await message.reply(
            `🛠️ الدعم الفني وخدمة العملاء:

📞 واتساب خدمة العملاء : +963 958 498 134

📞 واتساب الدعم الفني : +963 958 498 149

📞 واتساب الادارة العامة: +963 981 805 653

📧 الإيميل: sahlcash@gmail.com`
        );
        console.log('✅ Sent support info');
    } else if (text === "3" || text === "٣") {
        await message.reply(
            `💼 خدماتنا:

📱 شحن أرصدة الموبايل (سوريا ولبنان).

🎮 شحن ألعاب (UC ببجي، فري فاير، وغيرهم).

🌐 شحن حسابات تواصل اجتماعي (فيسبوك، ياهو، إنستغرام...).

💳 تحويل واستلام الأموال (شام كاش، وش ماني، USDT وغيرها).

🌎 رابط موقعنا: https://www.sahl-cash.com/`
        );
        console.log('✅ Sent services info');
    }
});

// تشغيل البوت
client.initialize();
