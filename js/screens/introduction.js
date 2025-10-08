import { updateCharacterDisplay, addCharacterSelectionEvents, addCommonNavigationEvents } from '../modules/ui.js';

export function initIntroductionScreen() {
    updateCharacterDisplay();
    addCharacterSelectionEvents();

    addCommonNavigationEvents();

    const introVideo = document.getElementById('intro-video');
    if (introVideo) {
        introVideo.play().catch(error => {
            console.warn("Video autoplay trên màn hình Introduction bị chặn:", error);
        });
    }
}