/* ============================================
   AI COUNTER — Main Application Logic
   Real-time object detection & counting
   using TensorFlow.js + COCO-SSD
   ============================================ */

// ============ COCO-SSD Object Categories ============
const COCO_OBJECTS = [
    // People & Animals
    { id: 'person', name: 'شخص', nameEn: 'Person', icon: '👤', category: 'أشخاص وحيوانات' },
    { id: 'cat', name: 'قطة', nameEn: 'Cat', icon: '🐱', category: 'أشخاص وحيوانات' },
    { id: 'dog', name: 'كلب', nameEn: 'Dog', icon: '🐕', category: 'أشخاص وحيوانات' },
    { id: 'bird', name: 'طائر', nameEn: 'Bird', icon: '🐦', category: 'أشخاص وحيوانات' },
    { id: 'horse', name: 'حصان', nameEn: 'Horse', icon: '🐴', category: 'أشخاص وحيوانات' },
    { id: 'sheep', name: 'خروف', nameEn: 'Sheep', icon: '🐑', category: 'أشخاص وحيوانات' },
    { id: 'cow', name: 'بقرة', nameEn: 'Cow', icon: '🐄', category: 'أشخاص وحيوانات' },
    { id: 'elephant', name: 'فيل', nameEn: 'Elephant', icon: '🐘', category: 'أشخاص وحيوانات' },
    { id: 'bear', name: 'دب', nameEn: 'Bear', icon: '🐻', category: 'أشخاص وحيوانات' },
    { id: 'zebra', name: 'حمار وحشي', nameEn: 'Zebra', icon: '🦓', category: 'أشخاص وحيوانات' },
    { id: 'giraffe', name: 'زرافة', nameEn: 'Giraffe', icon: '🦒', category: 'أشخاص وحيوانات' },

    // Vehicles
    { id: 'bicycle', name: 'دراجة', nameEn: 'Bicycle', icon: '🚲', category: 'مركبات' },
    { id: 'car', name: 'سيارة', nameEn: 'Car', icon: '🚗', category: 'مركبات' },
    { id: 'motorcycle', name: 'دراجة نارية', nameEn: 'Motorcycle', icon: '🏍️', category: 'مركبات' },
    { id: 'airplane', name: 'طائرة', nameEn: 'Airplane', icon: '✈️', category: 'مركبات' },
    { id: 'bus', name: 'حافلة', nameEn: 'Bus', icon: '🚌', category: 'مركبات' },
    { id: 'train', name: 'قطار', nameEn: 'Train', icon: '🚂', category: 'مركبات' },
    { id: 'truck', name: 'شاحنة', nameEn: 'Truck', icon: '🚛', category: 'مركبات' },
    { id: 'boat', name: 'قارب', nameEn: 'Boat', icon: '⛵', category: 'مركبات' },

    // Food & Drinks
    { id: 'bottle', name: 'زجاجة', nameEn: 'Bottle', icon: '🍾', category: 'طعام ومشروبات' },
    { id: 'wine glass', name: 'كأس', nameEn: 'Wine Glass', icon: '🍷', category: 'طعام ومشروبات' },
    { id: 'cup', name: 'كوب', nameEn: 'Cup', icon: '☕', category: 'طعام ومشروبات' },
    { id: 'fork', name: 'شوكة', nameEn: 'Fork', icon: '🍴', category: 'طعام ومشروبات' },
    { id: 'knife', name: 'سكين', nameEn: 'Knife', icon: '🔪', category: 'طعام ومشروبات' },
    { id: 'spoon', name: 'ملعقة', nameEn: 'Spoon', icon: '🥄', category: 'طعام ومشروبات' },
    { id: 'bowl', name: 'وعاء', nameEn: 'Bowl', icon: '🥣', category: 'طعام ومشروبات' },
    { id: 'banana', name: 'موزة', nameEn: 'Banana', icon: '🍌', category: 'طعام ومشروبات' },
    { id: 'apple', name: 'تفاحة', nameEn: 'Apple', icon: '🍎', category: 'طعام ومشروبات' },
    { id: 'sandwich', name: 'شطيرة', nameEn: 'Sandwich', icon: '🥪', category: 'طعام ومشروبات' },
    { id: 'orange', name: 'برتقالة', nameEn: 'Orange', icon: '🍊', category: 'طعام ومشروبات' },
    { id: 'broccoli', name: 'بروكلي', nameEn: 'Broccoli', icon: '🥦', category: 'طعام ومشروبات' },
    { id: 'carrot', name: 'جزرة', nameEn: 'Carrot', icon: '🥕', category: 'طعام ومشروبات' },
    { id: 'hot dog', name: 'هوت دوج', nameEn: 'Hot Dog', icon: '🌭', category: 'طعام ومشروبات' },
    { id: 'pizza', name: 'بيتزا', nameEn: 'Pizza', icon: '🍕', category: 'طعام ومشروبات' },
    { id: 'donut', name: 'دونات', nameEn: 'Donut', icon: '🍩', category: 'طعام ومشروبات' },
    { id: 'cake', name: 'كيك', nameEn: 'Cake', icon: '🎂', category: 'طعام ومشروبات' },

    // Furniture & Home
    { id: 'chair', name: 'كرسي', nameEn: 'Chair', icon: '🪑', category: 'أثاث ومنزل' },
    { id: 'couch', name: 'أريكة', nameEn: 'Couch', icon: '🛋️', category: 'أثاث ومنزل' },
    { id: 'potted plant', name: 'نبتة', nameEn: 'Plant', icon: '🪴', category: 'أثاث ومنزل' },
    { id: 'bed', name: 'سرير', nameEn: 'Bed', icon: '🛏️', category: 'أثاث ومنزل' },
    { id: 'dining table', name: 'طاولة', nameEn: 'Table', icon: '🪵', category: 'أثاث ومنزل' },
    { id: 'toilet', name: 'مرحاض', nameEn: 'Toilet', icon: '🚽', category: 'أثاث ومنزل' },
    { id: 'sink', name: 'حوض', nameEn: 'Sink', icon: '🚰', category: 'أثاث ومنزل' },
    { id: 'refrigerator', name: 'ثلاجة', nameEn: 'Fridge', icon: '🧊', category: 'أثاث ومنزل' },
    { id: 'microwave', name: 'ميكروويف', nameEn: 'Microwave', icon: '📦', category: 'أثاث ومنزل' },
    { id: 'oven', name: 'فرن', nameEn: 'Oven', icon: '🔥', category: 'أثاث ومنزل' },
    { id: 'toaster', name: 'محمصة', nameEn: 'Toaster', icon: '🍞', category: 'أثاث ومنزل' },

    // Electronics
    { id: 'tv', name: 'تلفاز', nameEn: 'TV', icon: '📺', category: 'إلكترونيات' },
    { id: 'laptop', name: 'لابتوب', nameEn: 'Laptop', icon: '💻', category: 'إلكترونيات' },
    { id: 'mouse', name: 'ماوس', nameEn: 'Mouse', icon: '🖱️', category: 'إلكترونيات' },
    { id: 'remote', name: 'ريموت', nameEn: 'Remote', icon: '📱', category: 'إلكترونيات' },
    { id: 'keyboard', name: 'لوحة مفاتيح', nameEn: 'Keyboard', icon: '⌨️', category: 'إلكترونيات' },
    { id: 'cell phone', name: 'هاتف', nameEn: 'Phone', icon: '📱', category: 'إلكترونيات' },

    // Objects & Accessories
    { id: 'backpack', name: 'حقيبة ظهر', nameEn: 'Backpack', icon: '🎒', category: 'أغراض' },
    { id: 'umbrella', name: 'مظلة', nameEn: 'Umbrella', icon: '☂️', category: 'أغراض' },
    { id: 'handbag', name: 'حقيبة يد', nameEn: 'Handbag', icon: '👜', category: 'أغراض' },
    { id: 'tie', name: 'ربطة عنق', nameEn: 'Tie', icon: '👔', category: 'أغراض' },
    { id: 'suitcase', name: 'حقيبة سفر', nameEn: 'Suitcase', icon: '🧳', category: 'أغراض' },
    { id: 'book', name: 'كتاب', nameEn: 'Book', icon: '📖', category: 'أغراض' },
    { id: 'clock', name: 'ساعة', nameEn: 'Clock', icon: '🕐', category: 'أغراض' },
    { id: 'vase', name: 'مزهرية', nameEn: 'Vase', icon: '🏺', category: 'أغراض' },
    { id: 'scissors', name: 'مقص', nameEn: 'Scissors', icon: '✂️', category: 'أغراض' },
    { id: 'teddy bear', name: 'دبدوب', nameEn: 'Teddy Bear', icon: '🧸', category: 'أغراض' },
    { id: 'hair drier', name: 'مجفف شعر', nameEn: 'Hair Drier', icon: '💨', category: 'أغراض' },
    { id: 'toothbrush', name: 'فرشاة أسنان', nameEn: 'Toothbrush', icon: '🪥', category: 'أغراض' },

    // Sports
    { id: 'frisbee', name: 'فريسبي', nameEn: 'Frisbee', icon: '🥏', category: 'رياضة' },
    { id: 'skis', name: 'تزلج', nameEn: 'Skis', icon: '🎿', category: 'رياضة' },
    { id: 'snowboard', name: 'سنوبورد', nameEn: 'Snowboard', icon: '🏂', category: 'رياضة' },
    { id: 'sports ball', name: 'كرة', nameEn: 'Ball', icon: '⚽', category: 'رياضة' },
    { id: 'kite', name: 'طائرة ورقية', nameEn: 'Kite', icon: '🪁', category: 'رياضة' },
    { id: 'baseball bat', name: 'مضرب بيسبول', nameEn: 'Baseball Bat', icon: '🏏', category: 'رياضة' },
    { id: 'baseball glove', name: 'قفاز بيسبول', nameEn: 'Glove', icon: '🧤', category: 'رياضة' },
    { id: 'skateboard', name: 'سكيتبورد', nameEn: 'Skateboard', icon: '🛹', category: 'رياضة' },
    { id: 'surfboard', name: 'لوح ركوب أمواج', nameEn: 'Surfboard', icon: '🏄', category: 'رياضة' },
    { id: 'tennis racket', name: 'مضرب تنس', nameEn: 'Tennis Racket', icon: '🎾', category: 'رياضة' },

    // Street Objects
    { id: 'traffic light', name: 'إشارة مرور', nameEn: 'Traffic Light', icon: '🚦', category: 'شارع' },
    { id: 'fire hydrant', name: 'صنبور إطفاء', nameEn: 'Fire Hydrant', icon: '🧯', category: 'شارع' },
    { id: 'stop sign', name: 'علامة توقف', nameEn: 'Stop Sign', icon: '🛑', category: 'شارع' },
    { id: 'parking meter', name: 'عداد مواقف', nameEn: 'Parking Meter', icon: '🅿️', category: 'شارع' },
    { id: 'bench', name: 'مقعد', nameEn: 'Bench', icon: '💺', category: 'شارع' },
];

