// Anasayfa: Son ilanlar ve son haberler grid/card yapısı

import { useListings } from '../hooks/useListings';
import ListingCard from '../components/ListingCard';
import PopularStats from '../components/PopularStats';
import PageTitle from '../components/PageTitle';

import FeaturedBlogs from '../components/FeaturedBlogs';
import FeaturedNews from '../components/FeaturedNews';
import FeaturedListings from '../components/FeaturedListings';

export default function HomePage() {
  const { listings, loading, error } = useListings();

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <PageTitle>Anasayfa</PageTitle>
      <FeaturedListings />
      <FeaturedBlogs />
      <div style={{margin:'32px 0'}} />
      <FeaturedNews />
      {/* Popüler ilanlar ve şehirler istatistikleri */}
      <PopularStats />
      <h2 className="text-2xl font-bold mb-4">En Son İlanlar</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {listings.map(listing => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
