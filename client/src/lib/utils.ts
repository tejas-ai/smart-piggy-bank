import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function playSound(soundUrl: string) {
  try {
    const audio = new Audio(soundUrl);
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Ignore audio play errors (user might not have interacted with page yet)
    });
  } catch {
    // Ignore audio creation errors
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
