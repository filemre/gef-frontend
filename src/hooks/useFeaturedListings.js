import { useEffect, useState } from 'react';

export default function useFeaturedListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/listings/featured')
      .then((res) => {
        if (!res.ok) throw new Error('İlanlar yüklenemedi');
        return res.json();
      })
      .then((data) => setListings(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { listings, loading, error };
}
