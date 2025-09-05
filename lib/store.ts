import { create } from 'zustand';

interface AudioState {
  masterVolume: number;
  ambienceEnabled: boolean;
  soundEffectsEnabled: boolean;
  currentAmbience: string | null;
  setMasterVolume: (volume: number) => void;
  setAmbienceEnabled: (enabled: boolean) => void;
  setSoundEffectsEnabled: (enabled: boolean) => void;
  setCurrentAmbience: (ambience: string | null) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  masterVolume: 0.7,
  ambienceEnabled: true,
  soundEffectsEnabled: true,
  currentAmbience: null,
  setMasterVolume: (volume) => set({ masterVolume: volume }),
  setAmbienceEnabled: (enabled) => set({ ambienceEnabled: enabled }),
  setSoundEffectsEnabled: (enabled) => set({ soundEffectsEnabled: enabled }),
  setCurrentAmbience: (ambience) => set({ currentAmbience: ambience }),
}));

interface UIState {
  currentModal: string | null;
  isLoading: boolean;
  setCurrentModal: (modal: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentModal: null,
  isLoading: false,
  setCurrentModal: (modal) => set({ currentModal: modal }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
