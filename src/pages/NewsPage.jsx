// Haberler Sayfası: AI tarafından oluşturulan haberlerin listesi
import { useEffect, useState } from 'react';
import api from '../api';
import NewsCard from '../components/NewsCard';
import PageTitle from '../components/PageTitle';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Filtreleme ve arama için ek state
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/news')
      .then(res => setNews(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  // Filtreleme işlemi
  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.content.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="container mx-auto p-4 text-center">
      <div className="animate-pulse bg-gray-100 h-10 w-48 mx-auto mb-8 rounded"></div>
      <div className="animate-pulse bg-gray-100 h-8 w-full max-w-md mx-auto mb-8 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 h-64 rounded"></div>
        ))}
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mx-auto p-4 text-center text-red-500">
      <PageTitle>Hata</PageTitle>
      <p>{error.message}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <PageTitle>Son Haberler</PageTitle>
      
      {/* Arama kutusu */}
      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Başlık veya içerikte ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      
      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map(item => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p className="text-xl">Arama kriterlerine uygun haber bulunamadı.</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" 
            onClick={() => setSearch('')}
          >
            Filtreyi Temizle
          </button>
        </div>
      )}
    </div>
  );
}
