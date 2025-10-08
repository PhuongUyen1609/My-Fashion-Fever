import { loadScreen } from '../screenManager.js';

export function initSplashScreen() {
    const playButton = document.querySelector('.play-button');
    playButton.addEventListener('click', () => {
        loadScreen('intro_video');
    });
}