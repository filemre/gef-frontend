import { useEffect, useState } from 'react';

export default function useFeaturedNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/news/featured')
      .then((res) => {
        if (!res.ok) throw new Error('Haberler yüklenemedi');
        return res.json();
      })
      .then((data) => setNews(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { news, loading, error };
}
