// index.js
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection with better error handling
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
        // Don't exit in production, let the bot try to reconnect
        if (process.env.RENDER !== 'true') {
            process.exit(1);
        }
    }
};

// Initialize the bot
async function initializeBot() {
    console.log('🚀 Starting WhatsApp Bot...');
    
    // Configure Puppeteer for Render
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
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
        ]
    };

    // Set Chrome path for Render
    if (process.env.RENDER === 'true') {
        puppeteerOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome';
        console.log('🔧 Running on Render - Using system Chrome');
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
            const text = message.body.trim().toLowerCase();
            
            // Ignore messages from status broadcasts and groups
            if (message.from === 'status@broadcast' || message.isGroup) return;

            console.log(`📩 Received message from ${message.from}: ${text}`);

            if (text === '1' || text === '١') {
                await message.reply(`📲 تابعنا على وسائل التواصل:

🌐 فيسبوك: https://www.facebook.com/share/1C9nxNg6Ug/
📸 إنستغرام: https://www.instagram.com/sahl_cash
📨 تيليجرام: https://t.me/sahlcash`);

            } else if (text === '2' || text === '٢') {
                await message.reply(`🛠️ الدعم الفني وخدمة العملاء:

📞 خدمة العملاء: +963 958 498 134
📞 الدعم الفني: +963 958 498 149
📞 الإدارة العامة: +963 981 805 653
📧 الإيميل: sahlcash@gmail.com`);

            } else if (text === '3' || text === '٣') {
                await message.reply(`💼 خدماتنا:

📱 شحن أرصدة الموبايل (سوريا ولبنان)
🎮 شحن ألعاب (UC ببجي، فري فاير...)
🌐 شحن حسابات تواصل اجتماعي
💳 تحويل واستلام الأموال
🌎 موقعنا: https://www.sahl-cash.com/`);

            } else if (text === 'menu' || text === 'الخدمات') {
                await message.reply(`🎯 قائمة الخدمات - اختر رقم:

1️⃣ - وسائل التواصل الاجتماعي
2️⃣ - الدعم الفني وخدمة العملاء  
3️⃣ - خدماتنا

👉 ارسل الرقم فقط (1, 2, أو 3)`);
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });

    // Initialize client with error handling
    try {
        await client.initialize();
        console.log('✅ Bot initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing bot:', error);
        
        // Retry after 10 seconds if on Render
        if (process.env.RENDER === 'true') {
            console.log('🔄 Retrying in 10 seconds...');
            setTimeout(() => {
                initializeBot();
            }, 10000);
        }
    }
}

// Health check endpoint for Render
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'WhatsApp Bot is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Sahl Cash WhatsApp Bot</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                    .container { text-align: center; }
                    .status { color: green; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🤖 Sahl Cash WhatsApp Bot</h1>
                    <p class="status">✅ Bot is running successfully</p>
                    <p>Check the logs in Render for QR code scanning</p>
                    <p><a href="/health">Health Check</a></p>
                </div>
            </body>
        </html>
    `);
});

// Start server and bot
async function startServer() {
    try {
        // Connect to MongoDB first
        await connectDB();
        
        // Start Express server
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🌐 Server running on port ${PORT}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
        });
        
        // Initialize WhatsApp bot
        await initializeBot();
        
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down...');
    process.exit(0);
});

// Start the application
startServer().catch(console.error);