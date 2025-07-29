import { PetModel, PetAnimation, AnimationEffect, Particle, ParticleSystem } from '../models/PetModel';

export interface AnimationState {
  currentAnimation: string;
  currentFrame: number;
  totalFrames: number;
  frameTime: number;
  elapsedTime: number;
  isPlaying: boolean;
  loop: boolean;
  onComplete?: () => void;
}

export interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  duration: number;
}

export interface SpriteSheet {
  image: HTMLImageElement;
  frames: Record<string, SpriteFrame[]>;
  frameWidth: number;
  frameHeight: number;
}

export class AnimationSystem {
  private animations: Map<string, AnimationState> = new Map();
  private spriteSheets: Map<string, SpriteSheet> = new Map();
  private particleSystems: Map<string, ParticleSystem> = new Map();
  private audioContext: AudioContext | null = null;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch (error) {
      console.warn('AudioContext not supported');
    }
  }

  // Load sprite sheet
  async loadSpriteSheet(petId: string, imagePath: string, frameData: Record<string, SpriteFrame[]>): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        this.spriteSheets.set(petId, {
          image,
          frames: frameData,
          frameWidth: image.width / Math.max(...Object.values(frameData).map(frames => frames.length)),
          frameHeight: image.height
        });
        resolve();
      };
      image.onerror = reject;
      image.src = imagePath;
    });
  }

  // Start animation
  startAnimation(petId: string, animationName: string, onComplete?: () => void): void {
    const pet = this.getPetModel(petId);
    if (!pet || !pet.animations[animationName]) return;

    const animation = pet.animations[animationName];
    const animationState: AnimationState = {
      currentAnimation: animationName,
      currentFrame: 0,
      totalFrames: animation.frames,
      frameTime: animation.duration / animation.frames,
      elapsedTime: 0,
      isPlaying: true,
      loop: animation.loop,
      onComplete
    };

    this.animations.set(petId, animationState);
  }

  // Update animation
  updateAnimation(petId: string, deltaTime: number): void {
    const animationState = this.animations.get(petId);
    if (!animationState || !animationState.isPlaying) return;

    animationState.elapsedTime += deltaTime;

    // Check if it's time for next frame
    if (animationState.elapsedTime >= animationState.frameTime) {
      animationState.currentFrame++;
      animationState.elapsedTime = 0;

      // Check if animation is complete
      if (animationState.currentFrame >= animationState.totalFrames) {
        if (animationState.loop) {
          animationState.currentFrame = 0;
        } else {
          animationState.isPlaying = false;
          if (animationState.onComplete) {
            animationState.onComplete();
          }
        }
      }
    }

    // Trigger effects
    this.triggerAnimationEffects(petId, animationState);
  }

  // Trigger animation effects
  private triggerAnimationEffects(petId: string, animationState: AnimationState): void {
    const pet = this.getPetModel(petId);
    if (!pet) return;

    const animation = pet.animations[animationState.currentAnimation];
    if (!animation.effects) return;

    const progress = animationState.currentFrame / animationState.totalFrames;

    animation.effects.forEach(effect => {
      if (Math.abs(progress - effect.timing) < 0.1) {
        this.executeEffect(effect, petId);
      }
    });
  }

  // Execute animation effect
  private executeEffect(effect: AnimationEffect, petId: string): void {
    switch (effect.type) {
      case 'particle':
        this.createParticleEffect(petId, effect.params);
        break;
      case 'sound':
        this.playSound(effect.params.soundId as string);
        break;
      case 'screenShake':
        this.screenShake(effect.params.intensity as number, effect.params.duration as number);
        break;
      case 'colorFlash':
        this.colorFlash(effect.params.color as string, effect.params.duration as number);
        break;
    }
  }

  // Create particle effect
  private createParticleEffect(petId: string, params: Record<string, string | number | boolean>): void {
    const particleSystem: ParticleSystem = {
      particles: [],
      emitter: {
        x: 0,
        y: 0,
        rate: (params.count as number) || 5,
        burst: (params.count as number) || 5
      },
      config: {
        gravity: 0.5,
        wind: 0,
        fadeRate: 0.02,
        sizeDecay: 0.01
      }
    };

    // Create initial particles
    for (let i = 0; i < (params.count as number); i++) {
      const particle: Particle = {
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1.0,
        maxLife: 1.0,
        color: (params.color as string) || '#FFFFFF',
        size: (params.size as number) || 5,
        alpha: 1.0
      };
      particleSystem.particles.push(particle);
    }

    this.particleSystems.set(`${petId}_${Date.now()}`, particleSystem);
  }

  // Update particle systems
  updateParticles(deltaTime: number): void {
    this.particleSystems.forEach((system, key) => {
      system.particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Apply gravity
        particle.vy += system.config.gravity;

        // Apply wind
        particle.vx += system.config.wind;

        // Update life
        particle.life -= system.config.fadeRate;
        particle.alpha = particle.life / particle.maxLife;
        particle.size -= system.config.sizeDecay;

        // Remove dead particles
        if (particle.life <= 0 || particle.size <= 0) {
          const index = system.particles.indexOf(particle);
          if (index > -1) {
            system.particles.splice(index, 1);
          }
        }
      });

      // Remove empty particle systems
      if (system.particles.length === 0) {
        this.particleSystems.delete(key);
      }
    });
  }

  // Render sprite
  renderSprite(ctx: CanvasRenderingContext2D, petId: string, x: number, y: number, scale: number = 1): void {
    const spriteSheet = this.spriteSheets.get(petId);
    const animationState = this.animations.get(petId);
    
    if (!spriteSheet || !animationState) return;

    const animation = this.getPetModel(petId)?.animations[animationState.currentAnimation];
    if (!animation) return;

    const frames = spriteSheet.frames[animationState.currentAnimation];
    if (!frames || !frames[animationState.currentFrame]) return;

    const frame = frames[animationState.currentFrame];
    
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    ctx.drawImage(
      spriteSheet.image,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      -frame.width / 2,
      -frame.height / 2,
      frame.width,
      frame.height
    );
    
    ctx.restore();
  }

  // Render particles
  renderParticles(ctx: CanvasRenderingContext2D): void {
    this.particleSystems.forEach(system => {
      system.particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    });
  }

  // Play sound effect
  private playSound(soundId: string): void {
    if (!this.audioContext) return;

    // Create oscillator for simple sound effects
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Configure sound based on ID
    switch (soundId) {
      case 'fire_breath':
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.5);
        break;
      case 'water_splash':
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
        break;
      default:
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    }

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  // Screen shake effect
  private screenShake(intensity: number, duration: number): void {
    // This would be implemented in the main game loop
    // For now, we'll just log it
    console.log(`Screen shake: intensity=${intensity}, duration=${duration}`);
  }

  // Color flash effect
  private colorFlash(color: string, duration: number): void {
    // This would be implemented in the main game loop
    // For now, we'll just log it
    console.log(`Color flash: color=${color}, duration=${duration}`);
  }

  // Get current animation state
  getAnimationState(petId: string): AnimationState | undefined {
    return this.animations.get(petId);
  }

  // Stop animation
  stopAnimation(petId: string): void {
    this.animations.delete(petId);
  }

  // Check if animation is playing
  isAnimationPlaying(petId: string): boolean {
    const state = this.animations.get(petId);
    return state ? state.isPlaying : false;
  }

  // Get pet model (this would be replaced with actual data source)
  private getPetModel(petId: string): PetModel | undefined {
    // This should be replaced with actual pet data
    return undefined;
  }

  // Export animation data
  exportAnimationData(petId: string): Record<string, unknown> | null {
    const pet = this.getPetModel(petId);
    if (!pet) return null;

    return {
      petId,
      animations: pet.animations,
      sprites: pet.sprites,
      abilities: pet.abilities
    };
  }

  // Import animation data
  importAnimationData(data: Record<string, unknown>): void {
    // This would load animation data from external source
    console.log('Importing animation data:', data);
  }
} 