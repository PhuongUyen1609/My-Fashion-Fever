import { loadScreen } from './screenManager.js';
import { initializeAudio } from './modules/audio.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeAudio();
    loadScreen('splash');
});