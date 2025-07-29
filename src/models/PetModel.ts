export interface PetStats {
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  attack: number;
  defense: number;
  speed: number;
  level: number;
  experience: number;
  experienceToNext: number;
}

export interface PetAnimation {
  name: string;
  duration: number;
  frames: number;
  loop: boolean;
  effects?: AnimationEffect[];
}

export interface AnimationEffect {
  type: 'particle' | 'sound' | 'screenShake' | 'colorFlash';
  params: Record<string, string | number | boolean>;
  timing: number; // When in animation to trigger (0-1)
}

export interface PetModel {
  id: string;
  name: string;
  type: PetType;
  rarity: PetRarity;
  stats: PetStats;
  animations: Record<string, PetAnimation>;
  sprites: PetSprites;
  abilities: PetAbility[];
  evolution?: PetEvolution;
  description: string;
  unlockCondition?: string;
}

export type PetType = 'fire' | 'water' | 'earth' | 'wind' | 'light' | 'dark' | 'thunder' | 'ice';

export type PetRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface PetSprites {
  idle: string;
  walking: string;
  attacking: string;
  defending: string;
  special: string;
  hurt: string;
  evolution: string;
  icon: string;
}

export interface PetAbility {
  id: string;
  name: string;
  description: string;
  type: 'active' | 'passive';
  cooldown: number;
  energyCost: number;
  effects: AbilityEffect[];
  animation: string;
}

export interface AbilityEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'status';
  target: 'self' | 'enemy' | 'ally' | 'all';
  value: number;
  duration?: number;
  condition?: string;
}

export interface PetEvolution {
  nextStage: string;
  levelRequired: number;
  itemsRequired: string[];
  animation: string;
}

// Animation States
export type AnimationState = 
  | 'idle' 
  | 'walking' 
  | 'attacking' 
  | 'defending' 
  | 'special' 
  | 'hurt' 
  | 'evolving'
  | 'victory'
  | 'defeat';

// Particle System
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  alpha: number;
}

export interface ParticleSystem {
  particles: Particle[];
  emitter: {
    x: number;
    y: number;
    rate: number;
    burst: number;
  };
  config: {
    gravity: number;
    wind: number;
    fadeRate: number;
    sizeDecay: number;
  };
} 