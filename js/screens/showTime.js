import { state } from '../modules/gameState.js';
import { updateCharacterDisplay, addCharacterSelectionEvents, addCommonNavigationEvents } from '../modules/ui.js';

function renderCurrentOutfit() {
    const outfit = state.currentOutfit;
    const characterContainer = document.getElementById('show-time-character');

    if (!characterContainer) {
        console.error("Không tìm thấy #show-time-character trong HTML!");
        return;
    }

    const setWornItemSrc = (id, src) => {
        const element = characterContainer.querySelector(`#${id}`);
        if (element) {
            element.src = src || '';
        } else {
            console.warn(`Không tìm thấy element với ID: #${id} trong màn hình Show Time`);
        }
    };

    setWornItemSrc('worn-shoe', outfit.shoe);
    setWornItemSrc('worn-trouser', outfit.trousers); 
    setWornItemSrc('worn-earring', outfit.earring);
    setWornItemSrc('worn-necklace', outfit.necklace);
    setWornItemSrc('worn-dress', outfit.dress);
    setWornItemSrc('worn-shirt', outfit.shirt);
    setWornItemSrc('worn-skirt', outfit.skirt);

    const hairclipData = outfit.hairclip;
    const hairclipEl = characterContainer.querySelector('#worn-hairclip');
    if (hairclipEl) {
        hairclipEl.src = hairclipData.src || '';
        if (hairclipData.src) {
            hairclipEl.style.transform = `translate(${hairclipData.x}px, ${hairclipData.y}px)`;
        } else {
            hairclipEl.style.transform = 'translate(0, 0)';
        }
    }
}

export function initShowTimeScreen() {
    updateCharacterDisplay();
    renderCurrentOutfit();
    addCharacterSelectionEvents();
    addCommonNavigationEvents();
}