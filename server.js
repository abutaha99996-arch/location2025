const express = require('express');
const app = express();
const path = require('path');

// Middleware
app.use(express.json());
app.use(express.static('.'));

// تخزين البيانات
const trackedData = [];

// صفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// استقبال بيانات التتبع
app.post('/track', (req, res) => {
    const data = req.body;
    const timestamp = new Date().toLocaleString('ar-EG');
    
    console.log('🎯 بيانات تتبع جديدة:');
    console.log('📍 IP:', data.ip);
    console.log('🕒 الوقت:', timestamp);
    console.log('📱 الإجراء:', data.action);
    console.log('🌐 المتصفح:', data.userAgent);
    console.log('💻 الشاشة:', data.screen);
    console.log('🌍 المنطقة:', data.timezone);
    console.log('────────────────────');
    
    // حفظ في المصفوفة
    trackedData.push({
        ...data,
        serverTime: timestamp
    });
    
    // حفظ في ملف
    const fs = require('fs');
    fs.appendFile('tracking.log', 
        `\n\n=== 📍 تتبع جديد - ${timestamp} ===\n` +
        `IP: ${data.ip}\n` +
        `الإجراء: ${data.action}\n` +
        `الصفحة: ${data.pageUrl}\n` +
        `الشاشة: ${data.screen}\n` +
        `المنطقة: ${data.timezone}\n` +
        `اللغة: ${data.language}\n` +
        `المتصفح: ${data.userAgent}\n` +
        `الوقت: ${data.timestamp}\n` +
        `────────────────────`
    , (err) => {
        if (err) console.error('خطأ في الحفظ:', err);
    });
    
    res.json({status: 'success', message: 'تم استلام البيانات'});
});

// صفحة لعرض البيانات المسجلة
app.get('/admin', (req, res) => {
    res.json({
        total: trackedData.length,
        data: trackedData
    });
});

// صفحة لعرض الـ Logs
app.get('/logs', (req, res) => {
    const fs = require('fs');
    fs.readFile('tracking.log', 'utf8', (err, data) => {
        if (err) {
            res.send('لا توجد بيانات حالياً');
        } else {
            res.send('<pre>' + data + '</pre>');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
    console.log(`📊 صفحة الإدارة: http://localhost:${PORT}/admin`);
    console.log(`📄 صفحة الـLogs: http://localhost:${PORT}/logs`);
});
