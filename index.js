// index.js
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

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

// Function to find Chrome executable
const findChromePath = () => {
    if (process.env.RENDER !== 'true') {
        // Local development - use Windows path
        return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    }

    // On Render, try different possible Chrome paths
    const possiblePaths = [
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        '/snap/bin/chromium'
    ];

    for (const path of possiblePaths) {
        try {
            execSync(`which ${path}`, { stdio: 'ignore' });
            console.log(`✅ Found Chrome at: ${path}`);
            return path;
        } catch (error) {
            // Continue to next path
        }
    }

    console.log('❌ Chrome not found in standard paths. Letting Puppeteer use its own browser.');
    return null;
};

// Initialize the bot
async function initializeBot() {
    console.log('🚀 Starting WhatsApp Bot...');
    
    const chromePath = findChromePath();
    
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
            '--single-process',
            '--remote-debugging-port=0',
            '--remote-debugging-address=0.0.0.0'
        ]
    };

    // Only set executablePath if we found Chrome
    if (chromePath) {
        puppeteerOptions.executablePath = chromePath;
        console.log(`📍 Using browser: ${chromePath}`);
    } else {
        console.log('📍 Using Puppeteer\'s built-in browser');
    }

    const client = new Client({
        authStrategy: new LocalAuth({
            clientId: "whatsapp-bot-render"
        }),
        puppeteer: puppeteerOptions
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
        console.log('🔄 Attempting to reconnect in 10 seconds...');
        setTimeout(() => {
            initializeBot();
        }, 10000);
    });

    // Message handling
    client.on('message', async (message) => {
        try {
            const text = message.body.trim();
            
            // Ignore messages from status broadcasts
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

    // Initialize client
    try {
        console.log('🔄 Initializing WhatsApp client...');
        await client.initialize();
        console.log('✅ Bot initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing bot:', error);
        
        // If Chrome path failed, try without any path (use Puppeteer's Chromium)
        if (chromePath && error.message.includes('Tried to use PUPPETEER_EXECUTABLE_PATH')) {
            console.log('💡 Chrome path failed, trying with Puppeteer\'s built-in browser...');
            
            const clientWithBuiltin = new Client({
                authStrategy: new LocalAuth({
                    clientId: "whatsapp-bot-builtin"
                }),
                puppeteer: {
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage'
                    ]
                }
            });
            
            try {
                await clientWithBuiltin.initialize();
                console.log('✅ Bot initialized successfully with built-in browser');
            } catch (error2) {
                console.error('❌ Failed with built-in browser too:', error2);
            }
        }
    }
}

// Start the application
async function startApp() {
    try {
        console.log('🔧 Starting application...');
        console.log('📍 Environment:', process.env.RENDER === 'true' ? 'Render' : 'Local');
        
        // Connect to MongoDB
        await connectDB();
        
        // Initialize the bot
        await initializeBot();
        
        console.log('\n🤖 Bot startup completed!');
        console.log('📍 The bot will automatically reconnect if disconnected.');
        
    } catch (error) {
        console.error('❌ Failed to start application:', error);
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