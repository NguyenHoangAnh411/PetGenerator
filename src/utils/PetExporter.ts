import { PetModel, PetType, PetRarity, PetAnimation, PetSprites, PetAbility, PetStats } from '../models/PetModel';
import { PET_DATA } from '../models/PetData';

export interface ExportOptions {
  format: 'json' | 'xml' | 'csv' | 'unity' | 'unreal';
  includeSprites: boolean;
  includeAnimations: boolean;
  includeAbilities: boolean;
  includeStats: boolean;
  compression: boolean;
}

interface SpriteSheetConfig {
  petId: string;
  sprites: PetSprites;
  animations: PetAnimation[];
  recommendedSize: {
    width: number;
    height: number;
    frameWidth: number;
    frameHeight: number;
  };
}

interface AnimationTimeline {
  petId: string;
  animations: Record<string, {
    duration: number;
    frames: number;
    frameTime: number;
    effects: Array<{
      type: string;
      params: Record<string, string | number | boolean>;
      timing: number;
      frameTrigger: number;
    }>;
  }>;
}

interface AbilityConfig {
  petId: string;
  abilities: Array<PetAbility & {
    animationConfig: {
      triggerFrame: number;
      effectFrames: number[];
      soundTriggers: number[];
    };
  }>;
}

interface ExportData {
  id: string;
  name: string;
  type: PetType;
  rarity: PetRarity;
  description: string;
  stats?: PetStats;
  sprites?: PetSprites;
  animations?: Record<string, PetAnimation>;
  abilities?: PetAbility[];
  evolution?: {
    nextStage: string;
    levelRequired: number;
    itemsRequired: string[];
    animation: string;
  };
  unlockCondition?: string;
}

interface ExportDataCollection {
  pets: ExportData[];
  metadata: Record<string, unknown>;
}

type ExportDataType = ExportData | ExportDataCollection;

export class PetExporter {
  private static readonly DEFAULT_OPTIONS: ExportOptions = {
    format: 'json',
    includeSprites: true,
    includeAnimations: true,
    includeAbilities: true,
    includeStats: true,
    compression: false
  };

  /**
   * Export single pet to specified format
   */
  static exportPet(petId: string, options: Partial<ExportOptions> = {}): string {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const pet = PET_DATA[petId];
    
    if (!pet) {
      throw new Error(`Pet with ID ${petId} not found`);
    }

    const exportData = this.preparePetData(pet, opts);

    switch (opts.format) {
      case 'json':
        return this.exportToJSON(exportData, opts.compression);
      case 'xml':
        return this.exportToXML(exportData);
      case 'csv':
        return this.exportToCSV(exportData);
      case 'unity':
        return this.exportToUnity(exportData);
      case 'unreal':
        return this.exportToUnreal(exportData);
      default:
        throw new Error(`Unsupported format: ${opts.format}`);
    }
  }