// ============ Detection Colors ============
const DETECTION_COLORS = [
    '#6C5CE7', '#00D2FF', '#FF6B6B', '#FFE66D', '#00E676',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#01A3A4', '#F368E0',
    '#FF6348', '#7BED9F', '#70A1FF', '#FFA502', '#2ED573',
    '#1E90FF', '#FF4757', '#2F3542', '#ECCC68', '#A4B0BE',
];

// ============ App State ============
const state = {
    model: null,
    stream: null,
    facingMode: 'environment',
    isRunning: true,
    isPaused: false,
    selectedObjects: new Set(['person', 'car', 'bottle', 'cell phone', 'cup']),
    confidenceThreshold: 0.5,
    showBoxes: true,
    showLabels: true,
    soundEnabled: false,
    vibrateEnabled: true,
    lastCounts: {},
    colorMap: {},
    fps: 0,
    frameCount: 0,
    lastFpsTime: performance.now(),
    animationFrameId: null,
};

// ============ DOM Elements ============
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const els = {
    splash: $('#splash-screen'),
    splashProgress: $('#splash-progress-bar'),
    splashStatus: $('#splash-status'),
    app: $('#app'),
    video: $('#camera-feed'),
    canvas: $('#detection-canvas'),
    mainCount: $('#main-count'),
    mainCountLabel: $('#main-count-label'),
    statsBar: $('#stats-bar'),
    fpsValue: $('#fps-value'),
    fpsBadge: $('#fps-badge'),
    selectionPanel: $('#selection-panel'),
    settingsPanel: $('#settings-panel'),
    panelOverlay: $('#panel-overlay'),
    objectsGrid: $('#objects-grid'),
    searchInput: $('#search-objects'),
    selectionCount: $('#selection-count'),
    confidenceSlider: $('#confidence-slider'),
    confidenceValue: $('#confidence-value'),
    capturePreview: $('#capture-preview'),
    captureCanvas: $('#capture-canvas'),
    captureInfo: $('#capture-info'),
    toastContainer: $('#toast-container'),
};

