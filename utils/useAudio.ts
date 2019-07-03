import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

export function useAudio(): [boolean, React.Dispatch<boolean>] {
  const [isAudioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    Audio.setIsEnabledAsync(isAudioEnabled);
    return () => {
      Audio.setIsEnabledAsync(true);
    };
  }, [isAudioEnabled]);

  return [isAudioEnabled, setAudioEnabled];
}

export type AudioModeState = {
  interruptionModeIOS: number;
  playsInSilentModeIOS: boolean;
  allowsRecordingIOS: boolean;
  staysActiveInBackground: boolean;
};

export function useAudioMode(
  initialAudioMode: AudioModeState
): [AudioModeState, React.Dispatch<AudioModeState>] {
  const [audioMode, setAudioMode] = useState(initialAudioMode);

  useEffect(() => {
    setAudioModeAsync(audioMode);
  }, [audioMode]);

  return [audioMode, setAudioMode];
}

async function setAudioModeAsync(audioMode: AudioModeState): Promise<void> {
  await Audio.setAudioModeAsync({
    ...audioMode,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    shouldDuckAndroid: false,
    playThroughEarpieceAndroid: false,
  });
}
