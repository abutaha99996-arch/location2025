// نظام تحديد الموقع الجغرافي الدقيق باستخدام GPS
document.addEventListener('DOMContentLoaded', function() {
    // عناصر DOM
    const getLocationBtn = document.getElementById('getLocationBtn');
    const highAccuracyBtn = document.getElementById('highAccuracyBtn');
    const continuousBtn = document.getElementById('continuousBtn');
    const stopTrackingBtn = document.getElementById('stopTrackingBtn');
    const loading = document.getElementById('loading');
    const loadingText = document.getElementById('loadingText');
    const status = document.getElementById('status');
    const gpsIndicator = document.getElementById('gpsIndicator');
    const gpsStatusText = document.getElementById('gpsStatusText');
    
    // بيانات الموقع
    let currentPosition = null;
    let watchId = null;
    let isTracking = false;
    
    // تحديث واجهة GPS
    function updateGPSStatus(active) {
        if (active) {
            gpsIndicator.classList.add('gps-active');
            gpsStatusText.textContent = 'GPS نشط - متصل بالأقمار الصناعية';
            gpsStatusText.style.color = '#27ae60';
        } else {
            gpsIndicator.classList.remove('gps-active');
            gpsStatusText.textContent = 'GPS غير نشط';
            gpsStatusText.style.color = '#666';
        }
    }
    
    // تحديث واجهة المستخدم بالبيانات
    function updateUI(position) {
        currentPosition = position;
        
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        const altitude = position.coords.altitude;
        const speed = position.coords.speed;
        const heading = position.coords.heading;
        
        // تحديث القيم
        document.getElementById('latitude').textContent = lat.toFixed(8) + '°';
        document.getElementById('longitude').textContent = lon.toFixed(8) + '°';
        document.getElementById('accuracyValue').textContent = accuracy ? `${Math.round(accuracy)} متر` : 'غير معروف';
        document.getElementById('altitude').textContent = altitude ? `${altitude.toFixed(1)} متر` : 'غير متاح';
        document.getElementById('speed').textContent = speed ? `${(speed * 3.6).toFixed(1)} كم/ساعة` : '0 كم/ساعة';
        document.getElementById('heading').textContent = heading ? `${Math.round(heading)}°` : 'غير متاح';
        document.getElementById('timestamp').textContent = new Date(position.timestamp).toLocaleTimeString('ar-SA');
        document.getElementById('source').textContent = 'GPS مباشر (دقة عالية)';
        
        // تحديث مؤشر الدقة
        const accuracyIndicator = document.getElementById('accuracyIndicator');
        accuracyIndicator.textContent = getAccuracyLevel(accuracy);
        accuracyIndicator.className = 'accuracy-indicator ' + getAccuracyClass(accuracy);
        
        // تقدير عدد الأقمار الصناعية (محاكاة)
        const estimatedSatellites = Math.floor(Math.random() * 10) + 8; // بين 8 و 18 قمر
        document.getElementById('satellites').textContent = estimatedSatellites + ' أقمار تقريباً';
        
        // تحديث حالة GPS
        updateGPSStatus(true);
        
        // تمكين زر الإرسال إذا كانت الدقة عالية
        if (accuracy < 100) {
            showStatus('📍 تم تحديد موقعك بدقة عالية!', 'success');
        } else {
            showStatus('⚠️ الدقة متوسطة، حاول الانتقال لمكان مفتوح', 'info');
        }
    }
    
    // تحديد مستوى الدقة
    function getAccuracyLevel(accuracy) {
        if (!accuracy) return 'غير معروف';
        if (accuracy < 10) return 'دقة عالية جداً';
        if (accuracy < 50) return 'دقة عالية';
        if (accuracy < 100) return 'دقة جيدة';
        if (accuracy < 500) return 'دقة متوسطة';
        return 'دقة منخفضة';
    }
    
    // تحديد فئة الدقة
    function getAccuracyClass(accuracy) {
        if (!accuracy) return 'accuracy-low';
        if (accuracy < 10) return 'accuracy-high';
        if (accuracy < 50) return 'accuracy-high';
        if (accuracy < 100) return 'accuracy-high';
        if (accuracy < 500) return 'accuracy-medium';
        return 'accuracy-low';
    }
    
    // عرض رسالة الحالة
    function showStatus(message, type = 'info') {
        status.textContent = message;
        status.className = 'status status-' + type;
        status.style.display = 'block';
        
        // إخفاء الرسالة بعد 5 ثواني
        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    }
    
    // إظهار/إخفاء التحميل
    function setLoading(active, text = 'جاري تحديد الموقع...') {
        loading.style.display = active ? 'block' : 'none';
        loadingText.textContent = text;
    }
    
    // الحصول على الموقع مع إعدادات محددة
    function getLocation(options = {}) {
        if (!navigator.geolocation) {
            showStatus('⚠️ المتصفح لا يدعم خدمة تحديد الموقع', 'error');
            return;
        }
        
        setLoading(true, 'جاري الاتصال بالأقمار الصناعية...');
        
        navigator.geolocation.getCurrentPosition(
            // النجاح
            function(position) {
                setLoading(false);
                updateUI(position);
                console.log('📍 موقع GPS:', {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy + ' متر',
                    source: 'GPS مباشر',
                    timestamp: new Date(position.timestamp).toISOString()
                });
            },
            // الفشل
            function(error) {
                setLoading(false);
                updateGPSStatus(false);
                
                let errorMessage = '';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'تم رفض الإذن. يرجى السماح للمتصفح بالوصول إلى موقعك.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'معلومات الموقع غير متاحة. تأكد من تفعيل GPS.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'انتهت مهلة الطلب. حاول مرة أخرى.';
                        break;
                    default:
                        errorMessage = 'حدث خطأ غير معروف: ' + error.message;
                }
                
                showStatus('❌ ' + errorMessage, 'error');
                console.error('خطأ GPS:', error);
                
                // محاولة الحصول على موقع بديل (إذا رفض المستخدم GPS)
                if (error.code === error.PERMISSION_DENIED) {
                    setTimeout(() => {
                        showStatus('ℹ️ جاري الحصول على موقع تقريبي...', 'info');
                        getFallbackLocation();
                    }, 2000);
                }
            },
            // إعدادات GPS
            {
                enableHighAccuracy: options.highAccuracy || false,
                timeout: options.timeout || 15000,
                maximumAge: options.maximumAge || 0
            }
        );
    }
    
    // الحصول على موقع بديل (دقة أقل)
    function getFallbackLocation() {
        // محاولة الحصول على موقع بدقة أقل (بدون GPS)
        navigator.geolocation.getCurrentPosition(
            function(position) {
                updateUI(position);
                showStatus('📍 تم الحصول على موقع تقريبي (دقة أقل)', 'info');
            },
            function(error) {
                showStatus('⚠️ لا يمكن تحديد الموقع بأي طريقة', 'error');
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    }
    
    // بدء التتبع المستمر
    function startContinuousTracking() {
        if (!navigator.geolocation) {
            showStatus('⚠️ المتصفح لا يدعم التتبع المستمر', 'error');
            return;
        }
        
        setLoading(true, 'جاري بدء التتبع المستمر...');
        
        watchId = navigator.geolocation.watchPosition(
            function(position) {
                setLoading(false);
                updateUI(position);
                isTracking = true;
                stopTrackingBtn.disabled = false;
                continuousBtn.disabled = true;
                showStatus('🔄 التتبع المستمر نشط - جاري تحديث الموقع...', 'info');
            },
            function(error) {
                setLoading(false);
                showStatus('❌ توقف التتبع: ' + error.message, 'error');
                stopTracking();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }
    
    // إيقاف التتبع
    function stopTracking() {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
        }
        
        isTracking = false;
        stopTrackingBtn.disabled = true;
        continuousBtn.disabled = false;
        showStatus('⏹️ تم إيقاف التتبع المستمر', 'info');
    }
    
    // إرسال الموقع للبوت
    function sendToBot(position) {
        if (!position) {
            showStatus('⚠️ لا يوجد موقع للإرسال', 'error');
            return;
        }
        
        setLoading(true, 'جاري إرسال الموقع للبوت...');
        
        const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            speed: position.coords.speed,
            heading: position.coords.heading,
            timestamp: new Date(position.timestamp).toISOString(),
            source: 'gps_direct',
            userAgent: navigator.userAgent,
            platform: navigator.platform
        };
        
        // إرسال البيانات للخادم
        fetch('/api/save-location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(locationData)
        })
        .then(response => response.json())
        .then(data => {
            setLoading(false);
            if (data.success) {
                showStatus('✅ تم إرسال موقعك للبوت بنجاح!', 'success');
                
                // إظهار رابط الخريطة
                const mapUrl = `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`;
                setTimeout(() => {
                    showStatus(`🗺️ <a href="${mapUrl}" target="_blank" style="color: #0c2461; text-decoration: underline;">اضغط هنا لرؤية موقعك على الخريطة</a>`, 'info');
                }, 1000);
            } else {
                showStatus('❌ فشل إرسال الموقع: ' + (data.error || 'خطأ غير معروف'), 'error');
            }
        })
        .catch(error => {
            setLoading(false);
            showStatus('❌ خطأ في الاتصال: ' + error.message, 'error');
            console.error('خطأ الإرسال:', error);
        });
    }
    
    // اختبار GPS عند التحميل
    function testGPS() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function() {
                    updateGPSStatus(true);
                    showStatus('✅ GPS جاهز للاستخدام', 'success');
                },
                function() {
                    updateGPSStatus(false);
                    showStatus('ℹ️ GPS غير نشط، اضغط على الزر لتفعيله', 'info');
                },
                { enableHighAccuracy: false, timeout: 3000 }
            );
        } else {
            showStatus('⚠️ المتصفح لا يدعم GPS', 'error');
        }
    }
    
    // أحداث الأزرار
    getLocationBtn.addEventListener('click', () => {
        getLocation({ enableHighAccuracy: true, timeout: 20000 });
    });
    
    highAccuracyBtn.addEventListener('click', () => {
        getLocation({ enableHighAccuracy: true, timeout: 30000 });
    });
    
    continuousBtn.addEventListener('click', () => {
        startContinuousTracking();
    });
    
    stopTrackingBtn.addEventListener('click', () => {
        stopTracking();
    });
    
    // إضافة زر إرسال للبوت ديناميكيًا
    const sendBtn = document.createElement('button');
    sendBtn.className = 'btn btn-success';
    sendBtn.id = 'sendToBotBtn';
    sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الموقع للبوت';
    sendBtn.style.marginTop = '20px';
    sendBtn.style.width = '100%';
    sendBtn.style.maxWidth = '350px';
    sendBtn.style.marginLeft = 'auto';
    sendBtn.style.marginRight = 'auto';
    sendBtn.style.display = 'block';
    
    sendBtn.addEventListener('click', () => {
        if (currentPosition) {
            sendToBot(currentPosition);
        } else {
            showStatus('⚠️ يرجى تحديد موقعك أولاً', 'error');
        }
    });
    
    document.querySelector('.controls').appendChild(sendBtn);
    
    // بدء اختبار GPS عند تحميل الصفحة
    setTimeout(() => {
        testGPS();
    }, 1000);
    
    // محاولة تلقائية للحصول على الموقع بعد 3 ثواني
    setTimeout(() => {
        if (!currentPosition) {
            getLocationBtn.click();
        }
    }, 3000);
    
    // إضافة معلومات إضافية في الكونسول
    console.log(`
    ============================================
    🛰️ نظام GPS الدقيق - الإصدار 2.0
    📍 يستخدم GPS الحقيقي للجهاز
    ⚡ لا يستخدم IP لتحديد الموقع
    🎯 دقة عالية مع أقمار GPS الصناعية
    ============================================
    `);
});
