import { useEffect, useState } from 'react';
import { geocodeUkraineCity } from '../api/weather';
import { getCityDisplayName, UKRAINE_CITIES } from '../data/ukraineCities';
import { useUser } from '../context/UserContext';
import { getErrorMessage } from '../i18n/errors';
import type { City } from '../types/weather';
import { CityAutocomplete } from './CityAutocomplete';
import './CitySelector.css';

interface CitySelectorProps {
  value: City | null;
  onSelect: (city: City) => void;
  disabled?: boolean;
}

export function CitySelector({ value, onSelect, disabled }: CitySelectorProps) {
  const { lang, t } = useUser();
  const [selectLoading, setSelectLoading] = useState(false);
  const [selectError, setSelectError] = useState<string | null>(null);
  const [selectedUaCity, setSelectedUaCity] = useState('');

  useEffect(() => {
    setSelectError(null);
  }, [lang]);

  async function handleSelectChange(cityUkName: string) {
    if (!cityUkName) {
      setSelectedUaCity('');
      return;
    }

    setSelectLoading(true);
    setSelectError(null);

    try {
      const city = await geocodeUkraineCity(cityUkName, lang);
      if (!city) {
        setSelectError(getErrorMessage('city'));
        return;
      }
      setSelectedUaCity(cityUkName);
      onSelect(city);
    } catch (err) {
      const message = err instanceof Error ? err.message : getErrorMessage('fetch');
      setSelectError(message);
    } finally {
      setSelectLoading(false);
    }
  }

  function handleAutocompleteSelect(city: City) {
    setSelectedUaCity('');
    setSelectError(null);
    onSelect(city);
  }

  return (
    <div className="city-selector">
      <label className="city-selector__label">
        <span>{t('selectCity')}</span>
        <select
          className="city-selector__select"
          value={selectedUaCity}
          onChange={(e) => handleSelectChange(e.target.value)}
          disabled={disabled || selectLoading}
        >
          <option value="">{t('selectCityPlaceholder')}</option>
          {UKRAINE_CITIES.map((city) => (
            <option key={city.uk} value={city.uk}>
              {getCityDisplayName(city, lang)}
            </option>
          ))}
        </select>
      </label>

      {selectLoading && <span className="city-selector__loading">{t('loading')}</span>}
      {selectError && <p className="city-selector__error">{selectError}</p>}

      <p className="city-selector__divider">{t('orSearchCity')}</p>
      <CityAutocomplete value={value} onSelect={handleAutocompleteSelect} disabled={disabled} />
    </div>
  );
}
