import { useEffect } from 'react';
import useGameStore from '../store/useGameStore';
import { GAME_CONFIG } from '../constants/gameConfig';

export default function useGameLoop() {
  const { isGameOver, tick } = useGameStore();

  useEffect(() => {
    if (isGameOver) return;

    const intervalId = setInterval(() => {
      tick();
    }, GAME_CONFIG.TICK_RATE_MS);

    return () => clearInterval(intervalId);
  }, [isGameOver, tick]);
}
