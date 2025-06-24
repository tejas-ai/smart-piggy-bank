import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function playSound(soundUrl: string) {
  try {
    const audio = new Audio(soundUrl);
    audio.volume = 0.5;
    
    // Use Web Audio API for better reliability
    const playAudio = () => {
      audio.currentTime = 0;
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Audio play failed:", error);
        });
      }
    };

    // For data URLs, play immediately
    if (soundUrl.startsWith('data:')) {
      playAudio();
    } else {
      // For external URLs, ensure they're loaded first
      audio.addEventListener('canplaythrough', playAudio, { once: true });
      audio.addEventListener('error', (e) => {
        console.log("Audio load error:", e);
      });
      audio.load();
    }
  } catch (error) {
    console.log("Audio creation failed:", error);
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function playCoinDropSound() {
  // Create a coin drop sound using Web Audio API
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a short, bright metallic sound for coin drop
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const biquadFilter = audioContext.createBiquadFilter();
    
    // Connect the nodes
    oscillator.connect(biquadFilter);
    biquadFilter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure the sound
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
    
    // Add metallic resonance
    biquadFilter.type = 'bandpass';
    biquadFilter.frequency.setValueAtTime(1200, audioContext.currentTime);
    biquadFilter.Q.setValueAtTime(15, audioContext.currentTime);
    
    // Volume envelope for natural coin drop
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
    
    oscillator.type = 'triangle';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
    
  } catch (error) {
    console.log('Coin drop sound failed:', error);
  }
}
