require('dotenv').config(); // add this at the top
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Session = require('./session'); // your model

async function startClient() {
    let sessionData = null;

    // Try to get session from DB
    const savedSession = await Session.findOne({ name: 'whatsappSession' });
    if (savedSession) {
        sessionData = savedSession.sessionData;
    }

    const client = new Client({
        session: sessionData,
        puppeteer: {
            executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', async (qr) => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('✅ البوت جاهز للعمل!');
    });

    client.on('authenticated', async (session) => {
        // Save session in MongoDB
        await Session.findOneAndUpdate(
            { name: 'whatsappSession' },
            { sessionData: session },
            { upsert: true }
        );
        console.log('💾 تم حفظ الجلسة في قاعدة البيانات');
    });

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

startClient();
