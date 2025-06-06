import React from 'react';
import useFeaturedBlogs from '../hooks/useFeaturedBlogs';

export default function FeaturedBlogs() {
  const { blogs, loading, error } = useFeaturedBlogs();

  if (loading) return <div>Öne çıkan bloglar yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;
  if (!blogs.length) return <div>Öne çıkan blog bulunamadı.</div>;

  return (
    <div className="featured-blogs">
      <h2>Öne Çıkan Bloglar</h2>
      <div className="featured-list">
        {blogs.map((blog) => (
          <div key={blog.id} className="featured-item">
            {blog.images && blog.images.length > 0 && (
              <img src={blog.images[blog.featured_image_index || 0]} alt={blog.title} style={{maxWidth:200}} loading="lazy" />
            )}
            <h3>{blog.title}</h3>
            <div className="date">{blog.published_at?.slice(0,10)}</div>
            <div className="content" dangerouslySetInnerHTML={{__html: blog.content?.slice(0,120)+'...'}} />
            <a href={`/blog/${blog.slug}`}>Devamını Oku</a>
          </div>
        ))}
      </div>
    </div>
  );
}
