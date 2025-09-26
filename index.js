const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

require('dotenv').config();

async function startClient() {
    console.log('🚀 Starting WhatsApp Bot...');
    
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
                '--disable-gpu',
                '--single-process'
            ],
            executablePath: process.env.CHROMIUM_PATH || null
        }
    });

    client.on('qr', (qr) => {
        console.log('📱 Scan the QR code below:');
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
        console.log('🔌 Client was logged out:', reason);
    });

    client.on('message', async (message) => {
        try {
            const text = message.body.trim().toLowerCase();
            
            // Ignore messages from status broadcasts and groups
            if (message.from === 'status@broadcast' || message.isGroup) return;

            console.log(`📨 Received message: ${text} from ${message.from}`);

            if (text === "1" || text === "١") {
                await message.reply(
                    `📲 تابعنا على وسائل التواصل:

🌐 فيسبوك: https://www.facebook.com/share/1C9nxNg6Ug/

📸 إنستغرام: https://www.instagram.com/sahl_cash

📨 تيليجرام: https://t.me/sahlcash`
                );
            } else if (text === "2" || text === "٢") {
                await message.reply(
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
                await message.reply(
                    `💼 خدماتنا:

📱 شحن أرصدة الموبايل (سوريا ولبنان).

🎮 شحن ألعاب (UC ببجي، فري فاير، وغيرهم).

🌐 شحن حسابات تواصل اجتماعي (فيسبوك، ياهو، إنستغرام...).

💳 تحويل واستلام الأموال (شام كاش، وش ماني، USDT وغيرها).

🌎 رابط موقعنا: https://www.sahl-cash.com/`
                );
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    // Initialize client with error handling
    try {
        await client.initialize();
        console.log('🤖 Bot initialized successfully');
    } catch (error) {
        console.error('Failed to initialize bot:', error);
        process.exit(1);
    }
}

// Handle process events
process.on('SIGINT', () => {
    console.log('🛑 Shutting down gracefully...');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the bot
startClient().catch(error => {
    console.error('Fatal error starting bot:', error);
    process.exit(1);
});