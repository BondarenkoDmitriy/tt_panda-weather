import { useCallback, useEffect, useState } from 'react';
import type { FavoriteCity } from '../types/weather';

const STORAGE_KEY = 'weather-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCity[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (lat: number, lon: number) =>
      favorites.some((f) => f.lat === lat && f.lon === lon),
    [favorites],
  );

  const addFavorite = useCallback((city: FavoriteCity) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.lat === city.lat && f.lon === city.lon)) return prev;
      return [...prev, city];
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return { favorites, isFavorite, addFavorite, removeFavorite };
}

export function createCityId(lat: number, lon: number): string {
  return `${lat.toFixed(2)}_${lon.toFixed(2)}`;
}
