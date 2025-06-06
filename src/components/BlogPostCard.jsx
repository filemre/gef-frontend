// Blog yazısı kartı bileşeni
import { Link } from 'react-router-dom';

export default function BlogPostCard({ post }) {
  // Gösterilecek resmi belirleyelim (kapak fotoğrafı varsa onu, yoksa ilk resmi)
  const displayImage = 
    post.images && post.images.length > 0
      ? (post.featured_image_index !== null && post.images[post.featured_image_index])
        ? post.images[post.featured_image_index]
        : post.images[0]
      : null;

  return (
    <div className="border rounded-lg p-4 shadow bg-white">
      {/* Resim */}
      {displayImage && (
        <div className="mb-3">
          <img
            src={displayImage}
            alt={post.title}
            className="w-full h-48 object-cover rounded-md mb-3"
            loading="lazy"
          />
        </div>
      )}
      
      <h2 className="text-xl font-bold mb-1">
        <Link to={`/blog/${post.slug}`} className="hover:underline text-blue-700">{post.title}</Link>
      </h2>
      <div className="text-gray-500 text-sm mb-2">{post.published_at?.slice(0, 10)}</div>
      <div className="line-clamp-3 text-gray-700" dangerouslySetInnerHTML={{ __html: post.content }} />
      
      {/* Detay linki */}
      <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:underline text-sm block mt-3">
        Devamını Oku →
      </Link>
    </div>
  );
}
