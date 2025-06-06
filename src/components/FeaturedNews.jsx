import React from 'react';
import useFeaturedNews from '../hooks/useFeaturedNews';

export default function FeaturedNews() {
  const { news, loading, error } = useFeaturedNews();

  if (loading) return <div>Öne çıkan haberler yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;
  if (!news.length) return <div>Öne çıkan haber bulunamadı.</div>;

  return (
    <div className="featured-news">
      <h2>Öne Çıkan Haberler</h2>
      <div className="featured-list">
        {news.map((item) => (
          <div key={item.id} className="featured-item">
            {item.images && item.images.length > 0 && (
              <img src={item.images[item.featured_image_index || 0]} alt={item.title} style={{maxWidth:200}} loading="lazy" />
            )}
            <h3>{item.title}</h3>
            <div className="date">{item.created_at?.slice(0,10)}</div>
            <div className="content" dangerouslySetInnerHTML={{__html: item.content?.slice(0,120)+'...'}} />
          </div>
        ))}
      </div>
    </div>
  );
}
