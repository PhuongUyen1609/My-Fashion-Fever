export const state = {
    selectedCharacter: 'curly',
    currentScreen: 'splash',
    currentOutfit: {
        base: 'assets/images/character/charater_1.png', 
        shirt: '',
        skirt: '',
        dress: '',
        shoe: '',
        trousers: '',
        earring: '',
        hairclip: { src: '', x: 0, y: 0 },
        necklace: '',
    },
    isMusicPlaying: false,
};

export function setCharacter(character) {
    state.selectedCharacter = character;
}

export function setCurrentScreen(screenName) {
    state.currentScreen = screenName;
}