// ============ Initialization ============
async function init() {
    try {
        updateSplash(10, 'جاري تهيئة التطبيق...');
        
        // Assign colors to objects
        COCO_OBJECTS.forEach((obj, i) => {
            state.colorMap[obj.id] = DETECTION_COLORS[i % DETECTION_COLORS.length];
        });

        updateSplash(30, 'جاري تحميل نموذج الذكاء الاصطناعي...');
        
        // Load COCO-SSD model
        state.model = await cocoSsd.load({
            base: 'lite_mobilenet_v2'
        });
        
        updateSplash(70, 'جاري تشغيل الكاميرا...');
        
        // Start camera
        await startCamera();
        
        updateSplash(90, 'جاري الإعداد النهائي...');
        
        // Setup UI
        setupEventListeners();
        renderObjectsGrid();
        updateSelectionCount();
        
        updateSplash(100, 'جاهز!');
        
        // Hide splash after animation
        setTimeout(() => {
            els.splash.classList.add('fade-out');
            els.app.classList.remove('hidden');
            
            setTimeout(() => {
                els.splash.style.display = 'none';
                // Start detection loop
                startDetection();
            }, 600);
        }, 500);
        
    } catch (error) {
        console.error('Initialization error:', error);
        updateSplash(0, `خطأ: ${error.message}`);
        showToast('فشل في تهيئة التطبيق. يرجى التأكد من إعطاء صلاحية الكاميرا.', 'error');
    }
}

