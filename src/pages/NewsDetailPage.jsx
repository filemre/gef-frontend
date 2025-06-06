// Haber Detay Sayfası: Tek bir haberin detayını gösterir
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import PageTitle from '../components/PageTitle';

// YouTube URL'sinden video ID'sini çıkarma yardımcı fonksiyonu
function getYoutubeVideoId(url) {
  if (!url) return null;
  
  // YouTube video URL formatları:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  
  let videoId = '';
  
  // watch?v= formatı
  const watchUrlMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchUrlMatch) return watchUrlMatch[1];
  
  // youtu.be/ formatı
  const shortUrlMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortUrlMatch) return shortUrlMatch[1];
  
  // embed/ formatı
  const embedUrlMatch = url.match(/youtube\.com\/embed\/([^?]+)/);
  if (embedUrlMatch) return embedUrlMatch[1];
  
  return null;
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/news/${id}`)
      .then(res => setNews(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error.message}</div>;
  if (!news) return <div>Haber bulunamadı.</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <PageTitle>{news.title}</PageTitle>
      <div className="text-gray-600 text-sm mb-2">{news.created_at}</div>
      
      {/* Kapak fotoğrafı ve galeri */}
      {news.images && news.images.length > 0 ? (
        <div className="mb-6">
          {/* Kapak fotoğrafı - Eğer seçilmişse */}
          {news.featured_image_index !== null && news.images[news.featured_image_index] && (
            <div className="mb-3">
              <img 
                src={news.images[news.featured_image_index]} 
                alt={news.title} 
                className="w-full h-72 object-cover rounded"
                loading="lazy"
              />
            </div>
          )}
          
          {/* Diğer fotoğraflar */}
          {news.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto mb-3">
              {news.images.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  alt="Haber görseli" 
                  className={`h-24 rounded ${i === news.featured_image_index ? 'ring-2 ring-blue-500' : ''}`} 
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>
      ) : null}
      
      {/* YouTube Video */}
      {news.youtube_video_url && (
        <div className="mb-6 aspect-w-16 aspect-h-9">
          <iframe 
            className="w-full h-64 rounded-lg" 
            src={`https://www.youtube.com/embed/${getYoutubeVideoId(news.youtube_video_url)}`} 
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      )}
      
      <div className="mb-4">{news.content}</div>
      <Link to="/haberler" className="text-blue-600 hover:underline">← Haberlere Dön</Link>
    </div>
  );
}
