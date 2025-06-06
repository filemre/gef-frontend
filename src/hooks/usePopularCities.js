// Popüler şehirleri API'den çekmek için hook
import { useState, useEffect } from 'react';
import api from '../api';

export function usePopularCities() {
  const [popularCities, setPopularCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/listings/popular-cities')
      .then(res => setPopularCities(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { popularCities, loading, error };
}