function updateSplash(progress, message) {
    els.splashProgress.style.width = `${progress}%`;
    els.splashStatus.textContent = message;
}

// ============ Camera ============
async function startCamera() {
    // Stop existing stream
    if (state.stream) {
        state.stream.getTracks().forEach(track => track.stop());
    }
    
    const constraints = {
        video: {
            facingMode: state.facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 },
        },
        audio: false,
    };
    
    try {
        state.stream = await navigator.mediaDevices.getUserMedia(constraints);
        els.video.srcObject = state.stream;
        
        await new Promise((resolve) => {
            els.video.onloadedmetadata = () => {
                els.video.play();
                resolve();
            };
        });
        
        // Resize canvas to match video
        resizeCanvas();
        
    } catch (err) {
        // Try fallback without specific facing mode
        if (state.facingMode === 'environment') {
            state.facingMode = 'user';
            return startCamera();
        }
        throw new Error('لا يمكن الوصول إلى الكاميرا. يرجى التأكد من الصلاحيات.');
    }
}

function resizeCanvas() {
    const container = $('#camera-container');
    els.canvas.width = container.clientWidth;
    els.canvas.height = container.clientHeight;
}

async function switchCamera() {
    state.facingMode = state.facingMode === 'environment' ? 'user' : 'environment';
    await startCamera();
    showToast(state.facingMode === 'environment' ? '📷 الكاميرا الخلفية' : '🤳 الكاميرا الأمامية');
}

