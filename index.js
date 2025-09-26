const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('🚀 Starting WhatsApp Bot for Sahl Cash...');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
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
    }
});

client.on('qr', (qr) => {
    console.log('📱 Scan this QR code with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ البوت جاهز للعمل!');
});

client.on('authenticated', () => {
    console.log('🔐 Authentication successful!');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
    console.log('🔌 Client disconnected:', reason);
});

client.on('message', async (message) => {
    // Ignore messages from status broadcasts
    if (message.from === 'status@broadcast') return;
    
    const text = message.body.trim();

    console.log(`📨 Received message from ${message.from}: ${text}`);

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

// Error handling
client.on('error', (error) => {
    console.error('Client error:', error);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Initialize the client
console.log('🤖 Initializing WhatsApp client...');
client.initialize();