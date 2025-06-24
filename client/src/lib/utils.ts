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
