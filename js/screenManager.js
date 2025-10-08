import { setCurrentScreen } from './modules/gameState.js';
import { initSplashScreen } from './screens/splash.js';
import { initIntroVideoScreen } from './screens/introVideo.js';
import { initMenuScreen } from './screens/menu.js';
import { initDressingGameScreen } from './screens/dressingGame.js';
import { initPhotoBoothScreen } from './screens/photoBooth.js';
import { initIntroductionScreen } from './screens/introduction.js';
import { initShowTimeScreen } from './screens/showTime.js';

const gameContainer = document.getElementById('game-container');

const screenInitializers = {
    'splash': initSplashScreen,
    'intro_video': initIntroVideoScreen,
    'menu': initMenuScreen,
    'dressing_game': initDressingGameScreen,
    'photo_booth': initPhotoBoothScreen,
    'introduction': initIntroductionScreen,
    'show_time': initShowTimeScreen
};

export async function loadScreen(screenName) {
    try {
        const response = await fetch(`templates/${screenName}.html`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        gameContainer.innerHTML = await response.text();
        setCurrentScreen(screenName);

        const initFunction = screenInitializers[screenName];
        if (initFunction) {
            initFunction();
        } else {
            console.warn(`Không tìm thấy hàm init cho màn hình: ${screenName}`);
        }

    } catch (error) {
        console.error("Lỗi tải màn hình:", screenName, error);
        gameContainer.innerHTML = `<p style="color:red; text-align:center;">Lỗi tải màn hình. Vui lòng kiểm tra Console (F12).</p>`;
    }
}