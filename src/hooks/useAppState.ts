import { useEffect, useState } from 'react';
import type { City, WeatherBlockData } from '../types/weather';

const BLOCKS_STORAGE_KEY = 'weather-blocks';
const TAB_STORAGE_KEY = 'weather-active-tab';

export type AppTab = 'main' | 'favorites';

function createBlock(city: City | null = null): WeatherBlockData {
  return { id: crypto.randomUUID(), city };
}

function loadBlocks(): WeatherBlockData[] {
  try {
    const stored = localStorage.getItem(BLOCKS_STORAGE_KEY);
    if (!stored) return [createBlock()];

    const parsed = JSON.parse(stored) as WeatherBlockData[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [createBlock()];

    return parsed.map((block) => ({
      id: block.id || crypto.randomUUID(),
      city: block.city ?? null,
    }));
  } catch {
    return [createBlock()];
  }
}

function loadActiveTab(): AppTab {
  const stored = localStorage.getItem(TAB_STORAGE_KEY);
  return stored === 'favorites' ? 'favorites' : 'main';
}

export function hasSavedCities(blocks: WeatherBlockData[]): boolean {
  return blocks.some((block) => block.city !== null);
}

export function useAppState() {
  const [blocks, setBlocks] = useState<WeatherBlockData[]>(loadBlocks);
  const [activeTab, setActiveTab] = useState<AppTab>(loadActiveTab);

  useEffect(() => {
    localStorage.setItem(BLOCKS_STORAGE_KEY, JSON.stringify(blocks));
  }, [blocks]);

  useEffect(() => {
    localStorage.setItem(TAB_STORAGE_KEY, activeTab);
  }, [activeTab]);

  const addBlock = () => setBlocks((prev) => [...prev, createBlock()]);

  const updateBlockCity = (blockId: string, city: City) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === blockId ? { ...block, city } : block)),
    );
  };

  const removeBlock = (blockId: string) => {
    setBlocks((prev) => {
      const filtered = prev.filter((block) => block.id !== blockId);
      return filtered.length === 0 ? [createBlock()] : filtered;
    });
  };

  const setDefaultCity = (city: City) => {
    setBlocks((prev) => {
      if (prev.length === 0) return [createBlock(city)];
      if (prev[0].city) return prev;
      return [{ ...prev[0], city }, ...prev.slice(1)];
    });
  };

  return {
    blocks,
    activeTab,
    setActiveTab,
    addBlock,
    updateBlockCity,
    removeBlock,
    setDefaultCity,
  };
}
