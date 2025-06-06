import { useEffect, useState } from 'react';
import api from '../api';

// Blog yazılarını çeken custom hook
export function useBlogPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/blog')
      .then(res => setPosts(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { posts, loading, error };
}

// Tekil blog yazısı için hook
export function useBlogPost(slug) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    api.get(`/blog/${slug}`)
      .then(res => setPost(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [slug]);

  return { post, loading, error };
}