// ============ Detection Loop ============
function startDetection() {
    state.isRunning = true;
    detectFrame();
}

function stopDetection() {
    state.isRunning = false;
    if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
    }
}

async function detectFrame() {
    if (!state.isRunning || !state.model) return;
    
    if (!state.isPaused && els.video.readyState >= 2) {
        try {
            const predictions = await state.model.detect(els.video);
            
            // Filter predictions
            const filtered = predictions.filter(p => 
                state.selectedObjects.has(p.class) && 
                p.score >= state.confidenceThreshold
            );
            
            // Draw results
            drawDetections(filtered);
            
            // Update counts
            updateCounts(filtered);
            
            // Update FPS
            updateFPS();
            
        } catch (err) {
            console.error('Detection error:', err);
        }
    }
    
    state.animationFrameId = requestAnimationFrame(detectFrame);
}

// ============ Drawing ============
function drawDetections(predictions) {
    const ctx = els.canvas.getContext('2d');
    const scaleX = els.canvas.width / els.video.videoWidth;
    const scaleY = els.canvas.height / els.video.videoHeight;
    
    ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
    
    predictions.forEach((pred) => {
        const [x, y, width, height] = pred.bbox;
        const sx = x * scaleX;
        const sy = y * scaleY;
        const sw = width * scaleX;
        const sh = height * scaleY;
        const color = state.colorMap[pred.class] || '#6C5CE7';
        const objInfo = COCO_OBJECTS.find(o => o.id === pred.class);
        const label = objInfo ? objInfo.name : pred.class;
        const confidence = Math.round(pred.score * 100);
        
        if (state.showBoxes) {
            // Draw box with rounded corners
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.setLineDash([]);
            
            const r = 8;
            ctx.beginPath();
            ctx.moveTo(sx + r, sy);
            ctx.lineTo(sx + sw - r, sy);
            ctx.quadraticCurveTo(sx + sw, sy, sx + sw, sy + r);
            ctx.lineTo(sx + sw, sy + sh - r);
            ctx.quadraticCurveTo(sx + sw, sy + sh, sx + sw - r, sy + sh);
            ctx.lineTo(sx + r, sy + sh);
            ctx.quadraticCurveTo(sx, sy + sh, sx, sy + sh - r);
            ctx.lineTo(sx, sy + r);
            ctx.quadraticCurveTo(sx, sy, sx + r, sy);
            ctx.closePath();
            ctx.stroke();
            
            // Semi-transparent fill
            ctx.fillStyle = color + '15';
            ctx.fill();
            
            // Corner accents
            const cornerLen = Math.min(20, sw * 0.2, sh * 0.2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3.5;
            ctx.lineCap = 'round';
            
            // Top-left
            ctx.beginPath();
            ctx.moveTo(sx, sy + cornerLen);
            ctx.lineTo(sx, sy + r);
            ctx.quadraticCurveTo(sx, sy, sx + r, sy);
            ctx.lineTo(sx + cornerLen, sy);
            ctx.stroke();
            
            // Top-right
            ctx.beginPath();
            ctx.moveTo(sx + sw - cornerLen, sy);
            ctx.lineTo(sx + sw - r, sy);
            ctx.quadraticCurveTo(sx + sw, sy, sx + sw, sy + r);
            ctx.lineTo(sx + sw, sy + cornerLen);
            ctx.stroke();
            
            // Bottom-left
            ctx.beginPath();
            ctx.moveTo(sx, sy + sh - cornerLen);
            ctx.lineTo(sx, sy + sh - r);
            ctx.quadraticCurveTo(sx, sy + sh, sx + r, sy + sh);
            ctx.lineTo(sx + cornerLen, sy + sh);
            ctx.stroke();
            
            // Bottom-right
            ctx.beginPath();
            ctx.moveTo(sx + sw - cornerLen, sy + sh);
            ctx.lineTo(sx + sw - r, sy + sh);
            ctx.quadraticCurveTo(sx + sw, sy + sh, sx + sw, sy + sh - r);
            ctx.lineTo(sx + sw, sy + sh - cornerLen);
            ctx.stroke();
        }
        
        if (state.showLabels) {
            // Draw label background
            const labelText = `${label} ${confidence}%`;
            ctx.font = '600 13px Cairo, Inter, sans-serif';
            const textMetrics = ctx.measureText(labelText);
            const labelW = textMetrics.width + 16;
            const labelH = 26;
            const labelX = sx;
            const labelY = sy - labelH - 4;
            
            // Label background pill
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(labelX, Math.max(0, labelY), labelW, labelH, 8);
            ctx.fill();
            
            // Label text
            ctx.fillStyle = '#FFFFFF';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'left';
            ctx.fillText(labelText, labelX + 8, Math.max(0, labelY) + labelH / 2);
        }
    });
}

// ============ Counting ============
function updateCounts(predictions) {
    const counts = {};
    predictions.forEach(p => {
        counts[p.class] = (counts[p.class] || 0) + 1;
    });
    
    // Check for count changes (for haptic/sound feedback)
    const totalOld = Object.values(state.lastCounts).reduce((a, b) => a + b, 0);
    const totalNew = Object.values(counts).reduce((a, b) => a + b, 0);
    
    if (totalNew !== totalOld && totalNew > 0) {
        if (state.vibrateEnabled && navigator.vibrate && totalNew > totalOld) {
            navigator.vibrate(30);
        }
        if (state.soundEnabled && totalNew > totalOld) {
            playBeep();
        }
    }
    
    state.lastCounts = counts;
    
    // Update main count display
    const selectedArr = Array.from(state.selectedObjects);
    let mainTotal = 0;
    let mainLabel = '';
    
    if (selectedArr.length === 0) {
        mainLabel = 'لم يتم التحديد';
    } else if (selectedArr.length === 1) {
        const obj = COCO_OBJECTS.find(o => o.id === selectedArr[0]);
        mainLabel = obj ? obj.name : selectedArr[0];
        mainTotal = counts[selectedArr[0]] || 0;
    } else {
        mainLabel = `${selectedArr.length} أنواع`;
        mainTotal = Object.values(counts).reduce((a, b) => a + b, 0);
    }
    
    // Animate count change
    const currentCount = parseInt(els.mainCount.textContent);
    if (currentCount !== mainTotal) {
        els.mainCount.textContent = mainTotal;
        els.mainCount.classList.remove('bump');
        void els.mainCount.offsetWidth; // Force reflow
        els.mainCount.classList.add('bump');
    }
    els.mainCountLabel.textContent = mainLabel;
    
    // Update stats bar
    updateStatsBar(counts);
}

function updateStatsBar(counts) {
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    
    // Only update if counts changed
    const statsKey = JSON.stringify(entries);
    if (state.lastStatsKey === statsKey) return;
    state.lastStatsKey = statsKey;
    
    let html = '';
    entries.forEach(([className, count]) => {
        const obj = COCO_OBJECTS.find(o => o.id === className);
        const color = state.colorMap[className] || '#6C5CE7';
        const name = obj ? `${obj.icon} ${obj.name}` : className;
        
        html += `
            <div class="stat-chip">
                <div class="stat-chip-color" style="background: ${color}"></div>
                <span class="stat-chip-name">${name}</span>
                <span class="stat-chip-count">${count}</span>
            </div>
        `;
    });
    
    if (entries.length === 0 && state.selectedObjects.size > 0) {
        html = `
            <div class="stat-chip">
                <span class="stat-chip-name" style="color: var(--text-tertiary)">🔍 جاري البحث...</span>
            </div>
        `;
    }
    
    els.statsBar.innerHTML = html;
}

// ============ FPS Counter ============
function updateFPS() {
    state.frameCount++;
    const now = performance.now();
    const elapsed = now - state.lastFpsTime;
    
    if (elapsed >= 1000) {
        state.fps = Math.round((state.frameCount * 1000) / elapsed);
        state.frameCount = 0;
        state.lastFpsTime = now;
        els.fpsValue.textContent = state.fps;
    }
}

// ============ Sound ============
function playBeep() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.frequency.value = 880;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
        // Ignore audio errors
    }
}

