import { create } from "zustand";
import { toast } from "sonner";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  cardSound: HTMLAudioElement | null;
  shieldSound: HTMLAudioElement | null;
  specialSound: HTMLAudioElement | null;
  isMuted: boolean;
  isInitialized: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playCard: () => void;
  playShield: () => void;
  playSpecial: () => void;
  initializeSounds: () => void;
  playMusic: () => void;
  stopMusic: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  cardSound: null,
  shieldSound: null,
  specialSound: null,
  isMuted: true, // Start muted by default
  isInitialized: false,
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  
  initializeSounds: () => {
    // Only initialize once
    if (get().isInitialized) return;
    
    try {
      // Create all sound elements
      const backgroundMusic = new Audio();
      backgroundMusic.src = "/sounds/ancient-legends.mp3"; // This will be provided by the user
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.4;
      backgroundMusic.preload = "auto";
      
      const hitSound = new Audio();
      hitSound.src = "/sounds/hit.mp3"; // Generic hit sound
      hitSound.volume = 0.6;
      hitSound.preload = "auto";
      
      const successSound = new Audio();
      successSound.src = "/sounds/success.mp3"; // Success sound
      successSound.volume = 0.6;
      successSound.preload = "auto";
      
      const cardSound = new Audio();
      cardSound.src = "/sounds/card.mp3"; // Card play sound
      cardSound.volume = 0.5;
      cardSound.preload = "auto";
      
      const shieldSound = new Audio();
      shieldSound.src = "/sounds/shield.mp3"; // Shield sound
      shieldSound.volume = 0.6;
      shieldSound.preload = "auto";
      
      const specialSound = new Audio();
      specialSound.src = "/sounds/special.mp3"; // Special ability sound
      specialSound.volume = 0.6;
      specialSound.preload = "auto";
      
      set({
        backgroundMusic,
        hitSound,
        successSound,
        cardSound,
        shieldSound,
        specialSound,
        isInitialized: true
      });
      
      console.log("🔊 Audio system initialized");
    } catch (error) {
      console.error("Failed to initialize audio:", error);
      toast.error("Could not initialize audio system", {
        description: "Audio playback may not work properly"
      });
    }
  },
  
  playMusic: () => {
    const { backgroundMusic, isMuted, isInitialized } = get();
    
    if (!isInitialized) {
      get().initializeSounds();
    }
    
    if (backgroundMusic && !isMuted) {
      // Make sure we rewind to the beginning
      backgroundMusic.currentTime = 0;
      
      // Sometimes browsers block autoplay, so wrap in try/catch
      try {
        const playPromise = backgroundMusic.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Background music autoplay prevented:", error);
            toast.info("Click anywhere to enable music", {
              duration: 3000
            });
          });
        }
      } catch (e) {
        console.log("Error playing background music:", e);
      }
    }
  },
  
  stopMusic: () => {
    const { backgroundMusic } = get();
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
  },
  
  toggleMute: () => {
    const { isMuted, isInitialized, backgroundMusic } = get();
    const newMutedState = !isMuted;
    
    // Initialize sounds if needed
    if (!isInitialized) {
      get().initializeSounds();
    }
    
    // Try to play background music if unmuting
    if (!newMutedState && backgroundMusic) {
      try {
        backgroundMusic.play().catch(e => {
          console.log("Error playing music after unmute:", e);
        });
      } catch (e) {
        console.log("Error playing background music:", e);
      }
    }
    
    // Update the muted state
    set({ isMuted: newMutedState });
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
    
    // Show toast notification
    toast.info(newMutedState ? "🔇 Sound muted" : "🔊 Sound enabled", {
      duration: 2000
    });
  },
  
  playHit: () => {
    const { hitSound, isMuted, isInitialized } = get();
    
    if (!isInitialized) {
      get().initializeSounds();
    }
    
    if (hitSound && !isMuted) {
      try {
        // Clone the sound to allow overlapping playback
        const soundClone = hitSound.cloneNode() as HTMLAudioElement;
        soundClone.volume = 0.3;
        soundClone.play().catch(error => {
          console.log("Hit sound play prevented:", error);
        });
      } catch (e) {
        console.log("Error playing hit sound:", e);
      }
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted, isInitialized } = get();
    
    if (!isInitialized) {
      get().initializeSounds();
    }
    
    if (successSound && !isMuted) {
      try {
        successSound.currentTime = 0;
        successSound.play().catch(error => {
          console.log("Success sound play prevented:", error);
        });
      } catch (e) {
        console.log("Error playing success sound:", e);
      }
    }
  },
  
  playCard: () => {
    const { cardSound, isMuted, isInitialized } = get();
    
    if (!isInitialized) {
      get().initializeSounds();
    }
    
    if (cardSound && !isMuted) {
      try {
        cardSound.currentTime = 0;
        cardSound.play().catch(e => console.log("Error playing card sound:", e));
      } catch (e) {
        console.log("Error playing card sound:", e);
      }
    }
  },
  
  playShield: () => {
    const { shieldSound, isMuted, isInitialized } = get();
    
    if (!isInitialized) {
      get().initializeSounds();
    }
    
    if (shieldSound && !isMuted) {
      try {
        shieldSound.currentTime = 0;
        shieldSound.play().catch(e => console.log("Error playing shield sound:", e));
      } catch (e) {
        console.log("Error playing shield sound:", e);
      }
    }
  },
  
  playSpecial: () => {
    const { specialSound, isMuted, isInitialized } = get();
    
    if (!isInitialized) {
      get().initializeSounds();
    }
    
    if (specialSound && !isMuted) {
      try {
        specialSound.currentTime = 0;
        specialSound.play().catch(e => console.log("Error playing special sound:", e));
      } catch (e) {
        console.log("Error playing special sound:", e);
      }
    }
  }
}));
