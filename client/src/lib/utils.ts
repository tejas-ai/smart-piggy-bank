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
  // Create a royal premium metallic coin drop sound with advanced Web Audio API
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioContext.currentTime;
    
    // Royal gold coin fundamental and harmonic frequencies
    const fundamentals = [880, 1320, 1760]; // Rich golden tones
    const harmonics = [2200, 3300, 4400, 5500, 6600]; // Bright metallic overtones
    const subHarmonics = [440, 660]; // Deep resonant undertones
    
    // Create convolver for realistic reverb
    const convolver = audioContext.createConvolver();
    const impulseLength = audioContext.sampleRate * 0.8;
    const impulse = audioContext.createBuffer(2, impulseLength, audioContext.sampleRate);
    
    // Generate realistic room impulse response
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < impulseLength; i++) {
        const decay = Math.pow(1 - i / impulseLength, 2);
        channelData[i] = (Math.random() * 2 - 1) * decay * 0.3;
      }
    }
    convolver.buffer = impulse;
    
    // Master processing chain
    const masterGain = audioContext.createGain();
    const compressor = audioContext.createDynamicsCompressor();
    const finalEQ = audioContext.createBiquadFilter();
    
    // Configure compressor for punch
    compressor.threshold.setValueAtTime(-12, now);
    compressor.knee.setValueAtTime(5, now);
    compressor.ratio.setValueAtTime(4, now);
    compressor.attack.setValueAtTime(0.001, now);
    compressor.release.setValueAtTime(0.1, now);
    
    // Configure final EQ for presence
    finalEQ.type = 'peaking';
    finalEQ.frequency.setValueAtTime(2500, now);
    finalEQ.Q.setValueAtTime(2, now);
    finalEQ.gain.setValueAtTime(3, now);
    
    // Connect master chain
    masterGain.connect(compressor);
    compressor.connect(finalEQ);
    finalEQ.connect(audioContext.destination);
    
    // Reverb send
    const reverbSend = audioContext.createGain();
    reverbSend.gain.setValueAtTime(0.25, now);
    masterGain.connect(reverbSend);
    reverbSend.connect(convolver);
    convolver.connect(audioContext.destination);
    
    // Create impact layer (initial coin strike)
    const createImpactLayer = () => {
      const impactGain = audioContext.createGain();
      const noiseFilter = audioContext.createBiquadFilter();
      const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      
      // Generate filtered noise burst for impact
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioContext.sampleRate * 0.02));
      }
      
      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(3000, now);
      noiseFilter.Q.setValueAtTime(8, now);
      
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(impactGain);
      impactGain.connect(masterGain);
      
      impactGain.gain.setValueAtTime(0.4, now);
      impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      
      noiseSource.start(now);
      noiseSource.stop(now + 0.1);
    };
    
    // Create tonal layers with sophisticated processing
    const createTonalLayer = (frequencies: number[], type: 'fundamental' | 'harmonic' | 'sub') => {
      frequencies.forEach((freq, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter1 = audioContext.createBiquadFilter();
        const filter2 = audioContext.createBiquadFilter();
        const distortion = audioContext.createWaveShaper();
        
        // Create subtle saturation curve for metallic character
        const samples = 1024;
        const curve = new Float32Array(samples);
        for (let i = 0; i < samples; i++) {
          const x = (i - samples / 2) / (samples / 2);
          curve[i] = Math.tanh(x * 2) * 0.8;
        }
        distortion.curve = curve;
        
        // Configure filters based on layer type
        filter1.type = 'bandpass';
        filter1.frequency.setValueAtTime(freq, now);
        filter1.Q.setValueAtTime(type === 'fundamental' ? 15 : 25, now);
        
        filter2.type = 'peaking';
        filter2.frequency.setValueAtTime(freq * 1.5, now);
        filter2.Q.setValueAtTime(3, now);
        filter2.gain.setValueAtTime(type === 'harmonic' ? 4 : 2, now);
        
        // Connect processing chain
        osc.connect(distortion);
        distortion.connect(filter1);
        filter1.connect(filter2);
        filter2.connect(gain);
        gain.connect(masterGain);
        
        // Configure oscillator
        osc.type = type === 'sub' ? 'sine' : type === 'fundamental' ? 'triangle' : 'square';
        osc.frequency.setValueAtTime(freq, now);
        
        // Royal coin bounce simulation with multiple bounces
        const bounces = [0.8, 0.6, 0.45, 0.35, 0.28];
        let time = now;
        bounces.forEach((multiplier, bounceIndex) => {
          const bounceTime = time + (bounceIndex * 0.08);
          osc.frequency.exponentialRampToValueAtTime(freq * multiplier, bounceTime);
        });
        
        // Volume envelope based on layer type
        const baseVolume = type === 'fundamental' ? 0.3 : type === 'harmonic' ? 0.2 : 0.15;
        const volume = baseVolume / Math.sqrt(index + 1);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.003);
        gain.gain.exponentialRampToValueAtTime(volume * 0.4, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(volume * 0.15, now + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        
        osc.start(now);
        osc.stop(now + 0.8);
      });
    };
    
    // Create all layers
    createImpactLayer();
    createTonalLayer(subHarmonics, 'sub');
    createTonalLayer(fundamentals, 'fundamental');
    createTonalLayer(harmonics, 'harmonic');
    
    // Master envelope with royal sustain
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(1.2, now + 0.002);
    masterGain.gain.exponentialRampToValueAtTime(0.8, now + 0.08);
    masterGain.gain.exponentialRampToValueAtTime(0.4, now + 0.25);
    masterGain.gain.exponentialRampToValueAtTime(0.2, now + 0.5);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
    
  } catch (error) {
    console.log('Royal coin drop sound failed:', error);
  }
}
