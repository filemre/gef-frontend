import { useEffect, useState } from 'react';

export default function useFeaturedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/blog/featured')
      .then((res) => {
        if (!res.ok) throw new Error('Bloglar yüklenemedi');
        return res.json();
      })
      .then((data) => setBlogs(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { blogs, loading, error };
}
