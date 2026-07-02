import { useEffect, useRef, useState } from 'react';
import { searchCities } from '../api/weather';
import { useUser } from '../context/UserContext';
import type { City } from '../types/weather';
import './CityAutocomplete.css';

interface CityAutocompleteProps {
  value: City | null;
  onSelect: (city: City) => void;
  disabled?: boolean;
}

export function CityAutocomplete({ value, onSelect, disabled }: CityAutocompleteProps) {
  const { lang, t } = useUser();
  const [query, setQuery] = useState(value ? `${value.name}, ${value.country}` : '');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setQuery(`${value.name}, ${value.country}`);
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (disabled) return;

    const timer = setTimeout(async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      const currentLabel = value ? `${value.name}, ${value.country}` : '';
      if (query === currentLabel) return;

      setLoading(true);
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, lang, value, disabled]);

  function handleSelect(city: City) {
    onSelect(city);
    setQuery(`${city.name}, ${city.country}`);
    setIsOpen(false);
    setSuggestions([]);
  }

  return (
    <div className="autocomplete" ref={wrapperRef}>
      <input
        type="text"
        className="autocomplete__input"
        placeholder={t('searchPlaceholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        disabled={disabled}
        autoComplete="off"
      />
      {loading && <span className="autocomplete__loading" />}
      {isOpen && suggestions.length > 0 && (
        <ul className="autocomplete__list" role="listbox">
          {suggestions.map((city) => (
            <li key={`${city.lat}-${city.lon}`}>
              <button
                type="button"
                className="autocomplete__item"
                onClick={() => handleSelect(city)}
                role="option"
              >
                {city.name}, {city.country}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
