import { useEffect, useState } from 'react';
import api from '../api';

// Aktif duyuruları çeken custom hook
export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/announcements')
      .then(res => setAnnouncements(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { announcements, loading, error };
}
