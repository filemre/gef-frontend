// Popüler ilanları API'den çekmek için hook
import { useState, useEffect } from 'react';
import api from '../api';

export function usePopularListings() {
  const [popularListings, setPopularListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/listings/popular')
      .then(res => setPopularListings(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { popularListings, loading, error };
}
