import { useParams, Link } from 'react-router-dom';
import { useBlogPost } from '../hooks/useBlogPosts';
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

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { post, loading, error } = useBlogPost(slug);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error.message}</div>;
  if (!post) return <div>Yazı bulunamadı.</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <PageTitle>{post.title}</PageTitle>
      <div className="text-gray-500 text-sm mb-2">{post.published_at?.slice(0, 10)}</div>
      
      {/* Kapak fotoğrafı ve galeri */}
      {post.images && post.images.length > 0 ? (
        <div className="mb-6">
          {/* Kapak fotoğrafı - Eğer seçilmişse */}
          {post.featured_image_index !== null && post.images[post.featured_image_index] && (
            <div className="mb-3">
              <img 
                src={post.images[post.featured_image_index]} 
                alt={post.title} 
                className="w-full h-72 object-cover rounded"
              />
            </div>
          )}
          
          {/* Diğer fotoğraflar */}
          {post.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto mb-3">
              {post.images.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  alt="Blog görseli" 
                  className={`h-24 rounded ${i === post.featured_image_index ? 'ring-2 ring-blue-500' : ''}`} 
                />
              ))}
            </div>
          )}
        </div>
      ) : null}
      
      {/* YouTube Video */}
      {post.youtube_video_url && (
        <div className="mb-6 aspect-w-16 aspect-h-9">
          <iframe 
            className="w-full h-64 rounded-lg" 
            src={`https://www.youtube.com/embed/${getYoutubeVideoId(post.youtube_video_url)}`} 
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      )}
      
      {/* İçerik */}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      <Link to="/blog" className="inline-block mt-6 text-blue-600 hover:underline">← Bloga Dön</Link>
    </div>
  );
}
