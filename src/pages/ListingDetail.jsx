import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Tekil ilan detayını backend API'den çeken fonksiyon
const fetchListingDetail = async (id) => {
  const response = await fetch(`/api/listings/${id}`);
  if (!response.ok) throw new Error('İlan detayı alınamadı');
  return response.json();
};

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListingDetail(id)
      .then(setListing)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;
  if (!listing) return <div>İlan bulunamadı.</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <img src={listing.images[0]} alt={listing.title} className="w-full h-64 object-cover rounded mb-4" />
          <div className="flex gap-2 mb-4">
            {listing.images.slice(1).map((img, i) => (
              <img key={i} src={img} alt="Galeri" className="w-24 h-16 object-cover rounded" />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-2 text-gray-600">{listing.city} / {listing.district}</div>
          <div className="mb-2 text-green-700 font-bold text-xl">{listing.price.toLocaleString()} TL</div>
          <div className="mb-2">{listing.square_meter} m²</div>
          <p className="mb-4 text-gray-700">{listing.description}</p>
          <div className="mb-4">
            <span className="font-semibold">Harita:</span>
            <iframe
              title="Harita"
              width="100%"
              height="250"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${listing.longitude-0.01}%2C${listing.latitude-0.01}%2C${listing.longitude+0.01}%2C${listing.latitude+0.01}&layer=mapnik&marker=${listing.latitude}%2C${listing.longitude}`}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
