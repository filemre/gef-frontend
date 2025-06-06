import { useEffect, useState } from 'react';
import api from '../api';

export function useListingCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/listing-categories')
      .then(res => setCategories(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}
