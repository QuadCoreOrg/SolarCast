const STORAGE_KEY = 'solarcast_game_state';

export const saveGameState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error('Failed to save game state:', error);
    return false;
  }
};

export const loadGameState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

export const clearGameState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear game state:', error);
    return false;
  }
};

export const saveHighScore = (score) => {
  try {
    const currentHigh = localStorage.getItem('solarcast_highscore') || 0;
    if (score > currentHigh) {
      localStorage.setItem('solarcast_highscore', score.toString());
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to save high score:', error);
    return false;
  }
};

export const getHighScore = () => {
  return parseInt(localStorage.getItem('solarcast_highscore') || '0', 10);
};