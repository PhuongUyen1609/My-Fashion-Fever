import { state } from '../modules/gameState.js';
import { clothingItems } from '../modules/assets.js';
import { updateCharacterDisplay, addCharacterSelectionEvents, addCommonNavigationEvents } from '../modules/ui.js';
import { loadScreen } from '../screenManager.js';

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

function activateHairclipDragging() {
    const hairclip = document.getElementById('worn-hairclip');
    const hairZone = document.getElementById('hair-zone');
    if (!hairclip || !hairZone) return;

    hairclip.classList.add('movable-active');

    function onMouseDown(e) {
        e.preventDefault();

        const zoneWidth = hairZone.offsetWidth;
        const zoneHeight = hairZone.offsetHeight;
        const clipWidth = hairclip.offsetWidth;
        const clipHeight = hairclip.offsetHeight;

        const maxX = zoneWidth - clipWidth;
        const maxY = zoneHeight - clipHeight;
        const minX = 0;
        const minY = 0;

        const initialMouseX = e.clientX;
        const initialMouseY = e.clientY;
        const initialHairclipX = state.currentOutfit.hairclip.x;
        const initialHairclipY = state.currentOutfit.hairclip.y;

        function onMouseMove(e) {
            const dx = e.clientX - initialMouseX;
            const dy = e.clientY - initialMouseY;
            
            let newX = initialHairclipX + dx;
            let newY = initialHairclipY + dy;

            const clampedX = Math.max(minX, Math.min(newX, maxX));
            const clampedY = Math.max(minY, Math.min(newY, maxY));

            state.currentOutfit.hairclip.x = clampedX;
            state.currentOutfit.hairclip.y = clampedY;

            hairclip.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    hairclip.removeEventListener('mousedown', onMouseDown);
    hairclip.addEventListener('mousedown', onMouseDown);
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
            state.currentOutfit.shirt = imgSrc;
            state.currentOutfit.dress = '';
        }
        
        else if (imgSrc.includes('/Skirt/')) {
            document.getElementById('worn-skirt').src = imgSrc;
            document.getElementById('worn-dress').src = '';
            document.getElementById('worn-trouser').src = '';
            state.currentOutfit.skirt = imgSrc;
            state.currentOutfit.dress = '';
            state.currentOutfit.trousers = '';
        }
        
        else if (imgSrc.includes('/trousers/')) {
            document.getElementById('worn-trouser').src = imgSrc;
            document.getElementById('worn-dress').src = '';
            document.getElementById('worn-skirt').src = '';
            state.currentOutfit.trousers = imgSrc;
            state.currentOutfit.dress = '';
            state.currentOutfit.skirt = '';

            console.log("ĐÃ LƯU QUẦN:", state.currentOutfit.trousers); 
        }

        else if (imgSrc.includes('/dress/')) {
            document.getElementById('worn-dress').src = imgSrc;
            document.getElementById('worn-shirt').src = '';
            document.getElementById('worn-skirt').src = '';
            document.getElementById('worn-trouser').src = '';
            state.currentOutfit.dress = imgSrc;
            state.currentOutfit.shirt = '';
            state.currentOutfit.skirt = '';
            state.currentOutfit.trousers = '';
        }
        
        else if (imgSrc.includes('/shoe/')) {
            document.getElementById('worn-shoe').src = imgSrc;
            state.currentOutfit.shoe = imgSrc;
        }
        
        else if (imgSrc.includes('/accessories/earring')) {
            document.getElementById('worn-earring').src = imgSrc;
            state.currentOutfit.earring = imgSrc;
        } 
        else if (imgSrc.includes('/accessories/hairclip')) {
            state.currentOutfit.hairclip = { src: imgSrc, x: 0, y: 0 };

            const hairclipEl = document.getElementById('worn-hairclip');
            hairclipEl.src = imgSrc;
            hairclipEl.style.transform = `translate(0px, 0px)`; 

            activateHairclipDragging();
        }
        else if (imgSrc.includes('/accessories/necklace')) {
            document.getElementById('worn-necklace').src = imgSrc;
            state.currentOutfit.necklace = imgSrc;
        }
    });
}

export function initDressingGameScreen() {

    state.currentOutfit = {
        base: state.currentOutfit.base, 
        shirt: '',
        skirt: '',
        dress: '',
        shoe: '',
        trousers: '',
        earring: '',
        necklace: '',
        hairclip: { src: '', x: 0, y: 0 },
    };

    updateCharacterDisplay();
    addCharacterSelectionEvents();
    addCommonNavigationEvents();
    
    setupClothingGalleries();
    setupDragAndDrop();

    const showTimeButton = document.getElementById('btnShowTime');
    if (showTimeButton) {
        showTimeButton.addEventListener('click', () => {
            loadScreen('show_time');
        });
    }
}