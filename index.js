// index.js
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI is not defined in environment variables');
            return;
        }
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
    }
};

// Initialize the bot
async function initializeBot() {
    console.log('🚀 Starting WhatsApp Bot...');
    
    // Configure Puppeteer - SIMPLIFIED VERSION
    const puppeteerOptions = {
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
        ]
    };

    // For Render deployment - use the environment variable or default Linux path
    if (process.env.RENDER === 'true') {
        console.log('🔧 Running on Render environment');
        // Use the path from environment variable or default Linux Chrome path
        puppeteerOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome';
        console.log('📍 Using Chrome path:', puppeteerOptions.executablePath);
    } else {
        // Local development - try to use system Chrome
        console.log('🔧 Running on local environment');
        puppeteerOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }

    const client = new Client({
        authStrategy: new LocalAuth({
            clientId: "whatsapp-bot-render"
        }),
        puppeteer: puppeteerOptions,
        webVersionCache: {
            type: 'remote',
            remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
        }
    });

    // QR Code event
    client.on('qr', (qr) => {
        console.log('\n📱 QR Code received, scan with your WhatsApp:');
        console.log('=========================================');
        qrcode.generate(qr, { small: true });
        console.log('=========================================');
        console.log('⚠️  Scan the QR code above with WhatsApp within 2 minutes!');
    });

    // Ready event
    client.on('ready', () => {
        console.log('\n✅ WhatsApp Bot is ready and connected!');
        console.log('🤖 Bot is now listening for messages...');
    });

    // Authentication events
    client.on('authenticated', () => {
        console.log('✅ Authentication successful');
    });

    client.on('auth_failure', (msg) => {
        console.error('❌ Authentication failed:', msg);
    });

    client.on('disconnected', (reason) => {
        console.log('❌ Client was logged out:', reason);
        console.log('🔄 Attempting to reconnect...');
        setTimeout(() => {
            initializeBot();
        }, 5000);
    });

    // Message handling
    client.on('message', async (message) => {
        try {
            const text = message.body.trim();
            
            // Ignore messages from status broadcasts and groups
            if (message.from === 'status@broadcast') return;
            
            console.log(`📩 Received message from ${message.from}: ${text}`);

            if (text === "1" || text === "١") {
                await message.reply(`📲 تابعنا على وسائل التواصل:

🌐 فيسبوك: https://www.facebook.com/share/1C9nxNg6Ug/
📸 إنستغرام: https://www.instagram.com/sahl_cash
📨 تيليجرام: https://t.me/sahlcash`);

            } else if (text === "2" || text === "٢") {
                await message.reply(`🛠️ الدعم الفني وخدمة العملاء:

📞 خدمة العملاء: +963 958 498 134
📞 الدعم الفني: +963 958 498 149
📞 الإدارة العامة: +963 981 805 653
📧 الإيميل: sahlcash@gmail.com`);

            } else if (text === "3" || text === "٣") {
                await message.reply(`💼 خدماتنا:

📱 شحن أرصدة الموبايل (سوريا ولبنان)
🎮 شحن ألعاب (UC ببجي، فري فاير...)
🌐 شحن حسابات تواصل اجتماعي
💳 تحويل واستلام الأموال
🌎 موقعنا: https://www.sahl-cash.com/`);

            } else if (text.toLowerCase() === 'menu' || text === 'الخدمات') {
                await message.reply(`🎯 قائمة الخدمات - اختر رقم:

1️⃣ - وسائل التواصل الاجتماعي
2️⃣ - الدعم الفني وخدمة العملاء  
3️⃣ - خدماتنا

👉 ارسل الرقم فقط (1, 2, أو 3)`);
            }
        } catch (error) {
            console.error('❌ Error handling message:', error);
        }
    });

    // Initialize client with better error handling
    try {
        console.log('🔄 Initializing WhatsApp client...');
        await client.initialize();
        console.log('✅ Bot initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing bot:', error);
        
        // Specific error handling
        if (error.message.includes('ENOENT') || error.message.includes('Failed to launch')) {
            console.log('💡 Browser not found. Trying alternative approach...');
            
            // Try without specifying executable path
            const clientWithoutPath = new Client({
                authStrategy: new LocalAuth({
                    clientId: "whatsapp-bot-render-alt"
                }),
                puppeteer: {
                    headless: true,
                    args: puppeteerOptions.args
                }
            });
            
            try {
                await clientWithoutPath.initialize();
                console.log('✅ Bot initialized successfully with default browser');
            } catch (error2) {
                console.error('❌ Failed with default browser too:', error2);
            }
        }
    }
}

// Start the application
async function startApp() {
    try {
        console.log('🔧 Starting application...');
        
        // Connect to MongoDB (optional for now)
        await connectDB();
        
        // Initialize the bot
        await initializeBot();
        
        console.log('\n🤖 Bot startup completed successfully!');
        console.log('📍 The bot will automatically reconnect if disconnected.');
        console.log('⏹️  Press Ctrl+C to stop the bot.');
        
    } catch (error) {
        console.error('❌ Failed to start application:', error);
        // Don't exit on Render - let it try to recover
        if (process.env.RENDER !== 'true') {
            process.exit(1);
        }
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down...');
    process.exit(0);
});

// Error handling
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the bot
startApp();