import { useBlogPosts } from '../hooks/useBlogPosts';
import BlogPostCard from '../components/BlogPostCard';
import PageTitle from '../components/PageTitle';

export default function BlogPage() {
  const { posts, loading, error } = useBlogPosts();

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <PageTitle>Blog</PageTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