  /**
   * Export all pets to specified format
   */
  static exportAllPets(options: Partial<ExportOptions> = {}): string {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const pets = Object.values(PET_DATA);
    
    const exportData = {
      pets: pets.map(pet => this.preparePetData(pet, opts)),
      metadata: {
        totalPets: pets.length,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    switch (opts.format) {
      case 'json':
        return this.exportToJSON(exportData, opts.compression);
      case 'xml':
        return this.exportToXML(exportData);
      case 'csv':
        return this.exportToCSV(exportData);
      case 'unity':
        return this.exportToUnity(exportData);
      case 'unreal':
        return this.exportToUnreal(exportData);
      default:
        throw new Error(`Unsupported format: ${opts.format}`);
    }
  }

  /**
   * Export pets by type
   */
  static exportPetsByType(type: PetType, options: Partial<ExportOptions> = {}): string {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const pets = Object.values(PET_DATA).filter(pet => pet.type === type);
    
    const exportData = {
      pets: pets.map(pet => this.preparePetData(pet, opts)),
      metadata: {
        type,
        totalPets: pets.length,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    return this.exportToJSON(exportData, opts.compression);
  }

  /**
   * Export pets by rarity
   */
  static exportPetsByRarity(rarity: PetRarity, options: Partial<ExportOptions> = {}): string {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const pets = Object.values(PET_DATA).filter(pet => pet.rarity === rarity);
    
    const exportData = {
      pets: pets.map(pet => this.preparePetData(pet, opts)),
      metadata: {
        rarity,
        totalPets: pets.length,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    return this.exportToJSON(exportData, opts.compression);
  }

  /**
   * Generate sprite sheet configuration
   */
  static generateSpriteSheetConfig(petId: string): SpriteSheetConfig {
    const pet = PET_DATA[petId];
    if (!pet) throw new Error(`Pet with ID ${petId} not found`);

    return {
      petId,
      sprites: pet.sprites,
      animations: Object.keys(pet.animations).map(animName => ({
        ...pet.animations[animName]
      })),
      recommendedSize: {
        width: 512,
        height: 512,
        frameWidth: 64,
        frameHeight: 64
      }
    };
  }

  /**
   * Generate animation timeline
   */
  static generateAnimationTimeline(petId: string): AnimationTimeline {
    const pet = PET_DATA[petId];
    if (!pet) throw new Error(`Pet with ID ${petId} not found`);

    const timeline: AnimationTimeline = {
      petId,
      animations: {}
    };

    Object.entries(pet.animations).forEach(([animName, anim]) => {
      timeline.animations[animName] = {
        duration: anim.duration,
        frames: anim.frames,
        frameTime: anim.duration / anim.frames,
        effects: anim.effects?.map(effect => ({
          ...effect,
          frameTrigger: Math.floor(effect.timing * anim.frames)
        })) || []
      };
    });

    return timeline;
  }

  /**
   * Generate ability configuration
   */
  static generateAbilityConfig(petId: string): AbilityConfig {
    const pet = PET_DATA[petId];
    if (!pet) throw new Error(`Pet with ID ${petId} not found`);

    return {
      petId,
      abilities: pet.abilities.map(ability => ({
        ...ability,
        animationConfig: {
          triggerFrame: 0,
          effectFrames: [2, 4, 6],
          soundTriggers: [0, 0.5, 1.0]
        }
      }))
    };
  }

  // Private helper methods
  private static preparePetData(pet: PetModel, options: ExportOptions): ExportData {
    const data: ExportData = {
      id: pet.id,
      name: pet.name,
      type: pet.type,
      rarity: pet.rarity,
      description: pet.description
    };

    if (options.includeStats) {
      data.stats = pet.stats;
    }

    if (options.includeSprites) {
      data.sprites = pet.sprites;
    }

    if (options.includeAnimations) {
      data.animations = pet.animations;
    }

    if (options.includeAbilities) {
      data.abilities = pet.abilities;
    }

    if (pet.evolution) {
      data.evolution = pet.evolution;
    }

    if (pet.unlockCondition) {
      data.unlockCondition = pet.unlockCondition;
    }

    return data;
  }

  private static exportToJSON(data: ExportDataType, compression: boolean): string {
    const json = JSON.stringify(data, null, compression ? 0 : 2);
    return compression ? this.compressString(json) : json;
  }

  private static exportToXML(data: ExportDataType): string {
    const xml = this.convertToXML(data);
    return `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
  }

  private static exportToCSV(data: ExportDataType): string {
    if ('pets' in data) {
      return this.convertToCSV(data.pets);
    }
    return this.convertToCSV([data]);
  }

  private static exportToUnity(data: ExportDataType): string {
    return this.convertToUnityScript(data);
  }

  private static exportToUnreal(data: ExportDataType): string {
    return this.convertToUnrealBlueprint(data);
  }

  private static convertToXML(obj: ExportDataType, indent: string = ''): string {
    let xml = '';
    
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        xml += `${indent}<item>\n${this.convertToXML(item, indent + '  ')}${indent}</item>\n`;
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          xml += `${indent}<${key}>\n${this.convertToXML(value, indent + '  ')}${indent}</${key}>\n`;
        } else {
          xml += `${indent}<${key}>${value}</${key}>\n`;
        }
      });
    } else {
      xml += `${indent}${obj}\n`;
    }
    
    return xml;
  }

  private static convertToCSV(pets: ExportData[]): string {
    if (pets.length === 0) return '';

    const headers = ['id', 'name', 'type', 'rarity', 'level', 'health', 'attack', 'defense', 'speed'];
    let csv = headers.join(',') + '\n';

    pets.forEach(pet => {
      const row = [
        pet.id,
        pet.name,
        pet.type,
        pet.rarity,
        pet.stats?.level || '',
        pet.stats?.health || '',
        pet.stats?.attack || '',
        pet.stats?.defense || '',
        pet.stats?.speed || ''
      ];
      csv += row.join(',') + '\n';
    });

    return csv;
  }

  private static convertToUnityScript(data: ExportDataType): string {
    return `using UnityEngine;
using System.Collections.Generic;

[System.Serializable]
public class PetData
{
    public string id;
    public string name;
    public string type;
    public string rarity;
    public PetStats stats;
    public PetAnimation[] animations;
    public PetAbility[] abilities;
}

[System.Serializable]
public class PetStats
{
    public int health;
    public int maxHealth;
    public int energy;
    public int maxEnergy;
    public int attack;
    public int defense;
    public int speed;
    public int level;
}

[System.Serializable]
public class PetAnimation
{
    public string name;
    public float duration;
    public int frames;
    public bool loop;
}

[System.Serializable]
public class PetAbility
{
    public string id;
    public string name;
    public string description;
    public string type;
    public float cooldown;
    public int energyCost;
}

public class PetDatabase : MonoBehaviour
{
    public PetData[] pets = ${JSON.stringify('pets' in data ? data.pets : [data], null, 2)};
}`;
  }

  private static convertToUnrealBlueprint(data: ExportDataType): string {
    return `// Unreal Engine Blueprint C++ Class
// PetData.h

#pragma once

#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "PetData.generated.h"

USTRUCT(BlueprintType)
struct FPetStats
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 Health;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 MaxHealth;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 Energy;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 MaxEnergy;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 Attack;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 Defense;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 Speed;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 Level;
};

USTRUCT(BlueprintType)
struct FPetAnimation
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString Name;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    float Duration;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 Frames;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    bool Loop;
};

USTRUCT(BlueprintType)
struct FPetAbility
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString Id;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString Name;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString Description;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString Type;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    float Cooldown;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 EnergyCost;
};

USTRUCT(BlueprintType)
struct FPetData
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString Id;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString Name;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString Type;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString Rarity;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FPetStats Stats;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    TArray<FPetAnimation> Animations;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    TArray<FPetAbility> Abilities;
};

UCLASS(BlueprintType)
class UPetDatabase : public UDataAsset
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    TArray<FPetData> Pets;
};`;
  }

  private static compressString(str: string): string {
    // Simple compression - remove whitespace and newlines
    return str.replace(/\s+/g, '');
  }

  /**
   * Download exported data as file
   */
  static downloadFile(content: string, filename: string, mimeType: string = 'application/json'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Generate export filename
   */
  static generateFilename(petId: string, format: string, options: ExportOptions): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const compression = options.compression ? '_compressed' : '';
    return `pet_${petId}_${format}${compression}_${timestamp}.${format}`;
  }
} 