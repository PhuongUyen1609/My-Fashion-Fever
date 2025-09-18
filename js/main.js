document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    let selectedCharacter = 'curly';
    let currentScreen = 'splash';

    let currentOutfit = {
        base: 'assets/images/character/charater_1.png', 
        shirt: '',
        skirt: '',
        dress: '',
        shoe: ''
    };

    let isMusicPlaying = false;
    const backgroundMusic = new Audio('assets/audio/Em Xinh.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;

    const clothingItems = {
        shirts: [
            'assets/images/shirt/Shirt1.png', 'assets/images/shirt/Shirt2.png',
            'assets/images/shirt/Shirt3.png', 'assets/images/shirt/Shirt4.png', 'assets/images/shirt/Shirt5.png',
        ],
        skirts: [
            'assets/images/Skirt/Skirt1.png', 'assets/images/Skirt/Skirt2.png',
            'assets/images/Skirt/Skirt3.png', 'assets/images/Skirt/Skirt4.png',
        ],
        dresses: [
            'assets/images/dress/Dress1.png', 'assets/images/dress/Dress2.png',
            'assets/images/dress/Dress3.png', 'assets/images/dress/Dress4.png',
        ],
        shoes: [
            'assets/images/shoe/shoe1.png', 'assets/images/shoe/shoe2.png', 'assets/images/shoe/shoe3.png',
        ],
    };

    const stickerItems = {
        stickers: [
            'assets/images/sticker/sticker_1.png', 'assets/images/sticker/sticker_4.png',
            'assets/images/sticker/sticker_2.png', 'assets/images/sticker/sticker_3.png',
            'assets/images/sticker/sticker_5.png', 'assets/images/sticker/sticker_6.png',
            'assets/images/sticker/sticker_7.png', 'assets/images/sticker/sticker_8.png', 'assets/images/sticker/sticker_9.png',
        ],
        accessories: [
            // 'assets/images/sticker/acc_1.png', 'assets/images/sticker/acc_2.png',
        ],
        lights: [
            // 'assets/images/sticker/light_1.png', 'assets/images/sticker/light_2.png',
        ],
        signs: [
            // 'assets/images/sticker/sign_1.png', 'assets/images/sticker/sign_2.png',
        ],
    };

    async function loadScreen(screenName, initFunction) {
        try {
            const response = await fetch(`templates/${screenName}.html`);
            if (!response.ok) throw new Error(`Không tìm thấy file templates/${screenName}.html (HTTP ${response.status})`);
            const html = await response.text();
            gameContainer.innerHTML = html;
            if (initFunction) initFunction();
            currentScreen = screenName; 
        } catch (error) {
            gameContainer.innerHTML = `<p style="color:red; text-align:center;">Lỗi: Không thể tải màn hình. Hãy kiểm tra Console (F12) để xem chi tiết.</p>`;
        }
    }

    function initSplashScreen() {
        const playButton = document.querySelector('.play-button');
        playButton.addEventListener('click', () => {
            loadScreen('intro_video', initIntroVideoScreen);
        });
    }

    function initIntroVideoScreen() {
        const videoScreen = document.querySelector('.intro-video-screen');
        const video = document.getElementById('game-intro-video');
        const skipButton = document.querySelector('.skip-button');
        const goToMenu = () => {
            video.removeEventListener('ended', goToMenu);
            skipButton.removeEventListener('click', goToMenu);
            videoScreen.style.opacity = '0';
            setTimeout(() => loadScreen('menu', initMenuScreen), 500);
        };
        video.addEventListener('ended', goToMenu);
        skipButton.addEventListener('click', goToMenu);
    }
    
    function initMenuScreen() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('active')) {
                    const targetScreen = item.dataset.target;
                    switch (targetScreen) {
                        case 'dressing_game': loadScreen('dressing_game', initDressingGameScreen); break;
                        case 'photo_booth': loadScreen('photo_booth', initPhotoBoothScreen); break;
                        case 'introduction': loadScreen('introduction', initIntroductionScreen); break;
                    }
                } else {
                    menuItems.forEach(otherItem => otherItem.classList.remove('active'));
                    item.classList.add('active');
                }
            });
        });
        const characterSelectors = document.querySelectorAll('.character-select');
        characterSelectors.forEach(selector => {
            selector.addEventListener('click', () => {
                selectedCharacter = selector.dataset.character;
                updateCharacterDisplay(); 
                characterSelectors.forEach(s => s.classList.remove('selected'));
                selector.classList.add('selected');
            });
        });
    }

    function initIntroductionScreen() {
        updateCharacterDisplay();

        const characterSelectors = document.querySelectorAll('.character-select');
        characterSelectors.forEach(selector => {
            selector.addEventListener('click', () => {
                console.log("[Dressing Game] Character selected:", selector.dataset.character);
                selectedCharacter = selector.dataset.character;
                updateCharacterDisplay(); 
            });
        });

        const video = document.getElementById('intro-video');
        if (video) video.play().catch(error => console.warn("Video autoplay bị chặn:", error));
        addCommonNavigationEvents('introduction');
    }

    function initDressingGameScreen() {
        updateCharacterDisplay();

        const characterSelectors = document.querySelectorAll('.character-select');
        characterSelectors.forEach(selector => {
            selector.addEventListener('click', () => {
                console.log("[Dressing Game] Character selected:", selector.dataset.character);
                selectedCharacter = selector.dataset.character;
                updateCharacterDisplay(); 
            });
        });

        setupDragAndDrop();
        setupClothingGalleries();
        addCommonNavigationEvents('dressing_game');
    }

    function setupClothingGalleries() {
        const galleries = document.querySelectorAll('.item-gallery-wrapper');
        galleries.forEach(gallery => {
            const clothingImage = gallery.querySelector('.gallery-clothing');
            const prevBtn = gallery.querySelector('.gallery-prev-btn');
            const nextBtn = gallery.querySelector('.gallery-next-btn');
            const tabs = gallery.querySelectorAll('.gallery-tab-img');
            let currentCategory = tabs[0].dataset.category;
            let currentIndex = 0;
            const updateImage = () => {
                const items = clothingItems[currentCategory];
                if (items && items.length > 0) clothingImage.src = items[currentIndex];
            };
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    currentCategory = tab.dataset.category;
                    currentIndex = 0;
                    updateImage();
                    tabs.forEach(t => t.classList.remove('active-tab'));
                    tab.classList.add('active-tab');
                });
            });
            nextBtn.addEventListener('click', () => {
                const items = clothingItems[currentCategory];
                if (items && items.length > 0) {
                    currentIndex = (currentIndex + 1) % items.length;
                    updateImage();
                }
            });
            prevBtn.addEventListener('click', () => {
                const items = clothingItems[currentCategory];
                if (items && items.length > 0) {
                    currentIndex = (currentIndex - 1 + items.length) % items.length;
                    updateImage();
                }
            });
            updateImage();
            tabs[0].classList.add('active-tab');
        });
    }

    function setupDragAndDrop() {
        const draggableItems = document.querySelectorAll('.gallery-clothing');
        const dropZone = document.getElementById('character-area');
        if (!dropZone) return;

        draggableItems.forEach(item => {
            item.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text/plain', event.target.src);
            });
        });

        dropZone.addEventListener('dragover', (event) => event.preventDefault());

        dropZone.addEventListener('drop', (event) => {
            event.preventDefault();
            const imgSrc = event.dataTransfer.getData('text/plain');

            if (imgSrc.includes('/shirt/')) {
                document.getElementById('worn-shirt').src = imgSrc;
                document.getElementById('worn-dress').src = '';
                currentOutfit.shirt = imgSrc;
                currentOutfit.dress = '';
            } else if (imgSrc.includes('/Skirt/')) {
                document.getElementById('worn-skirt').src = imgSrc;
                document.getElementById('worn-dress').src = '';
                currentOutfit.skirt = imgSrc;
                currentOutfit.dress = '';
            } else if (imgSrc.includes('/dress/')) {
                document.getElementById('worn-dress').src = imgSrc;
                document.getElementById('worn-shirt').src = '';
                document.getElementById('worn-skirt').src = '';
                currentOutfit.dress = imgSrc;
                currentOutfit.shirt = '';
                currentOutfit.skirt = '';
            } else if (imgSrc.includes('/shoe/')) {
                document.getElementById('worn-shoe').src = imgSrc;
                currentOutfit.shoe = imgSrc;
            }
        });
    }
    
    function initPhotoBoothScreen() {
        const video = document.getElementById('webcam-feed');
        const canvas = document.getElementById('photo-canvas');
        const ctx = canvas.getContext('2d');
        const shutterBtn = document.getElementById('shutter-btn');
        const downloadBtn = document.querySelector('.download-btn');
        const stickerGrid = document.querySelector('.sticker-grid');
        const stickerTabs = document.querySelectorAll('.sticker-tab-img');

        let photoBaseImage = null;
        let placedStickers = [];
        let selectedSticker = null;
        let isDragging = false;
        let offsetX, offsetY;

        canvas.classList.add('hidden');
        video.classList.remove('hidden');

        updateCharacterDisplay();

        const characterSelectors = document.querySelectorAll('.character-select');
        characterSelectors.forEach(selector => {
            selector.addEventListener('click', () => {
                console.log("[Dressing Game] Character selected:", selector.dataset.character);
                selectedCharacter = selector.dataset.character;
                updateCharacterDisplay(); 
            });
        });

        async function startWebcam() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'user' },
                    audio: false 
                });
                video.srcObject = stream;
            } catch (err) {
                console.error("Lỗi bật webcam!", err);
                alert("Không thể truy cập webcam. Vui lòng kiểm tra quyền truy cập trong trình duyệt của bạn.");
            }
        }

        function takePicture() {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            photoBaseImage = new Image();
            photoBaseImage.src = canvas.toDataURL();

            video.classList.add('hidden');
            canvas.classList.remove('hidden');
        }

        shutterBtn.addEventListener('click', takePicture);

        function redrawCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (photoBaseImage) {
                ctx.drawImage(photoBaseImage, 0, 0, canvas.width, canvas.height);
            }
            placedStickers.forEach(sticker => {
                const img = new Image();
                img.src = sticker.src;
                if(img.complete) {
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
        
        stickerTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                stickerTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                populateStickers(tab.dataset.stickerCategory);
            });
        });

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
            
            const stickerWidth = 150; 
            const stickerHeight = 150;

            placedStickers.push({
                src: src,
                x: x - stickerWidth / 2, y: y - stickerHeight / 2,
                width: stickerWidth, height: stickerHeight
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

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
            selectedSticker = null;
        });

        canvas.addEventListener('mouseleave', () => {
            isDragging = false;
            selectedSticker = null;
        });

        canvas.addEventListener('dblclick', (e) => {
            if (!photoBaseImage) return;

            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const mouseX = (e.clientX - rect.left) * scaleX;
            const mouseY = (e.clientY - rect.top) * scaleY;

            for (let i = placedStickers.length - 1; i >= 0; i--) {
                const s = placedStickers[i];
                if (mouseX >= s.x && mouseX <= s.x + s.width && mouseY >= s.y && mouseY <= s.y + s.height) {
                    
                    placedStickers.splice(i, 1);
                    
                    redrawCanvas();

                    break; 
                }
            }
        });

    downloadBtn.addEventListener('click', (event) => {

        if (!photoBaseImage) {
            alert("Bạn chưa chụp ảnh!");
            return;
        }

        setTimeout(() => {
            try {
                const dataURL = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.style.display = 'none';
                link.download = 'My-Photo.png';
                link.href = dataURL;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error("Lỗi download:", error);
                alert("Không thể tải xuống ảnh!");
            }
        }, 100);
        
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
    });
        addCommonNavigationEvents('photo_booth');
        if(stickerTabs.length > 0) stickerTabs[0].click();

        startWebcam();
    }

    function updateCharacterDisplay() {
        const characterImage = document.querySelector('.character-base');
        let characterImagePath = '';

        switch (selectedCharacter) {
            case 'curly': characterImagePath = 'assets/images/character/charater_1.png'; break;
            case 'short': characterImagePath = 'assets/images/character/charater_2.png'; break;
            case 'blonde': characterImagePath = 'assets/images/character/charater_3.png'; break;
            default: characterImagePath = 'assets/images/character/charater_1.png';
        }

        if (characterImage) {
            characterImage.src = characterImagePath;
        }

        currentOutfit.base = characterImagePath;
        currentOutfit.shirt = '';
        currentOutfit.skirt = '';
        currentOutfit.dress = '';
        currentOutfit.shoe = '';
        
        const wornItems = document.querySelectorAll('.worn-item');
        if (wornItems) {
            wornItems.forEach(item => item.src = '');
        }

        const allCharacterSelectors = document.querySelectorAll('.character-select');
        
        allCharacterSelectors.forEach(selector => {
            if (selector.dataset.character === selectedCharacter) {
                selector.classList.add('selected');
            } else {
                selector.classList.remove('selected');
            }
        });
    }

    function addCommonNavigationEvents(currentScreenName) {
        const homeButton = document.querySelector('.home-button');
        homeButton?.addEventListener('click', () => loadScreen('menu', initMenuScreen));

        const sideMenuItems = document.querySelectorAll('.side-menu-item');
        sideMenuItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.target === currentScreenName) {
                item.classList.add('active');
            }
            item.addEventListener('click', () => {
                const targetScreen = item.dataset.target;
                switch (targetScreen) {
                    case 'dressing_game': loadScreen('dressing_game', initDressingGameScreen); break;
                    case 'photo_booth': loadScreen('photo_booth', initPhotoBoothScreen); break;
                    case 'introduction': loadScreen('introduction', initIntroductionScreen); break;
                }
            });
        });
        
        const musicButton = document.querySelector('.music-button');
        if (musicButton) {
            const musicIcon = musicButton.querySelector('img');
            musicIcon.style.opacity = isMusicPlaying ? '1' : '0.5';
            musicButton.addEventListener('click', () => {
                isMusicPlaying = !isMusicPlaying;
                if (isMusicPlaying) {
                    backgroundMusic.play();
                    musicIcon.style.opacity = '1';
                } else {
                    backgroundMusic.pause();
                    musicIcon.style.opacity = '0.5';
                }
            });
        }
    }

    function playMusicOnFirstInteraction() {
        if (isMusicPlaying) return; 

        backgroundMusic.play().then(() => {
            isMusicPlaying = true;
            console.log("Âm nhạc đã bắt đầu!");
            document.removeEventListener('click', playMusicOnFirstInteraction);
            document.removeEventListener('keydown', playMusicOnFirstInteraction);
        }).catch(err => {
            console.error("Lỗi tự động phát nhạc, cần tương tác của người dùng.", err);
        });
    }

    document.addEventListener('click', playMusicOnFirstInteraction);
    document.addEventListener('keydown', playMusicOnFirstInteraction);

    loadScreen('splash', initSplashScreen);
});