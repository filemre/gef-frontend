import React, { useEffect, useState } from 'react';

// Haberleri backend API'den çeken fonksiyon
const fetchNews = async () => {
  const response = await fetch('/api/news');
  if (!response.ok) throw new Error('Haberler alınamadı');
  return response.json();
};

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews()
      .then(setNews)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Haberler</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map(item => (
          <div key={item.id} className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
            <div className="text-gray-500 text-xs mb-2">{item.created_at}</div>
            <p className="text-gray-700 line-clamp-4">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
