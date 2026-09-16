/* ============================================
   AI COUNTER — Main Application Logic
   Real-time object detection & counting
   using ONNX Runtime Web + YOLO26n
   ============================================ */

// ============ COCO 80 Classes ============
const COCO_CLASSES = [
    'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat',
    'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat',
    'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack',
    'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
    'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
    'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
    'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair',
    'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse',
    'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink',
    'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
];

// ============ Object metadata (Arabic names + icons) ============
const OBJECT_META = {
    'person': { name: 'شخص', icon: '👤', category: 'أشخاص وحيوانات' },
    'cat': { name: 'قطة', icon: '🐱', category: 'أشخاص وحيوانات' },
    'dog': { name: 'كلب', icon: '🐕', category: 'أشخاص وحيوانات' },
    'bird': { name: 'طائر', icon: '🐦', category: 'أشخاص وحيوانات' },
    'horse': { name: 'حصان', icon: '🐴', category: 'أشخاص وحيوانات' },
    'sheep': { name: 'خروف', icon: '🐑', category: 'أشخاص وحيوانات' },
    'cow': { name: 'بقرة', icon: '🐄', category: 'أشخاص وحيوانات' },
    'elephant': { name: 'فيل', icon: '🐘', category: 'أشخاص وحيوانات' },
    'bear': { name: 'دب', icon: '🐻', category: 'أشخاص وحيوانات' },
    'zebra': { name: 'حمار وحشي', icon: '🦓', category: 'أشخاص وحيوانات' },
    'giraffe': { name: 'زرافة', icon: '🦒', category: 'أشخاص وحيوانات' },
    'bicycle': { name: 'دراجة', icon: '🚲', category: 'مركبات' },
    'car': { name: 'سيارة', icon: '🚗', category: 'مركبات' },
    'motorcycle': { name: 'دراجة نارية', icon: '🏍️', category: 'مركبات' },
    'airplane': { name: 'طائرة', icon: '✈️', category: 'مركبات' },
    'bus': { name: 'حافلة', icon: '🚌', category: 'مركبات' },
    'train': { name: 'قطار', icon: '🚂', category: 'مركبات' },
    'truck': { name: 'شاحنة', icon: '🚛', category: 'مركبات' },
    'boat': { name: 'قارب', icon: '⛵', category: 'مركبات' },
    'bottle': { name: 'زجاجة', icon: '🍾', category: 'طعام ومشروبات' },
    'wine glass': { name: 'كأس', icon: '🍷', category: 'طعام ومشروبات' },
    'cup': { name: 'كوب', icon: '☕', category: 'طعام ومشروبات' },
    'fork': { name: 'شوكة', icon: '🍴', category: 'طعام ومشروبات' },
    'knife': { name: 'سكين', icon: '🔪', category: 'طعام ومشروبات' },
    'spoon': { name: 'ملعقة', icon: '🥄', category: 'طعام ومشروبات' },
    'bowl': { name: 'وعاء', icon: '🥣', category: 'طعام ومشروبات' },
    'banana': { name: 'موزة', icon: '🍌', category: 'طعام ومشروبات' },
    'apple': { name: 'تفاحة', icon: '🍎', category: 'طعام ومشروبات' },
    'sandwich': { name: 'شطيرة', icon: '🥪', category: 'طعام ومشروبات' },
    'orange': { name: 'برتقالة', icon: '🍊', category: 'طعام ومشروبات' },
    'broccoli': { name: 'بروكلي', icon: '🥦', category: 'طعام ومشروبات' },
    'carrot': { name: 'جزرة', icon: '🥕', category: 'طعام ومشروبات' },
    'hot dog': { name: 'هوت دوج', icon: '🌭', category: 'طعام ومشروبات' },
    'pizza': { name: 'بيتزا', icon: '🍕', category: 'طعام ومشروبات' },
    'donut': { name: 'دونات', icon: '🍩', category: 'طعام ومشروبات' },
    'cake': { name: 'كيك', icon: '🎂', category: 'طعام ومشروبات' },
    'chair': { name: 'كرسي', icon: '🪑', category: 'أثاث ومنزل' },
    'couch': { name: 'أريكة', icon: '🛋️', category: 'أثاث ومنزل' },
    'potted plant': { name: 'نبتة', icon: '🪴', category: 'أثاث ومنزل' },
    'bed': { name: 'سرير', icon: '🛏️', category: 'أثاث ومنزل' },
    'dining table': { name: 'طاولة', icon: '🪵', category: 'أثاث ومنزل' },
    'toilet': { name: 'مرحاض', icon: '🚽', category: 'أثاث ومنزل' },
    'sink': { name: 'حوض', icon: '🚰', category: 'أثاث ومنزل' },
    'refrigerator': { name: 'ثلاجة', icon: '🧊', category: 'أثاث ومنزل' },
    'microwave': { name: 'ميكروويف', icon: '📦', category: 'أثاث ومنزل' },
    'oven': { name: 'فرن', icon: '🔥', category: 'أثاث ومنزل' },
    'toaster': { name: 'محمصة', icon: '🍞', category: 'أثاث ومنزل' },
    'tv': { name: 'تلفاز', icon: '📺', category: 'إلكترونيات' },
    'laptop': { name: 'لابتوب', icon: '💻', category: 'إلكترونيات' },
    'mouse': { name: 'ماوس', icon: '🖱️', category: 'إلكترونيات' },
    'remote': { name: 'ريموت', icon: '📱', category: 'إلكترونيات' },
    'keyboard': { name: 'لوحة مفاتيح', icon: '⌨️', category: 'إلكترونيات' },
    'cell phone': { name: 'هاتف', icon: '📱', category: 'إلكترونيات' },
    'backpack': { name: 'حقيبة ظهر', icon: '🎒', category: 'أغراض' },
    'umbrella': { name: 'مظلة', icon: '☂️', category: 'أغراض' },
    'handbag': { name: 'حقيبة يد', icon: '👜', category: 'أغراض' },
    'tie': { name: 'ربطة عنق', icon: '👔', category: 'أغراض' },
    'suitcase': { name: 'حقيبة سفر', icon: '🧳', category: 'أغراض' },
    'book': { name: 'كتاب', icon: '📖', category: 'أغراض' },
    'clock': { name: 'ساعة', icon: '🕐', category: 'أغراض' },
    'vase': { name: 'مزهرية', icon: '🏺', category: 'أغراض' },
    'scissors': { name: 'مقص', icon: '✂️', category: 'أغراض' },
    'teddy bear': { name: 'دبدوب', icon: '🧸', category: 'أغراض' },
    'hair drier': { name: 'مجفف شعر', icon: '💨', category: 'أغراض' },
    'toothbrush': { name: 'فرشاة أسنان', icon: '🪥', category: 'أغراض' },
    'frisbee': { name: 'فريسبي', icon: '🥏', category: 'رياضة' },
    'skis': { name: 'تزلج', icon: '🎿', category: 'رياضة' },
    'snowboard': { name: 'سنوبورد', icon: '🏂', category: 'رياضة' },
    'sports ball': { name: 'كرة', icon: '⚽', category: 'رياضة' },
    'kite': { name: 'طائرة ورقية', icon: '🪁', category: 'رياضة' },
    'baseball bat': { name: 'مضرب بيسبول', icon: '🏏', category: 'رياضة' },
    'baseball glove': { name: 'قفاز بيسبول', icon: '🧤', category: 'رياضة' },
    'skateboard': { name: 'سكيتبورد', icon: '🛹', category: 'رياضة' },
    'surfboard': { name: 'لوح ركوب أمواج', icon: '🏄', category: 'رياضة' },
    'tennis racket': { name: 'مضرب تنس', icon: '🎾', category: 'رياضة' },
    'traffic light': { name: 'إشارة مرور', icon: '🚦', category: 'شارع' },
    'fire hydrant': { name: 'صنبور إطفاء', icon: '🧯', category: 'شارع' },
    'stop sign': { name: 'علامة توقف', icon: '🛑', category: 'شارع' },
    'parking meter': { name: 'عداد مواقف', icon: '🅿️', category: 'شارع' },
    'bench': { name: 'مقعد', icon: '💺', category: 'شارع' },
};

