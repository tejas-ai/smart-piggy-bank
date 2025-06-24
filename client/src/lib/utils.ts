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
  // Create a realistic metallic coin drop sound using Web Audio API
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioContext.currentTime;
    
    // Create multiple oscillators for metallic harmonics
    const frequencies = [1200, 1800, 2400, 3600]; // Metallic frequencies
    const oscillators: OscillatorNode[] = [];
    const gainNodes: GainNode[] = [];
    
    // Master gain for overall volume
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    
    // Create multiple harmonic layers
    frequencies.forEach((freq, index) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      // Configure filter for metallic resonance
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq, now);
      filter.Q.setValueAtTime(20 + index * 5, now);
      
      // Connect the chain
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      // Configure oscillator
      osc.type = index % 2 === 0 ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(freq, now);
      
      // Create realistic coin bounce with frequency modulation
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.35);
      
      // Individual gain envelope with different decay rates
      const volume = 0.15 / (index + 1); // Decreasing volume for higher harmonics
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(volume * 0.3, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(volume * 0.1, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      
      oscillators.push(osc);
      gainNodes.push(gain);
    });
    
    // Add metallic "ring" with delay
    const delayNode = audioContext.createDelay(0.1);
    const delayGain = audioContext.createGain();
    const delayFilter = audioContext.createBiquadFilter();
    
    delayNode.delayTime.setValueAtTime(0.05, now);
    delayGain.gain.setValueAtTime(0.2, now);
    delayFilter.type = 'highpass';
    delayFilter.frequency.setValueAtTime(800, now);
    
    masterGain.connect(delayNode);
    delayNode.connect(delayFilter);
    delayFilter.connect(delayGain);
    delayGain.connect(masterGain);
    
    // Master volume envelope
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(1, now + 0.005);
    masterGain.gain.exponentialRampToValueAtTime(0.6, now + 0.1);
    masterGain.gain.exponentialRampToValueAtTime(0.3, now + 0.25);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    
    // Start all oscillators
    oscillators.forEach(osc => {
      osc.start(now);
      osc.stop(now + 0.6);
    });
    
  } catch (error) {
    console.log('Coin drop sound failed:', error);
  }
}
