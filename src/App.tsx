import { useCallback, useEffect, useState } from 'react';
import { getCityByIp, isApiKeyConfigured } from './api/weather';
import { Modal } from './components/Modal';
import { WeatherBlock } from './components/WeatherBlock';
import { useUser } from './context/UserContext';
import { hasSavedCities, useAppState } from './hooks/useAppState';
import { createCityId, useFavorites } from './hooks/useFavorites';
import type { City } from './types/weather';
import './App.css';

const MAX_BLOCKS = 5;
const MAX_FAVORITES = 5;

export default function App() {
  const { lang, themeMode, setLang, setThemeMode, t } = useUser();
  const {
    blocks,
    activeTab,
    setActiveTab,
    addBlock,
    updateBlockCity,
    removeBlock,
    setDefaultCity,
  } = useAppState();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showFavoritesLimit, setShowFavoritesLimit] = useState(false);
  const [initialLoading, setInitialLoading] = useState(() => !hasSavedCities(blocks));

  const { favorites, isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    if (hasSavedCities(blocks)) {
      setInitialLoading(false);
      return;
    }

    let cancelled = false;

    async function detectCity() {
      const city = await getCityByIp(lang);
      if (!cancelled && city) {
        setDefaultCity(city);
      }
      if (!cancelled) {
        setInitialLoading(false);
      }
    }

    detectCity();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddBlock = () => {
    if (blocks.length >= MAX_BLOCKS) return;
    addBlock();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    removeBlock(deleteTarget);
    setDeleteTarget(null);
  };

  const handleToggleFavorite = useCallback(
    (city: City) => {
      const id = createCityId(city.lat, city.lon);

      if (isFavorite(city.lat, city.lon)) {
        const fav = favorites.find((f) => f.id === id);
        if (fav) removeFavorite(fav.id);
        return;
      }

      if (favorites.length >= MAX_FAVORITES) {
        setShowFavoritesLimit(true);
        return;
      }

      addFavorite({ ...city, id });
    },
    [favorites, isFavorite, addFavorite, removeFavorite],
  );

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">{t('appTitle')}</h1>

        <div className="app__header-controls">
          <div className="toggle-group">
            <button
              type="button"
              className={`toggle-btn ${themeMode === 'day' ? 'toggle-btn--active' : ''}`}
              onClick={() => setThemeMode('day')}
            >
              {t('themeDay')}
            </button>
            <button
              type="button"
              className={`toggle-btn ${themeMode === 'night' ? 'toggle-btn--active' : ''}`}
              onClick={() => setThemeMode('night')}
            >
              {t('themeNight')}
            </button>
          </div>

          <div className="toggle-group">
            <button
              type="button"
              className={`toggle-btn ${lang === 'uk' ? 'toggle-btn--active' : ''}`}
              onClick={() => setLang('uk')}
            >
              UK
            </button>
            <button
              type="button"
              className={`toggle-btn ${lang === 'en' ? 'toggle-btn--active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {!isApiKeyConfigured() && (
        <div className="app__api-warning" role="alert">
          {t('errorApiKey')}
        </div>
      )}

      <nav className="app__tabs">
        <button
          type="button"
          className={`app__tab ${activeTab === 'main' ? 'app__tab--active' : ''}`}
          onClick={() => setActiveTab('main')}
        >
          {t('tabMain')}
        </button>
        <button
          type="button"
          className={`app__tab ${activeTab === 'favorites' ? 'app__tab--active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          {t('tabFavorites')}
          {favorites.length > 0 && (
            <span className="app__tab-badge">{favorites.length}</span>
          )}
        </button>
      </nav>

      <main className="app__main">
        {initialLoading && activeTab === 'main' ? (
          <p className="app__loading-text">{t('loading')}</p>
        ) : activeTab === 'main' ? (
          <>
            <div className="app__blocks">
              {blocks.map((block) => (
                <WeatherBlock
                  key={block.id}
                  city={block.city}
                  onCityChange={(city) => updateBlockCity(block.id, city)}
                  onDelete={() => setDeleteTarget(block.id)}
                  showDelete={blocks.length > 1}
                  showCityInput
                  isFavorite={block.city ? isFavorite(block.city.lat, block.city.lon) : false}
                  onToggleFavorite={() => block.city && handleToggleFavorite(block.city)}
                />
              ))}
            </div>

            {blocks.length < MAX_BLOCKS && (
              <button type="button" className="btn btn--add" onClick={handleAddBlock}>
                + {t('addBlock')}
              </button>
            )}

            {blocks.length >= MAX_BLOCKS && (
              <p className="app__limit-text">{t('maxBlocks')}</p>
            )}
          </>
        ) : (
          <>
            {favorites.length === 0 ? (
              <p className="app__empty">{t('noFavorites')}</p>
            ) : (
              <div className="app__blocks">
                {favorites.map((fav) => (
                  <WeatherBlock
                    key={fav.id}
                    city={fav}
                    showCityInput={false}
                    showDelete={false}
                    isFavorite
                    onToggleFavorite={() => removeFavorite(fav.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={t('deleteBlock')}
        actions={
          <>
            <button type="button" className="btn btn--secondary" onClick={() => setDeleteTarget(null)}>
              {t('cancel')}
            </button>
            <button type="button" className="btn btn--danger" onClick={confirmDelete}>
              {t('confirm')}
            </button>
          </>
        }
      >
        {t('confirmDelete')}
      </Modal>

      <Modal
        isOpen={showFavoritesLimit}
        onClose={() => setShowFavoritesLimit(false)}
      >
        {t('favoritesLimit')}
      </Modal>
    </div>
  );
}
