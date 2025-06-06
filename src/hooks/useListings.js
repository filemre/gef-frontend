// React custom hook: API'den ilanları çekmek için örnek kullanım
import { useEffect, useState } from 'react';
import api from '../api';

export function useListings(filters = {}) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/listings', { params: filters })
      .then(res => setListings(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  return { listings, loading, error };
}