// ============ Object Selection Panel ============
function renderObjectsGrid(filter = '') {
    const categories = {};
    
    COCO_OBJECTS.forEach(obj => {
        if (filter) {
            const q = filter.toLowerCase();
            if (!obj.name.includes(q) && !obj.nameEn.toLowerCase().includes(q) && !obj.id.includes(q)) {
                return;
            }
        }
        if (!categories[obj.category]) {
            categories[obj.category] = [];
        }
        categories[obj.category].push(obj);
    });
    
    let html = '';
    
    if (Object.keys(categories).length === 0) {
        html = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                </svg>
                <p>لم يتم العثور على نتائج</p>
            </div>
        `;
    } else {
        Object.entries(categories).forEach(([category, objects]) => {
            html += `<div class="category-header">${category}</div>`;
            
            objects.forEach(obj => {
                const isSelected = state.selectedObjects.has(obj.id);
                html += `
                    <div class="object-card ${isSelected ? 'selected' : ''}" data-id="${obj.id}">
                        <div class="object-card-check">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <span class="object-card-icon">${obj.icon}</span>
                        <span class="object-card-name">${obj.name}</span>
                    </div>
                `;
            });
        });
    }
    
    els.objectsGrid.innerHTML = html;
    
    // Add click listeners
    els.objectsGrid.querySelectorAll('.object-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            if (state.selectedObjects.has(id)) {
                state.selectedObjects.delete(id);
                card.classList.remove('selected');
            } else {
                state.selectedObjects.add(id);
                card.classList.add('selected');
            }
            updateSelectionCount();
        });
    });
}

function updateSelectionCount() {
    els.selectionCount.textContent = state.selectedObjects.size;
}

function openSelectionPanel() {
    els.selectionPanel.classList.remove('hidden');
    els.panelOverlay.classList.remove('hidden');
    els.searchInput.value = '';
    renderObjectsGrid();
}

function closeSelectionPanel() {
    els.selectionPanel.classList.add('hidden');
    els.panelOverlay.classList.add('hidden');
}

// ============ Settings Panel ============
function openSettingsPanel() {
    els.settingsPanel.classList.remove('hidden');
    els.panelOverlay.classList.remove('hidden');
}

function closeSettingsPanel() {
    els.settingsPanel.classList.add('hidden');
    els.panelOverlay.classList.add('hidden');
}

// ============ Capture ============
function captureFrame() {
    const captureCanvas = els.captureCanvas;
    const ctx = captureCanvas.getContext('2d');
    
    // Set canvas size to video size
    captureCanvas.width = els.video.videoWidth;
    captureCanvas.height = els.video.videoHeight;
    
    // Draw video frame
    ctx.drawImage(els.video, 0, 0);
    
    // Draw detections on capture
    const predictions = Object.entries(state.lastCounts);
    const detCanvas = els.canvas;
    const scaleX = els.video.videoWidth / detCanvas.width;
    const scaleY = els.video.videoHeight / detCanvas.height;
    
    // Copy detection overlay
    ctx.drawImage(detCanvas, 0, 0, detCanvas.width, detCanvas.height, 0, 0, captureCanvas.width, captureCanvas.height);
    
    // Add watermark
    const watermark = 'AI Counter';
    ctx.font = '600 16px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.textAlign = 'right';
    ctx.fillText(watermark, captureCanvas.width - 16, captureCanvas.height - 16);
    
    // Show capture info
    let infoHtml = '';
    const totalCount = Object.values(state.lastCounts).reduce((a, b) => a + b, 0);
    infoHtml += `<div class="capture-info-item"><span>إجمالي العدد</span><span>${totalCount}</span></div>`;
    
    Object.entries(state.lastCounts).forEach(([className, count]) => {
        const obj = COCO_OBJECTS.find(o => o.id === className);
        const name = obj ? `${obj.icon} ${obj.name}` : className;
        infoHtml += `<div class="capture-info-item"><span>${name}</span><span>${count}</span></div>`;
    });
    
    infoHtml += `<div class="capture-info-item"><span>التاريخ</span><span>${new Date().toLocaleString('ar-EG')}</span></div>`;
    
    els.captureInfo.innerHTML = infoHtml;
    els.capturePreview.classList.remove('hidden');
    
    showToast('📸 تم التقاط الصورة');
}

function downloadCapture() {
    const link = document.createElement('a');
    link.download = `ai-counter-${Date.now()}.png`;
    link.href = els.captureCanvas.toDataURL('image/png');
    link.click();
    showToast('✅ تم تحميل الصورة');
}

// ============ Toast Notifications ============
function showToast(message, type = '') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    els.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ============ Event Listeners ============
function setupEventListeners() {
    // Camera switch
    $('#btn-switch-camera').addEventListener('click', switchCamera);
    
    // Select objects
    $('#btn-select-objects').addEventListener('click', openSelectionPanel);
    $('#btn-close-panel').addEventListener('click', closeSelectionPanel);
    $('#btn-apply-selection').addEventListener('click', () => {
        closeSelectionPanel();
        const count = state.selectedObjects.size;
        showToast(`✅ تم تحديد ${count} ${count === 1 ? 'شيء' : 'أشياء'} للعدّ`);
    });
    
    // Selection actions
    $('#btn-select-all').addEventListener('click', () => {
        COCO_OBJECTS.forEach(obj => state.selectedObjects.add(obj.id));
        renderObjectsGrid(els.searchInput.value);
        updateSelectionCount();
    });
    
    $('#btn-deselect-all').addEventListener('click', () => {
        state.selectedObjects.clear();
        renderObjectsGrid(els.searchInput.value);
        updateSelectionCount();
    });
    
    // Search
    els.searchInput.addEventListener('input', (e) => {
        renderObjectsGrid(e.target.value);
    });
    
    // Settings
    $('#btn-settings').addEventListener('click', openSettingsPanel);
    $('#btn-close-settings').addEventListener('click', closeSettingsPanel);
    
    // Overlay close
    els.panelOverlay.addEventListener('click', () => {
        closeSelectionPanel();
        closeSettingsPanel();
    });
    
    // Confidence slider
    els.confidenceSlider.addEventListener('input', (e) => {
        state.confidenceThreshold = e.target.value / 100;
        els.confidenceValue.textContent = `${e.target.value}%`;
    });
    
    // Toggles
    $('#toggle-boxes').addEventListener('change', (e) => {
        state.showBoxes = e.target.checked;
    });
    
    $('#toggle-labels').addEventListener('change', (e) => {
        state.showLabels = e.target.checked;
    });
    
    $('#toggle-sound').addEventListener('change', (e) => {
        state.soundEnabled = e.target.checked;
    });
    
    $('#toggle-vibrate').addEventListener('change', (e) => {
        state.vibrateEnabled = e.target.checked;
    });
    
    // Pause/Resume
    $('#btn-pause').addEventListener('click', () => {
        state.isPaused = !state.isPaused;
        const btn = $('#btn-pause');
        
        if (state.isPaused) {
            btn.classList.add('paused');
            btn.innerHTML = `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
            `;
            showToast('⏸ تم إيقاف الكشف مؤقتاً');
        } else {
            btn.classList.remove('paused');
            btn.innerHTML = `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="6" y="4" width="4" height="16" rx="1"/>
                    <rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
            `;
            showToast('▶ تم استئناف الكشف');
        }
    });
    
    // Capture
    $('#btn-capture').addEventListener('click', captureFrame);
    $('#btn-close-capture').addEventListener('click', () => {
        els.capturePreview.classList.add('hidden');
    });
    $('#btn-download-capture').addEventListener('click', downloadCapture);
    
    // Window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Prevent zoom on double tap
    document.addEventListener('dblclick', (e) => e.preventDefault());
}

// ============ Start App ============
document.addEventListener('DOMContentLoaded', init);
