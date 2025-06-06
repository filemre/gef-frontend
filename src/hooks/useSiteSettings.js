import { useEffect, useState } from 'react';
import api from '../api';

// Site ayarlarını backend'den dinamik olarak çeken custom hook
export function useSiteSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/site-settings')
      .then(res => setSettings(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading, error };
}
