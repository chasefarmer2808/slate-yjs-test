// https://usehooks.com/useKeyPress/ melded with https://www.fullstacklabs.co/blog/keyboard-shortcuts-with-react-hooks
import { useCallback, useEffect, useState } from 'react';

export const useKeyPress = (targetKey: string): boolean => {
  const checkKey = targetKey.toLowerCase();

  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  const downHandler = useCallback(
    (event: KeyboardEvent): void => {
      if (event.key.toLowerCase() === checkKey) {
        setKeyPressed(true);
      }
    },
    [checkKey]
  );

  // If released key is our target key then set to false
  const upHandler = useCallback(
    (event: KeyboardEvent): void => {
      if (event.key.toLowerCase() === checkKey) {
        setKeyPressed(false);
      }
    },
    [checkKey]
  );

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
};
