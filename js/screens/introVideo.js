import { loadScreen } from '../screenManager.js';

export function initIntroVideoScreen() {
    const videoScreen = document.querySelector('.intro-video-screen');
    const video = document.getElementById('game-intro-video');
    const skipButton = document.querySelector('.skip-button');

    const goToMenu = () => {
        video.removeEventListener('ended', goToMenu);
        skipButton.removeEventListener('click', goToMenu);
        videoScreen.style.opacity = '0';
        setTimeout(() => loadScreen('menu'), 500);
    };

    video.addEventListener('ended', goToMenu);
    skipButton.addEventListener('click', goToMenu);
}