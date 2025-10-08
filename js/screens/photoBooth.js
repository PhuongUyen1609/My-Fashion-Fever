import { state } from '../modules/gameState.js';
import { stickerItems } from '../modules/assets.js';
import { updateCharacterDisplay, addCharacterSelectionEvents, addCommonNavigationEvents } from '../modules/ui.js';
import { playSFX } from '../modules/audio.js';

let video, canvas, ctx, shutterBtn, downloadBtn, stickerGrid, stickerTabs;
let photoBaseImage = null;
let placedStickers = [];
let selectedSticker = null;
let isDragging = false;
let offsetX, offsetY;

async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' },
            audio: false 
        });
        video.srcObject = stream;
        video.addEventListener('leave', () => {
            stream.getTracks().forEach(track => track.stop());
        }, { once: true });

    } catch (err) {
        console.error("Lỗi bật webcam!", err);
        alert("Không thể truy cập webcam. Vui lòng kiểm tra quyền truy cập trong trình duyệt của bạn.");
    }
}

function takePicture() {
    if (!video || video.readyState < 3) {
        console.warn("Webcam chưa sẵn sàng.");
        return;
    }

    playSFX('Camera sound.mp3');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    photoBaseImage = new Image();
    photoBaseImage.src = canvas.toDataURL();
    video.classList.add('hidden');
    canvas.classList.remove('hidden');

    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
}

function resetPhotoArea() {
    photoBaseImage = null;
    placedStickers = [];

    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    canvas.classList.add('hidden');
    video.classList.remove('hidden');

    startWebcam();
}

function redrawCanvas() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (photoBaseImage) {
        ctx.drawImage(photoBaseImage, 0, 0, canvas.width, canvas.height);
    }
    placedStickers.forEach(sticker => {
        const img = new Image();
        img.src = sticker.src;
        if (img.complete) {
            ctx.drawImage(img, sticker.x, sticker.y, sticker.width, sticker.height);
        } else {
            img.onload = () => redrawCanvas(); 
        }
    });
}

function populateStickers(category) {
    stickerGrid.innerHTML = '';
    const items = stickerItems[category] || [];
    items.forEach(src => {
        const stickerWrapper = document.createElement('div');
        stickerWrapper.className = 'sticker-item';
        stickerWrapper.draggable = true;
        const stickerImg = document.createElement('img');
        stickerImg.src = src;
        stickerWrapper.appendChild(stickerImg);
        stickerWrapper.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/sticker-src', src);
        });
        stickerGrid.appendChild(stickerWrapper);
    });
}

function setupStickerTabs() {
    stickerTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            stickerTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            populateStickers(tab.dataset.stickerCategory);
        });
    });
    if (stickerTabs.length > 0) stickerTabs[0].click();
}

function setupCanvasInteractions() {
    canvas.addEventListener('dragover', (e) => e.preventDefault());
    
    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const src = e.dataTransfer.getData('text/sticker-src');
        if (!src || !photoBaseImage) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        let stickerWidth, stickerHeight;

        if (src.includes('/typo/')) {
            stickerWidth = 300; 
            stickerHeight = 150; 
        } else {
            stickerWidth = 150; 
            stickerHeight = 150;
        }

        placedStickers.push({
            src: src,
            x: x - stickerWidth / 2, 
            y: y - stickerHeight / 2, 
            width: stickerWidth,     
            height: stickerHeight     
        });
        redrawCanvas();
    });

    canvas.addEventListener('mousedown', (e) => {
        if (!photoBaseImage) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        for (let i = placedStickers.length - 1; i >= 0; i--) {
            const s = placedStickers[i];
            if (mouseX >= s.x && mouseX <= s.x + s.width && mouseY >= s.y && mouseY <= s.y + s.height) {
                selectedSticker = s;
                isDragging = true;
                offsetX = mouseX - s.x;
                offsetY = mouseY - s.y;
                placedStickers.splice(i, 1); 
                placedStickers.push(selectedSticker);
                redrawCanvas();
                break;
            }
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDragging && selectedSticker) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const mouseX = (e.clientX - rect.left) * scaleX;
            const mouseY = (e.clientY - rect.top) * scaleY;
            selectedSticker.x = mouseX - offsetX;
            selectedSticker.y = mouseY - offsetY;
            redrawCanvas();
        }
    });

    const stopDragging = () => {
        isDragging = false;
        selectedSticker = null;
    };
    canvas.addEventListener('mouseup', stopDragging);
    canvas.addEventListener('mouseleave', stopDragging);
}

function setupDownloadButton() {
    downloadBtn.addEventListener('click', () => {
        if (!photoBaseImage) {
            alert("Bạn chưa chụp ảnh!");
            return;
        }
        redrawCanvas();
        setTimeout(() => {
            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'My-Fashion-Fever-Photo.png';
            link.href = dataURL;
            link.click();
        }, 100);
    });
}

function onShutterButtonClick() {
    if (photoBaseImage) {
        resetPhotoArea();
    } else {
        takePicture();
    }
}

export function initPhotoBoothScreen() {
    video = document.getElementById('webcam-feed');
    canvas = document.getElementById('photo-canvas');
    ctx = canvas.getContext('2d');
    shutterBtn = document.getElementById('shutter-btn');

    downloadBtn = document.querySelector('.download-btn');
    stickerGrid = document.querySelector('.sticker-grid');
    stickerTabs = document.querySelectorAll('.sticker-tab-img');
    
    const resetBtn = document.getElementById('reset-stickers-btn');

    photoBaseImage = null;
    placedStickers = [];
    canvas.classList.add('hidden');
    video.classList.remove('hidden');

    updateCharacterDisplay();
    addCharacterSelectionEvents(); 
    addCommonNavigationEvents();

    shutterBtn.removeEventListener('click', onShutterButtonClick);

    shutterBtn.addEventListener('click', onShutterButtonClick);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (!photoBaseImage) {
                alert("Bạn cần chụp ảnh trước khi trang trí và xóa!");
                return;
            }
            placedStickers = [];
            redrawCanvas(); 
        });
    }
    
    setupStickerTabs();
    setupCanvasInteractions();
    setupDownloadButton();
    
    startWebcam();
}

