import { state, setCharacter } from './gameState.js';
import { loadScreen } from '../screenManager.js';
import { toggleMusic, updateMusicButtonIcon } from './audio.js';

export function updateCharacterDisplay() {
    const characterImages = document.querySelectorAll('.character-base');
    let characterImagePath = '';

    switch (state.selectedCharacter) {
        case 'curly': characterImagePath = 'assets/images/character/charater_1.png'; break;
        case 'short': characterImagePath = 'assets/images/character/charater_2.png'; break;
        case 'blonde': characterImagePath = 'assets/images/character/charater_3.png'; break;
        default: characterImagePath = 'assets/images/character/charater_1.png';
    }

    if (characterImages.length > 0) {
        characterImages.forEach(img => img.src = characterImagePath);
    }
    
    state.currentOutfit.base = characterImagePath;

    const allCharacterSelectors = document.querySelectorAll('.character-select');
    allCharacterSelectors.forEach(selector => {
        selector.classList.toggle('selected', selector.dataset.character === state.selectedCharacter);
    });
}

export function showCustomAlert(message) {
    const modal = document.getElementById('custom-alert-modal');
    const messageEl = document.getElementById('modal-message');
    const closeBtn = document.getElementById('modal-close-btn');

    if (!modal || !messageEl || !closeBtn) {
        alert(message);
        return;
    }

    messageEl.textContent = message;

    modal.classList.remove('hidden');

    const closeModal = () => {
        modal.classList.add('hidden');
        closeBtn.removeEventListener('click', closeModal); 
    };

    closeBtn.addEventListener('click', closeModal);
}

export function addCharacterSelectionEvents() {
    const characterSelectors = document.querySelectorAll('.character-select');
    characterSelectors.forEach(selector => {
        selector.addEventListener('click', () => {
            const characterName = selector.dataset.character;

            if (characterName === 'blonde' || characterName === 'short') {
                showCustomAlert("You need to unlock this character!");
                return; 
            }
            
            if (state.selectedCharacter !== characterName) {
                setCharacter(characterName);
                updateCharacterDisplay(); 

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

                const wornItems = document.querySelectorAll('.worn-item');
                if (wornItems) {
                    wornItems.forEach(item => {
                        item.src = '';
                        if (item.id === 'worn-hairclip') {
                            item.style.transform = 'translate(0, 0)';
                        }
                    });
                }
            }
        });
    });
}


export function addCommonNavigationEvents() {
    document.querySelector('.home-button')?.addEventListener('click', () => loadScreen('menu'));

    const sideMenuItems = document.querySelectorAll('.side-menu-item');
    sideMenuItems.forEach(item => {
        item.classList.toggle('active', item.dataset.target === state.currentScreen);
        item.addEventListener('click', () => loadScreen(item.dataset.target));
    });
    
    const musicButton = document.querySelector('.music-button');
    if (musicButton) {
        musicButton.addEventListener('click', toggleMusic);
        updateMusicButtonIcon();
    }
}