import { state } from './gameState.js';

const backgroundMusic = new Audio('assets/audio/Ziskoe - Late Night Pie.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

export function toggleMusic() {
    state.isMusicPlaying = !state.isMusicPlaying;
    if (state.isMusicPlaying) {
        backgroundMusic.play().catch(e => console.error("Audio play failed:", e));
    } else {
        backgroundMusic.pause();
    }
    updateMusicButtonIcon();
}

export function updateMusicButtonIcon() {
    const musicButton = document.querySelector('.music-button img');
    if (musicButton) {
        musicButton.style.opacity = state.isMusicPlaying ? '1' : '0.5';
    }
}

function playMusicOnFirstInteraction() {
    if (state.isMusicPlaying) return;
    state.isMusicPlaying = true;
    backgroundMusic.play().then(() => {
        updateMusicButtonIcon();
        document.removeEventListener('click', playMusicOnFirstInteraction);
        document.removeEventListener('keydown', playMusicOnFirstInteraction);
    }).catch(err => {
        state.isMusicPlaying = false;
        console.error("Lỗi tự động phát nhạc:", err);
    });
}

export function playSFX(soundName) {
    const sfx = new Audio(`assets/audio/${soundName}`);
    sfx.play().catch(e => console.error(`Không thể phát SFX: ${soundName}`, e));
}

export function initializeAudio() {
    document.addEventListener('click', playMusicOnFirstInteraction, { once: true });
    document.addEventListener('keydown', playMusicOnFirstInteraction, { once: true });
}