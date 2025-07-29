"use client";

import { useState } from 'react';
import { getPetById, PET_DATA } from '../models/PetData';
import { PetExporter } from '../utils/PetExporter';
import { AnimationSystem } from '../systems/AnimationSystem';

export default function PetModelViewer() {
  const [selectedPet, setSelectedPet] = useState<string>('fire_dragon');
  const [exportFormat, setExportFormat] = useState<'json' | 'xml' | 'csv' | 'unity' | 'unreal'>('json');
  const [exportOptions, setExportOptions] = useState({
    includeSprites: true,
    includeAnimations: true,
    includeAbilities: true,
    includeStats: true,
    compression: false
  });
  const [exportedData, setExportedData] = useState<string>('');
  const [animationSystem] = useState(() => new AnimationSystem());

  const pet = getPetById(selectedPet);

  const handleExport = () => {
    try {
      const data = PetExporter.exportPet(selectedPet, {
        format: exportFormat,
        ...exportOptions
      });
      setExportedData(data);
    } catch (error) {
      console.error('Export failed:', error);
      setExportedData('Export failed: ' + (error as Error).message);
    }
  };

  const handleDownload = () => {
    if (!exportedData) return;
    
    const filename = PetExporter.generateFilename(selectedPet, exportFormat, {
      format: exportFormat,
      ...exportOptions
    });
    
    const mimeType = exportFormat === 'json' ? 'application/json' : 
                    exportFormat === 'xml' ? 'application/xml' : 
                    exportFormat === 'csv' ? 'text/csv' : 'text/plain';
    
    PetExporter.downloadFile(exportedData, filename, mimeType);
  };

  const handleExportAll = () => {
    try {
      const data = PetExporter.exportAllPets({
        format: exportFormat,
        ...exportOptions
      });
      setExportedData(data);
    } catch (error) {
      console.error('Export failed:', error);
      setExportedData('Export failed: ' + (error as Error).message);
    }
  };

  const handleDownloadAll = () => {
    if (!exportedData) return;
    
    const filename = `all_pets_${exportFormat}_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
    const mimeType = exportFormat === 'json' ? 'application/json' : 
                    exportFormat === 'xml' ? 'application/xml' : 
                    exportFormat === 'csv' ? 'text/csv' : 'text/plain';
    
    PetExporter.downloadFile(exportedData, filename, mimeType);
  };

  const generateSpriteSheetConfig = () => {
    try {
      const config = PetExporter.generateSpriteSheetConfig(selectedPet);
      setExportedData(JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('Failed to generate sprite sheet config:', error);
      setExportedData('Failed to generate sprite sheet config: ' + (error as Error).message);
    }
  };

  const generateAnimationTimeline = () => {
    try {
      const timeline = PetExporter.generateAnimationTimeline(selectedPet);
      setExportedData(JSON.stringify(timeline, null, 2));
    } catch (error) {
      console.error('Failed to generate animation timeline:', error);
      setExportedData('Failed to generate animation timeline: ' + (error as Error).message);
    }
  };

  const generateAbilityConfig = () => {
    try {
      const config = PetExporter.generateAbilityConfig(selectedPet);
      setExportedData(JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('Failed to generate ability config:', error);
      setExportedData('Failed to generate ability config: ' + (error as Error).message);
    }
  };

  if (!pet) {
    return <div className="text-white">Pet not found</div>;
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Pet Model Viewer & Exporter</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pet Selection and Info */}
        <div className="space-y-4">
          <div>
            <label className="text-white font-semibold mb-2 block">Select Pet:</label>
            <select 
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
            >
              {Object.keys(PET_DATA).map(petId => (
                <option key={petId} value={petId}>
                  {PET_DATA[petId].name} ({PET_DATA[petId].type})
                </option>
              ))}
            </select>
          </div>

          {/* Pet Information */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">{pet.name}</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/70">Type:</span>
                <span className="text-white ml-2 capitalize">{pet.type}</span>
              </div>
              <div>
                <span className="text-white/70">Rarity:</span>
                <span className="text-white ml-2 capitalize">{pet.rarity}</span>
              </div>
              <div>
                <span className="text-white/70">Level:</span>
                <span className="text-white ml-2">{pet.stats.level}</span>
              </div>
              <div>
                <span className="text-white/70">Health:</span>
                <span className="text-white ml-2">{pet.stats.health}/{pet.stats.maxHealth}</span>
              </div>
              <div>
                <span className="text-white/70">Attack:</span>
                <span className="text-white ml-2">{pet.stats.attack}</span>
              </div>
              <div>
                <span className="text-white/70">Defense:</span>
                <span className="text-white ml-2">{pet.stats.defense}</span>
              </div>
            </div>

            <p className="text-white/80 mt-3 text-sm">{pet.description}</p>
          </div>

          {/* Abilities */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Abilities:</h4>
            <div className="space-y-2">
              {pet.abilities.map(ability => (
                <div key={ability.id} className="text-sm">
                  <div className="text-white font-medium">{ability.name}</div>
                  <div className="text-white/70 text-xs">{ability.description}</div>
                  <div className="text-white/50 text-xs">
                    Cooldown: {ability.cooldown}ms | Energy: {ability.energyCost}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Controls */}
        <div className="space-y-4">
          <div>
            <label className="text-white font-semibold mb-2 block">Export Format:</label>
            <select 
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'json' | 'xml' | 'csv' | 'unity' | 'unreal')}
              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
            >
              <option value="json">JSON</option>
              <option value="xml">XML</option>
              <option value="csv">CSV</option>
              <option value="unity">Unity C#</option>
              <option value="unreal">Unreal Engine C++</option>
            </select>
          </div>

          <div>
            <label className="text-white font-semibold mb-2 block">Export Options:</label>
            <div className="space-y-2">
              {Object.entries(exportOptions).map(([key, value]) => (
                <label key={key} className="flex items-center text-white text-sm">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="mr-2"
                  />
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Export Pet
            </button>
            
            <button
              onClick={handleExportAll}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Export All Pets
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={generateSpriteSheetConfig}
                className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded text-sm"
              >
                Sprite Config
              </button>
              
              <button
                onClick={generateAnimationTimeline}
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded text-sm"
              >
                Animation Timeline
              </button>
            </div>

            <button
              onClick={generateAbilityConfig}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Ability Config
            </button>
          </div>

          {exportedData && (
            <div className="space-y-2">
              <button
                onClick={handleDownload}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
              >
                Download Pet Data
              </button>
              
              <button
                onClick={handleDownloadAll}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded"
              >
                Download All Pets
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Exported Data Preview */}
      {exportedData && (
        <div className="mt-6">
          <h3 className="text-white font-semibold mb-2">Exported Data Preview:</h3>
          <div className="bg-black/50 rounded-lg p-4 max-h-96 overflow-auto">
            <pre className="text-green-400 text-xs whitespace-pre-wrap">
              {exportedData}
            </pre>
          </div>
        </div>
      )}

      {/* Animation System Info */}
      <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2">Animation System Features:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="text-white font-medium mb-1">Sprite Management</h4>
            <ul className="text-white/70 space-y-1">
              <li>• Sprite sheet loading</li>
              <li>• Frame-based animation</li>
              <li>• Multiple animation states</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-1">Particle Effects</h4>
            <ul className="text-white/70 space-y-1">
              <li>• Dynamic particle systems</li>
              <li>• Physics-based movement</li>
              <li>• Life cycle management</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-1">Audio Integration</h4>
            <ul className="text-white/70 space-y-1">
              <li>• Sound effect triggers</li>
              <li>• Audio context support</li>
              <li>• Synchronized effects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 