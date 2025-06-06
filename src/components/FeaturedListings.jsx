import React from 'react';
import useFeaturedListings from '../hooks/useFeaturedListings';
import ListingCard from './ListingCard';

export default function FeaturedListings() {
  const { listings, loading, error } = useFeaturedListings();

  if (loading) return <div>Öne çıkan ilanlar yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;
  if (!listings.length) return <div>Öne çıkan ilan bulunamadı.</div>;

  return (
    <div className="featured-listings mb-8">
      <h2 className="text-xl font-bold mb-4">Öne Çıkan İlanlar</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {listings.map(listing => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
