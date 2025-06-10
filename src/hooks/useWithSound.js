import useSound from 'use-sound';
export const useWithSound = (soundFile, opts = {}) => {
  const [play] = useSound(soundFile, opts);
  return play;
};
