import { loadScreen } from '../screenManager.js';
import { addCharacterSelectionEvents, updateCharacterDisplay } from '../modules/ui.js';

export function initMenuScreen() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) {
                loadScreen(item.dataset.target);
            } else {
                menuItems.forEach(otherItem => otherItem.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });
    
    addCharacterSelectionEvents();
    updateCharacterDisplay(); 
}