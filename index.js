const venom = require('venom-bot');
const qrcode = require('qrcode-terminal');

require('dotenv').config();

async function startClient() {
    const client = await venom.create({
        session: 'sahl-cash-bot',
        headless: true,
        useChrome: false,
        browserArgs: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    });

    console.log('✅ البوت جاهز للعمل!');

    client.onMessage(async (message) => {
        const text = message.body.trim();
        
        if (text === "1" || text === "١") {
            await client.sendText(message.from, 
                `📲 تابعنا على وسائل التواصل:

🌐 فيسبوك: https://www.facebook.com/share/1C9nxNg6Ug/

📸 إنستغرام: https://www.instagram.com/sahl_cash

📨 تيليجرام: https://t.me/sahlcash`
            );
        } else if (text === "2" || text === "٢") {
            await client.sendText(message.from,
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
            await client.sendText(message.from,
                `💼 خدماتنا:

📱 شحن أرصدة الموبايل (سوريا ولبنان).

🎮 شحن ألعاب (UC ببجي، فري فاير، وغيرهم).

🌐 شحن حسابات تواصل اجتماعي (فيسبوك، ياهو، إنستغرام...).

💳 تحويل واستلام الأموال (شام كاش، وش ماني، USDT وغيرها).

🌎 رابط موقعنا: https://www.sahl-cash.com/`
            );
        }
    });
}

startClient().catch(error => {
    console.error('Error starting client:', error);
});