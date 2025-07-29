import { PetModel, PetType, PetRarity } from './PetModel';

export const PET_DATA: Record<string, PetModel> = {
  'fire_dragon': {
    id: 'fire_dragon',
    name: 'Long Viêm',
    type: 'fire',
    rarity: 'legendary',
    stats: {
      health: 1200,
      maxHealth: 1200,
      energy: 600,
      maxEnergy: 600,
      attack: 180,
      defense: 120,
      speed: 140,
      level: 100,
      experience: 0,
      experienceToNext: 1000
    },
    animations: {
      idle: {
        name: 'idle',
        duration: 2000,
        frames: 8,
        loop: true,
        effects: [
          {
            type: 'particle',
            params: { color: '#FF4500', count: 3, size: 5 },
            timing: 0.5
          }
        ]
      },
      walking: {
        name: 'walking',
        duration: 1000,
        frames: 6,
        loop: true
      },
      attacking: {
        name: 'attacking',
        duration: 800,
        frames: 4,
        loop: false,
        effects: [
          {
            type: 'particle',
            params: { color: '#FF0000', count: 10, size: 8 },
            timing: 0.3
          },
          {
            type: 'screenShake',
            params: { intensity: 5, duration: 200 },
            timing: 0.4
          }
        ]
      },
      special: {
        name: 'fire_breath',
        duration: 1500,
        frames: 6,
        loop: false,
        effects: [
          {
            type: 'particle',
            params: { color: '#FF6B35', count: 20, size: 12 },
            timing: 0.2
          },
          {
            type: 'sound',
            params: { soundId: 'fire_breath' },
            timing: 0.1
          }
        ]
      }
    },
    sprites: {
      idle: '/sprites/fire_dragon/idle.png',
      walking: '/sprites/fire_dragon/walk.png',
      attacking: '/sprites/fire_dragon/attack.png',
      defending: '/sprites/fire_dragon/defend.png',
      special: '/sprites/fire_dragon/special.png',
      hurt: '/sprites/fire_dragon/hurt.png',
      evolution: '/sprites/fire_dragon/evolution.png',
      icon: '/sprites/fire_dragon/icon.png'
    },
    abilities: [
      {
        id: 'fire_breath',
        name: 'Hơi Thở Lửa',
        description: 'Phun lửa mạnh mẽ gây sát thương cao',
        type: 'active',
        cooldown: 5000,
        energyCost: 100,
        effects: [
          {
            type: 'damage',
            target: 'enemy',
            value: 250,
            duration: 0
          }
        ],
        animation: 'fire_breath'
      },
      {
        id: 'dragon_rage',
        name: 'Cơn Thịnh Nộ Rồng',
        description: 'Tăng sức mạnh tấn công trong 10 giây',
        type: 'active',
        cooldown: 15000,
        energyCost: 150,
        effects: [
          {
            type: 'buff',
            target: 'self',
            value: 50,
            duration: 10000
          }
        ],
        animation: 'special'
      }
    ],
    evolution: {
      nextStage: 'fire_dragon_elite',
      levelRequired: 120,
      itemsRequired: ['fire_crystal', 'dragon_scale'],
      animation: 'evolution'
    },
    description: 'Rồng lửa huyền thoại với sức mạnh thiêu đốt khủng khiếp',
    unlockCondition: 'Hoàn thành nhiệm vụ "Thử thách lửa"'
  },

  'water_spirit': {
    id: 'water_spirit',
    name: 'Thủy Linh',
    type: 'water',
    rarity: 'epic',
    stats: {
      health: 1000,
      maxHealth: 1000,
      energy: 800,
      maxEnergy: 800,
      attack: 140,
      defense: 100,
      speed: 160,
      level: 85,
      experience: 0,
      experienceToNext: 800
    },
    animations: {
      idle: {
        name: 'idle',
        duration: 2500,
        frames: 10,
        loop: true,
        effects: [
          {
            type: 'particle',
            params: { color: '#4ECDC4', count: 5, size: 3 },
            timing: 0.3
          }
        ]
      },
      walking: {
        name: 'walking',
        duration: 1200,
        frames: 8,
        loop: true
      },
      attacking: {
        name: 'attacking',
        duration: 1000,
        frames: 5,
        loop: false,
        effects: [
          {
            type: 'particle',
            params: { color: '#2E86AB', count: 8, size: 6 },
            timing: 0.4
          }
        ]
      },
      special: {
        name: 'water_burst',
        duration: 1200,
        frames: 5,
        loop: false,
        effects: [
          {
            type: 'particle',
            params: { color: '#45B7D1', count: 15, size: 10 },
            timing: 0.2
          },
          {
            type: 'sound',
            params: { soundId: 'water_splash' },
            timing: 0.1
          }
        ]
      }
    },
    sprites: {
      idle: '/sprites/water_spirit/idle.png',
      walking: '/sprites/water_spirit/walk.png',
      attacking: '/sprites/water_spirit/attack.png',
      defending: '/sprites/water_spirit/defend.png',
      special: '/sprites/water_spirit/special.png',
      hurt: '/sprites/water_spirit/hurt.png',
      evolution: '/sprites/water_spirit/evolution.png',
      icon: '/sprites/water_spirit/icon.png'
    },
    abilities: [
      {
        id: 'water_burst',
        name: 'Sóng Thủy Triều',
        description: 'Tạo sóng nước mạnh mẽ tấn công kẻ địch',
        type: 'active',
        cooldown: 4000,
        energyCost: 80,
        effects: [
          {
            type: 'damage',
            target: 'enemy',
            value: 200,
            duration: 0
          }
        ],
        animation: 'water_burst'
      },
      {
        id: 'healing_wave',
        name: 'Sóng Hồi Phục',
        description: 'Hồi phục sức khỏe cho bản thân và đồng minh',
        type: 'active',
        cooldown: 12000,
        energyCost: 120,
        effects: [
          {
            type: 'heal',
            target: 'ally',
            value: 300,
            duration: 0
          }
        ],
        animation: 'special'
      }
    ],
    evolution: {
      nextStage: 'water_spirit_elite',
      levelRequired: 100,
      itemsRequired: ['water_crystal', 'spirit_essence'],
      animation: 'evolution'
    },
    description: 'Linh hồn nước với khả năng chữa lành và tấn công linh hoạt',
    unlockCondition: 'Thu thập 100 giọt nước tinh khiết'
  },

  'earth_guardian': {
    id: 'earth_guardian',
    name: 'Địa Thần',
    type: 'earth',
    rarity: 'rare',
    stats: {
      health: 1500,
      maxHealth: 1500,
      energy: 400,
      maxEnergy: 400,
      attack: 120,
      defense: 200,
      speed: 80,
      level: 75,
      experience: 0,
      experienceToNext: 600
    },
    animations: {
      idle: {
        name: 'idle',
        duration: 3000,
        frames: 6,
        loop: true
      },
      walking: {
        name: 'walking',
        duration: 1500,
        frames: 4,
        loop: true
      },
      attacking: {
        name: 'attacking',
        duration: 1200,
        frames: 3,
        loop: false,
        effects: [
          {
            type: 'particle',
            params: { color: '#8B4513', count: 6, size: 8 },
            timing: 0.5
          },
          {
            type: 'screenShake',
            params: { intensity: 8, duration: 300 },
            timing: 0.6
          }
        ]
      },
      defending: {
        name: 'defending',
        duration: 2000,
        frames: 4,
        loop: true,
        effects: [
          {
            type: 'particle',
            params: { color: '#696969', count: 4, size: 5 },
            timing: 0.2
          }
        ]
      }
    },
    sprites: {
      idle: '/sprites/earth_guardian/idle.png',
      walking: '/sprites/earth_guardian/walk.png',
      attacking: '/sprites/earth_guardian/attack.png',
      defending: '/sprites/earth_guardian/defend.png',
      special: '/sprites/earth_guardian/special.png',
      hurt: '/sprites/earth_guardian/hurt.png',
      evolution: '/sprites/earth_guardian/evolution.png',
      icon: '/sprites/earth_guardian/icon.png'
    },
    abilities: [
      {
        id: 'stone_smash',
        name: 'Đập Đá',
        description: 'Tấn công mạnh mẽ với sức mạnh của đất',
        type: 'active',
        cooldown: 6000,
        energyCost: 60,
        effects: [
          {
            type: 'damage',
            target: 'enemy',
            value: 180,
            duration: 0
          }
        ],
        animation: 'attacking'
      },
      {
        id: 'earth_barrier',
        name: 'Rào Cản Đất',
        description: 'Tăng phòng thủ trong 15 giây',
        type: 'active',
        cooldown: 20000,
        energyCost: 100,
        effects: [
          {
            type: 'buff',
            target: 'self',
            value: 80,
            duration: 15000
          }
        ],
        animation: 'defending'
      }
    ],
    evolution: {
      nextStage: 'earth_guardian_elite',
      levelRequired: 90,
      itemsRequired: ['earth_crystal', 'guardian_stone'],
      animation: 'evolution'
    },
    description: 'Thần hộ mệnh của đất với khả năng phòng thủ vượt trội',
    unlockCondition: 'Hoàn thành nhiệm vụ "Bảo vệ núi thiêng"'
  }
};

// Export specific pet data for easy access
export const getPetById = (id: string): PetModel | undefined => {
  return PET_DATA[id];
};

export const getAllPets = (): PetModel[] => {
  return Object.values(PET_DATA);
};

export const getPetsByType = (type: PetType): PetModel[] => {
  return Object.values(PET_DATA).filter(pet => pet.type === type);
};

export const getPetsByRarity = (rarity: PetRarity): PetModel[] => {
  return Object.values(PET_DATA).filter(pet => pet.rarity === rarity);
}; 