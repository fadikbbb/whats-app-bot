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
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
    }
};

// Initialize the bot
async function initializeBot() {
    console.log('🚀 Starting WhatsApp Bot...');
    
    // Configure Puppeteer
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
        ]
    };

    // Set Chrome path for different environments
    if (process.env.RENDER === 'true') {
        puppeteerOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome';
        console.log('🔧 Running on Render - Using system Chrome');
    } else {
        // Windows local development
        puppeteerOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    }

    const client = new Client({
        authStrategy: new LocalAuth({
            clientId: "whatsapp-bot"
        }),
        puppeteer: puppeteerOptions
    });

    // QR Code event
    client.on('qr', (qr) => {
        console.log('📱 QR Code received, scan with your WhatsApp:');
        qrcode.generate(qr, { small: true });
    });

    // Ready event
    client.on('ready', () => {
        console.log('✅ WhatsApp Bot is ready and connected!');
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
    });

    // Message handling
    client.on('message', async (message) => {
        try {
            const text = message.body.trim();
            
            // Ignore messages from status broadcasts and groups
            if (message.from === 'status@broadcast' || message.isGroup) return;

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

            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });

    // Initialize client
    try {
        await client.initialize();
        console.log('✅ Bot initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing bot:', error);
    }
}

// Start the application
async function startApp() {
    try {
        await connectDB();
        await initializeBot();
        
        console.log('🤖 Bot is running. Press Ctrl+C to stop.');
        
    } catch (error) {
        console.error('❌ Failed to start application:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 Shutting down gracefully...');
    process.exit(0);
});

// Start the bot
startApp();