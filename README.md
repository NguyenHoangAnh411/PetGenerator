# Pet Generator & Model Exporter

Một ứng dụng Next.js để tạo và xuất pet models cho game development. Hỗ trợ nhiều định dạng export và animation system hoàn chỉnh.

## 🚀 Tính năng

### Pet Model System
- **Pet Stats**: Health, Energy, Attack, Defense, Speed, Level, Experience
- **Pet Types**: Fire, Water, Earth, Wind, Light, Dark, Thunder, Ice
- **Pet Rarities**: Common, Rare, Epic, Legendary, Mythic
- **Pet Abilities**: Active/Passive skills với cooldown và energy cost
- **Pet Evolution**: Hệ thống tiến hóa với requirements

### Animation System
- **Sprite Management**: Load và quản lý sprite sheets
- **Frame-based Animation**: Animation với timing chính xác
- **Particle Effects**: Hệ thống hạt với physics
- **Audio Integration**: Sound effects với Web Audio API
- **Effect Triggers**: Screen shake, color flash, particle bursts

### Export System
- **JSON**: Cho web games và data storage
- **XML**: Cho mobile games và configuration
- **CSV**: Cho data analysis và spreadsheets
- **Unity C#**: Tự động generate Unity scripts
- **Unreal C++**: Tự động generate Unreal Engine blueprints

## 📁 Cấu trúc Project

```
pet-generator/
├── src/
│   ├── app/
│   │   └── page.tsx              # Main page
│   ├── components/
│   │   └── PetModelViewer.tsx    # Pet viewer & exporter UI
│   ├── models/
│   │   ├── PetModel.ts           # Pet data interfaces
│   │   └── PetData.ts            # Sample pet data
│   ├── systems/
│   │   └── AnimationSystem.ts    # Animation engine
│   └── utils/
│       └── PetExporter.ts        # Export utilities
├── public/
│   └── sprites/                  # Sprite assets (placeholder)
└── package.json
```

## 🛠️ Cài đặt

```bash
# Clone project
git clone <repository-url>
cd pet-generator

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🎮 Sử dụng

### 1. Xem Pet Models
- Chọn pet từ dropdown menu
- Xem thông tin chi tiết: stats, abilities, evolution
- Preview animations và effects

### 2. Export Data
- Chọn format export (JSON, XML, CSV, Unity, Unreal)
- Tùy chọn include/exclude: sprites, animations, abilities, stats
- Click "Export Pet" hoặc "Export All Pets"
- Download file với tên tự động generate

### 3. Generate Configs
- **Sprite Config**: Cấu hình sprite sheet cho artist
- **Animation Timeline**: Timeline cho animation system
- **Ability Config**: Cấu hình abilities cho game logic

## 📊 Sample Pets

### Long Viêm (Fire Dragon)
- **Type**: Fire
- **Rarity**: Legendary
- **Level**: 100
- **Abilities**: 
  - Hơi Thở Lửa (Fire Breath)
  - Cơn Thịnh Nộ Rồng (Dragon Rage)

### Thủy Linh (Water Spirit)
- **Type**: Water
- **Rarity**: Epic
- **Level**: 85
- **Abilities**:
  - Sóng Thủy Triều (Water Burst)
  - Sóng Hồi Phục (Healing Wave)

### Địa Thần (Earth Guardian)
- **Type**: Earth
- **Rarity**: Rare
- **Level**: 75
- **Abilities**:
  - Đập Đá (Stone Smash)
  - Rào Cản Đất (Earth Barrier)

## 🔧 API Reference

### PetExporter

```typescript
// Export single pet
const jsonData = PetExporter.exportPet('fire_dragon', { 
  format: 'json',
  includeSprites: true,
  includeAnimations: true 
});

// Export all pets
const allPets = PetExporter.exportAllPets({ format: 'unity' });

// Export by type
const firePets = PetExporter.exportPetsByType('fire');

// Export by rarity
const legendaryPets = PetExporter.exportPetsByRarity('legendary');

// Generate configs
const spriteConfig = PetExporter.generateSpriteSheetConfig('fire_dragon');
const timeline = PetExporter.generateAnimationTimeline('fire_dragon');
const abilityConfig = PetExporter.generateAbilityConfig('fire_dragon');
```

### AnimationSystem

```typescript
const animSystem = new AnimationSystem();

// Load sprite sheet
await animSystem.loadSpriteSheet('fire_dragon', '/sprites/fire_dragon.png', frameData);

// Start animation
animSystem.startAnimation('fire_dragon', 'attacking', () => {
  console.log('Animation complete');
});

// Update animation
animSystem.updateAnimation('fire_dragon', deltaTime);

// Render
animSystem.renderSprite(ctx, 'fire_dragon', x, y, scale);
animSystem.renderParticles(ctx);
```

## 🎨 Customization

### Thêm Pet Mới

1. **Thêm vào PetData.ts**:
```typescript
'new_pet': {
  id: 'new_pet',
  name: 'Tên Pet',
  type: 'fire',
  rarity: 'epic',
  stats: { /* ... */ },
  animations: { /* ... */ },
  abilities: [ /* ... */ ],
  // ...
}
```

2. **Tạo Sprite Assets**:
```
public/sprites/new_pet/
├── idle.png
├── walk.png
├── attack.png
├── defend.png
├── special.png
├── hurt.png
├── evolution.png
└── icon.png
```

### Tùy chỉnh Animation Effects

```typescript
effects: [
  {
    type: 'particle',
    params: { 
      color: '#FF0000', 
      count: 10, 
      size: 8 
    },
    timing: 0.3
  },
  {
    type: 'screenShake',
    params: { 
      intensity: 5, 
      duration: 200 
    },
    timing: 0.4
  }
]
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 🤝 Contributing

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub repository.
