import React, { useEffect, useState } from 'react';

// İlanları backend API'den çeken fonksiyon
const fetchListings = async () => {
  const response = await fetch('/api/listings');
  if (!response.ok) throw new Error('İlanlar alınamadı');
  return response.json();
};

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListings()
      .then(setListings)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Arazi İlanları</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map(listing => (
          <div key={listing.id} className="bg-white rounded shadow p-4">
            <img src={listing.images[0]} alt={listing.title} className="w-full h-48 object-cover rounded mb-2" />
            <h2 className="text-lg font-semibold">{listing.title}</h2>
            <div className="text-gray-600 text-sm mb-1">{listing.city} / {listing.district}</div>
            <div className="text-green-700 font-bold mb-2">{listing.price.toLocaleString()} TL</div>
            <div className="text-sm">{listing.square_meter} m²</div>
            <p className="text-gray-700 mt-2">{listing.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListingsPage;