// Build full object list for the selection panel
const COCO_OBJECTS = COCO_CLASSES.map((id, i) => ({
    id,
    name: OBJECT_META[id]?.name || id,
    nameEn: id.charAt(0).toUpperCase() + id.slice(1),
    icon: OBJECT_META[id]?.icon || '📦',
    category: OBJECT_META[id]?.category || 'أخرى',
}));

// ============ Detection Colors ============
const DETECTION_COLORS = [
    '#6C5CE7', '#00D2FF', '#FF6B6B', '#FFE66D', '#00E676',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#01A3A4', '#F368E0',
    '#FF6348', '#7BED9F', '#70A1FF', '#FFA502', '#2ED573',
    '#1E90FF', '#FF4757', '#2F3542', '#ECCC68', '#A4B0BE',
];

// ============ App State ============
const state = {
    session: null,         // ONNX InferenceSession
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
    lastStatsKey: '',
    colorMap: {},
    fps: 0,
    frameCount: 0,
    lastFpsTime: performance.now(),
    animationFrameId: null,
    modelInputSize: 640,   // YOLO26n expects 640x640
    // Offscreen canvas for preprocessing
    preprocessCanvas: null,
    preprocessCtx: null,
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

        // Assign colors
        COCO_OBJECTS.forEach((obj, i) => {
            state.colorMap[obj.id] = DETECTION_COLORS[i % DETECTION_COLORS.length];
        });

        // Create offscreen canvas for preprocessing
        state.preprocessCanvas = document.createElement('canvas');
        state.preprocessCanvas.width = state.modelInputSize;
        state.preprocessCanvas.height = state.modelInputSize;
        state.preprocessCtx = state.preprocessCanvas.getContext('2d', { willReadFrequently: true });

        updateSplash(20, 'جاري تحميل محرك ONNX Runtime...');

        // Wait for ort to be available
        while (typeof ort === 'undefined') {
            await new Promise(r => setTimeout(r, 100));
        }

        updateSplash(40, 'جاري تحميل نموذج YOLO26n (≈10 MB)...');

        // Configure ONNX Runtime
        ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/';

        // Load YOLO26n ONNX model
        const modelUrl = './yolo26n.onnx';
        state.session = await ort.InferenceSession.create(modelUrl, {
            executionProviders: ['wasm'],
            graphOptimizationLevel: 'all',
        });

        console.log('[YOLO26n] Model loaded successfully');
        console.log('[YOLO26n] Input names:', state.session.inputNames);
        console.log('[YOLO26n] Output names:', state.session.outputNames);

        updateSplash(70, 'جاري تشغيل الكاميرا...');

        // Start camera
        await startCamera();

        updateSplash(90, 'جاري الإعداد النهائي...');

        // Setup UI
        setupEventListeners();
        renderObjectsGrid();
        updateSelectionCount();

        updateSplash(100, 'جاهز!');

        // Hide splash
        setTimeout(() => {
            els.splash.classList.add('fade-out');
            els.app.classList.remove('hidden');
            setTimeout(() => {
                els.splash.style.display = 'none';
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
            els.video.onloadedmetadata = () => { els.video.play(); resolve(); };
        });
        resizeCanvas();
    } catch (err) {
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

// ============ YOLO26n Preprocessing ============
function preprocessFrame() {
    const ctx = state.preprocessCtx;
    const size = state.modelInputSize;
    const video = els.video;

    // Draw video frame resized to 640x640 (letterbox)
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const scale = Math.min(size / vw, size / vh);
    const nw = Math.round(vw * scale);
    const nh = Math.round(vh * scale);
    const dx = Math.round((size - nw) / 2);
    const dy = Math.round((size - nh) / 2);

    // Clear with gray (letterbox padding)
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(video, dx, dy, nw, nh);

    // Get pixel data
    const imageData = ctx.getImageData(0, 0, size, size);
    const pixels = imageData.data;

    // Convert to CHW float32 tensor [1, 3, 640, 640], normalized to [0, 1]
    const totalPixels = size * size;
    const float32Data = new Float32Array(3 * totalPixels);

    for (let i = 0; i < totalPixels; i++) {
        const srcIdx = i * 4;
        float32Data[i] = pixels[srcIdx] / 255.0;                    // R
        float32Data[totalPixels + i] = pixels[srcIdx + 1] / 255.0;  // G
        float32Data[2 * totalPixels + i] = pixels[srcIdx + 2] / 255.0; // B
    }

    return {
        tensor: new ort.Tensor('float32', float32Data, [1, 3, size, size]),
        scale,
        dx,
        dy,
    };
}

// ============ YOLO26n Postprocessing ============
function postprocess(outputs, preInfo) {
    const outputNames = Object.keys(outputs);
    const results = [];

    // Detect output format
    // Standard YOLO: single output [1, 84, N] (4 box + 80 classes)
    // E2E YOLO: multiple outputs (num_dets, boxes, scores, labels)

    if (outputNames.length >= 3) {
        // End-to-End format (NMS-free)
        return postprocessE2E(outputs, outputNames, preInfo);
    } else {
        // Standard YOLO format — need manual NMS
        return postprocessStandard(outputs, outputNames, preInfo);
    }
}

function postprocessE2E(outputs, outputNames, preInfo) {
    const results = [];
    // Find outputs by shape heuristics
    let numDets, boxes, scores, labels;

    for (const name of outputNames) {
        const tensor = outputs[name];
        const dims = tensor.dims;
        if (dims.length === 2 && dims[1] === 1) numDets = tensor;
        else if (dims.length === 3 && dims[2] === 4) boxes = tensor;
        else if (dims.length === 2 && dims[1] > 1) scores = tensor;
        else if (dims.length === 2 && dims[1] > 1 && !scores) labels = tensor;
    }

    // Fallback: try by name patterns
    if (!boxes) {
        for (const name of outputNames) {
            const t = outputs[name];
            if (name.includes('box') || name.includes('det_boxes')) boxes = t;
            else if (name.includes('score') || name.includes('det_scores')) scores = t;
            else if (name.includes('label') || name.includes('class') || name.includes('det_classes')) labels = t;
            else if (name.includes('num')) numDets = t;
        }
    }

    if (!boxes || !scores || !labels) return results;

    const count = numDets ? numDets.data[0] : Math.min(scores.data.length, 100);
    const boxData = boxes.data;
    const scoreData = scores.data;
    const labelData = labels.data;
    const { scale, dx, dy } = preInfo;

    for (let i = 0; i < count; i++) {
        const score = scoreData[i];
        if (score < state.confidenceThreshold) continue;

        const classId = Math.round(labelData[i]);
        if (classId < 0 || classId >= COCO_CLASSES.length) continue;

        const className = COCO_CLASSES[classId];
        if (!state.selectedObjects.has(className)) continue;

        // Convert from model coords to original video coords
        const x1 = (boxData[i * 4] - dx) / scale;
        const y1 = (boxData[i * 4 + 1] - dy) / scale;
        const x2 = (boxData[i * 4 + 2] - dx) / scale;
        const y2 = (boxData[i * 4 + 3] - dy) / scale;

        results.push({
            class: className,
            score,
            bbox: [x1, y1, x2 - x1, y2 - y1], // x, y, width, height
        });
    }

    return results;
}

function postprocessStandard(outputs, outputNames, preInfo) {
    const results = [];
    const output = outputs[outputNames[0]];
    const dims = output.dims;
    const data = output.data;

    // Output shape: [1, 84, N] where 84 = 4 (box) + 80 (classes)
    // Or transposed: [1, N, 84]
    let numPredictions, numChannels;
    let transposed = false;

    if (dims.length === 3) {
        if (dims[1] === 4 + COCO_CLASSES.length) {
            // [1, 84, N]
            numChannels = dims[1];
            numPredictions = dims[2];
            transposed = false;
        } else if (dims[2] === 4 + COCO_CLASSES.length) {
            // [1, N, 84]
            numChannels = dims[2];
            numPredictions = dims[1];
            transposed = true;
        } else {
            // Try with dims
            numChannels = Math.min(dims[1], dims[2]);
            numPredictions = Math.max(dims[1], dims[2]);
            transposed = dims[2] < dims[1];
        }
    } else {
        console.warn('Unexpected output shape:', dims);
        return results;
    }

    const { scale, dx, dy } = preInfo;
    const candidates = [];

    for (let i = 0; i < numPredictions; i++) {
        // Get box coordinates (cx, cy, w, h)
        let cx, cy, w, h;
        if (transposed) {
            cx = data[i * numChannels + 0];
            cy = data[i * numChannels + 1];
            w  = data[i * numChannels + 2];
            h  = data[i * numChannels + 3];
        } else {
            cx = data[0 * numPredictions + i];
            cy = data[1 * numPredictions + i];
            w  = data[2 * numPredictions + i];
            h  = data[3 * numPredictions + i];
        }

        // Find best class
        let bestScore = 0;
        let bestClassId = 0;
        for (let c = 0; c < COCO_CLASSES.length; c++) {
            let score;
            if (transposed) {
                score = data[i * numChannels + 4 + c];
            } else {
                score = data[(4 + c) * numPredictions + i];
            }
            if (score > bestScore) {
                bestScore = score;
                bestClassId = c;
            }
        }

        if (bestScore < state.confidenceThreshold) continue;

        const className = COCO_CLASSES[bestClassId];
        if (!state.selectedObjects.has(className)) continue;

        // Convert from model coords to original video coords
        const x1 = (cx - w / 2 - dx) / scale;
        const y1 = (cy - h / 2 - dy) / scale;
        const bw = w / scale;
        const bh = h / scale;

        candidates.push({
            class: className,
            score: bestScore,
            bbox: [x1, y1, bw, bh],
            classId: bestClassId,
        });
    }

    // Apply NMS
    return applyNMS(candidates, 0.45);
}

// ============ Non-Maximum Suppression ============
function applyNMS(detections, iouThreshold) {
    // Sort by score descending
    detections.sort((a, b) => b.score - a.score);

    const result = [];
    const suppressed = new Set();

    for (let i = 0; i < detections.length; i++) {
        if (suppressed.has(i)) continue;
        result.push(detections[i]);

        for (let j = i + 1; j < detections.length; j++) {
            if (suppressed.has(j)) continue;
            if (detections[i].classId !== detections[j].classId) continue;

            if (computeIoU(detections[i].bbox, detections[j].bbox) > iouThreshold) {
                suppressed.add(j);
            }
        }
    }

    return result;
}

function computeIoU(boxA, boxB) {
    const [ax, ay, aw, ah] = boxA;
    const [bx, by, bw, bh] = boxB;

    const x1 = Math.max(ax, bx);
    const y1 = Math.max(ay, by);
    const x2 = Math.min(ax + aw, bx + bw);
    const y2 = Math.min(ay + ah, by + bh);

    const interArea = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    const unionArea = aw * ah + bw * bh - interArea;

    return unionArea > 0 ? interArea / unionArea : 0;
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
    if (!state.isRunning || !state.session) return;

    if (!state.isPaused && els.video.readyState >= 2) {
        try {
            // Preprocess
            const preInfo = preprocessFrame();

            // Run inference
            const inputName = state.session.inputNames[0];
            const feeds = { [inputName]: preInfo.tensor };
            const outputMap = await state.session.run(feeds);

            // Convert to plain object
            const outputs = {};
            for (const name of state.session.outputNames) {
                outputs[name] = outputMap[name];
            }

            // Postprocess
            const predictions = postprocess(outputs, preInfo);

            // Draw
            drawDetections(predictions);

            // Count
            updateCounts(predictions);

            // FPS
            updateFPS();

            // Cleanup tensors
            preInfo.tensor.dispose?.();

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
        const meta = OBJECT_META[pred.class];
        const label = meta ? meta.name : pred.class;
        const confidence = Math.round(pred.score * 100);

        if (state.showBoxes) {
            // Rounded rectangle
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
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
            const labelText = `${label} ${confidence}%`;
            ctx.font = '600 13px Cairo, Inter, sans-serif';
            const textMetrics = ctx.measureText(labelText);
            const labelW = textMetrics.width + 16;
            const labelH = 26;
            const labelX = sx;
            const labelY = sy - labelH - 4;

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(labelX, Math.max(0, labelY), labelW, labelH, 8);
            ctx.fill();

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

    const selectedArr = Array.from(state.selectedObjects);
    let mainTotal = 0;
    let mainLabel = '';

    if (selectedArr.length === 0) {
        mainLabel = 'لم يتم التحديد';
    } else if (selectedArr.length === 1) {
        const meta = OBJECT_META[selectedArr[0]];
        mainLabel = meta ? meta.name : selectedArr[0];
        mainTotal = counts[selectedArr[0]] || 0;
    } else {
        mainLabel = `${selectedArr.length} أنواع`;
        mainTotal = Object.values(counts).reduce((a, b) => a + b, 0);
    }

    const currentCount = parseInt(els.mainCount.textContent);
    if (currentCount !== mainTotal) {
        els.mainCount.textContent = mainTotal;
        els.mainCount.classList.remove('bump');
        void els.mainCount.offsetWidth;
        els.mainCount.classList.add('bump');
    }
    els.mainCountLabel.textContent = mainLabel;

    updateStatsBar(counts);
}

function updateStatsBar(counts) {
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const statsKey = JSON.stringify(entries);
    if (state.lastStatsKey === statsKey) return;
    state.lastStatsKey = statsKey;

    let html = '';
    entries.forEach(([className, count]) => {
        const meta = OBJECT_META[className];
        const color = state.colorMap[className] || '#6C5CE7';
        const name = meta ? `${meta.icon} ${meta.name}` : className;
        html += `
            <div class="stat-chip">
                <div class="stat-chip-color" style="background: ${color}"></div>
                <span class="stat-chip-name">${name}</span>
                <span class="stat-chip-count">${count}</span>
            </div>`;
    });

    if (entries.length === 0 && state.selectedObjects.size > 0) {
        html = `<div class="stat-chip"><span class="stat-chip-name" style="color: var(--text-tertiary)">🔍 جاري البحث...</span></div>`;
    }

    els.statsBar.innerHTML = html;
}

// ============ FPS ============
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
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.frequency.value = 880; osc.type = 'sine'; gain.gain.value = 0.1;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) { /* ignore */ }
}

// ============ Selection Panel ============
function renderObjectsGrid(filter = '') {
    const categories = {};
    COCO_OBJECTS.forEach(obj => {
        if (filter) {
            const q = filter.toLowerCase();
            if (!obj.name.includes(q) && !obj.nameEn.toLowerCase().includes(q) && !obj.id.includes(q)) return;
        }
        if (!categories[obj.category]) categories[obj.category] = [];
        categories[obj.category].push(obj);
    });

    let html = '';
    if (Object.keys(categories).length === 0) {
        html = `<div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><p>لم يتم العثور على نتائج</p></div>`;
    } else {
        Object.entries(categories).forEach(([category, objects]) => {
            html += `<div class="category-header">${category}</div>`;
            objects.forEach(obj => {
                const isSelected = state.selectedObjects.has(obj.id);
                html += `
                    <div class="object-card ${isSelected ? 'selected' : ''}" data-id="${obj.id}">
                        <div class="object-card-check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                        <span class="object-card-icon">${obj.icon}</span>
                        <span class="object-card-name">${obj.name}</span>
                    </div>`;
            });
        });
    }

    els.objectsGrid.innerHTML = html;
    els.objectsGrid.querySelectorAll('.object-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            if (state.selectedObjects.has(id)) { state.selectedObjects.delete(id); card.classList.remove('selected'); }
            else { state.selectedObjects.add(id); card.classList.add('selected'); }
            updateSelectionCount();
        });
    });
}

function updateSelectionCount() { els.selectionCount.textContent = state.selectedObjects.size; }
function openSelectionPanel() { els.selectionPanel.classList.remove('hidden'); els.panelOverlay.classList.remove('hidden'); els.searchInput.value = ''; renderObjectsGrid(); }
function closeSelectionPanel() { els.selectionPanel.classList.add('hidden'); els.panelOverlay.classList.add('hidden'); }
function openSettingsPanel() { els.settingsPanel.classList.remove('hidden'); els.panelOverlay.classList.remove('hidden'); }
function closeSettingsPanel() { els.settingsPanel.classList.add('hidden'); els.panelOverlay.classList.add('hidden'); }

// ============ Capture ============
function captureFrame() {
    const captureCanvas = els.captureCanvas;
    const ctx = captureCanvas.getContext('2d');
    captureCanvas.width = els.video.videoWidth;
    captureCanvas.height = els.video.videoHeight;
    ctx.drawImage(els.video, 0, 0);
    ctx.drawImage(els.canvas, 0, 0, els.canvas.width, els.canvas.height, 0, 0, captureCanvas.width, captureCanvas.height);

    ctx.font = '600 16px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.textAlign = 'right';
    ctx.fillText('AI Counter • YOLO26n', captureCanvas.width - 16, captureCanvas.height - 16);

    let infoHtml = '';
    const totalCount = Object.values(state.lastCounts).reduce((a, b) => a + b, 0);
    infoHtml += `<div class="capture-info-item"><span>إجمالي العدد</span><span>${totalCount}</span></div>`;
    Object.entries(state.lastCounts).forEach(([className, count]) => {
        const meta = OBJECT_META[className];
        const name = meta ? `${meta.icon} ${meta.name}` : className;
        infoHtml += `<div class="capture-info-item"><span>${name}</span><span>${count}</span></div>`;
    });
    infoHtml += `<div class="capture-info-item"><span>التاريخ</span><span>${new Date().toLocaleString('ar-EG')}</span></div>`;
    infoHtml += `<div class="capture-info-item"><span>النموذج</span><span>YOLO26n</span></div>`;
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

// ============ Toast ============
function showToast(message, type = '') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    els.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============ Event Listeners ============
function setupEventListeners() {
    $('#btn-switch-camera').addEventListener('click', switchCamera);
    $('#btn-select-objects').addEventListener('click', openSelectionPanel);
    $('#btn-close-panel').addEventListener('click', closeSelectionPanel);
    $('#btn-apply-selection').addEventListener('click', () => {
        closeSelectionPanel();
        showToast(`✅ تم تحديد ${state.selectedObjects.size} أشياء للعدّ`);
    });
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
    els.searchInput.addEventListener('input', (e) => renderObjectsGrid(e.target.value));
    $('#btn-settings').addEventListener('click', openSettingsPanel);
    $('#btn-close-settings').addEventListener('click', closeSettingsPanel);
    els.panelOverlay.addEventListener('click', () => { closeSelectionPanel(); closeSettingsPanel(); });
    els.confidenceSlider.addEventListener('input', (e) => {
        state.confidenceThreshold = e.target.value / 100;
        els.confidenceValue.textContent = `${e.target.value}%`;
    });
    $('#toggle-boxes').addEventListener('change', (e) => { state.showBoxes = e.target.checked; });
    $('#toggle-labels').addEventListener('change', (e) => { state.showLabels = e.target.checked; });
    $('#toggle-sound').addEventListener('change', (e) => { state.soundEnabled = e.target.checked; });
    $('#toggle-vibrate').addEventListener('change', (e) => { state.vibrateEnabled = e.target.checked; });
    $('#btn-pause').addEventListener('click', () => {
        state.isPaused = !state.isPaused;
        const btn = $('#btn-pause');
        if (state.isPaused) {
            btn.classList.add('paused');
            btn.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
            showToast('⏸ تم إيقاف الكشف مؤقتاً');
        } else {
            btn.classList.remove('paused');
            btn.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
            showToast('▶ تم استئناف الكشف');
        }
    });
    $('#btn-capture').addEventListener('click', captureFrame);
    $('#btn-close-capture').addEventListener('click', () => els.capturePreview.classList.add('hidden'));
    $('#btn-download-capture').addEventListener('click', downloadCapture);
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('dblclick', (e) => e.preventDefault());
}

// ============ Start App ============
document.addEventListener('DOMContentLoaded', init);
