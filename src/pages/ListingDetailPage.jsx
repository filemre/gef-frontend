// İlan Detay Sayfası: Galeri, açıklama, harita (OpenStreetMap ile)
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useParams } from 'react-router-dom';
import api from '../api';
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

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then(res => {
        setListing(res.data);
        // Kapak resmi varsa başlangıçta aktif olarak ayarla
        if (res.data.featured_image_index !== null) {
          setActiveImageIndex(res.data.featured_image_index);
        } else if (res.data.images && res.data.images.length > 0) {
          // Kapak resmi yoksa ilk resmi göster
          setActiveImageIndex(0);
        }
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container mx-auto p-4 text-center">Yükleniyor...</div>;
  if (error) return <div className="container mx-auto p-4 text-center text-red-500">Hata: {error.message}</div>;
  if (!listing) return <div className="container mx-auto p-4 text-center">İlan bulunamadı.</div>;

  return (
    <div className="container mx-auto p-4">
      <PageTitle>{listing.title}</PageTitle>
      {/* Kategori etiketi */}
      {listing.category && (
        <div className="mb-4">
          <a
            href={`/kategori/${listing.category.slug}`}
            className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-semibold hover:bg-blue-200 transition"
          >
            {listing.category.name}
          </a>
        </div>
      )}
      {/* İlan detay grid yapısı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sol taraf - Galeri ve video */}
        <div className="space-y-6">
          {/* Kapak fotoğrafı ve galeri */}
          {listing.images && listing.images.length > 0 ? (
            <div>
              {/* Ana görsel (aktif görsel) */}
              <div className="mb-3 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={listing.images[activeImageIndex !== null ? activeImageIndex : 0]} 
                  alt={listing.title} 
                  className="w-full h-[400px] object-cover rounded"
                  loading="lazy"
                />
              </div>
              
              {/* Küçük resimler - yatay kaydırma */}
              {listing.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
                  {listing.images.map((img, i) => (
                    <img 
                      key={i} 
                      src={img} 
                      alt="İlan görseli" 
                      onClick={() => setActiveImageIndex(i)}
                      className={`h-24 w-24 object-cover rounded cursor-pointer transition hover:opacity-90
                        ${i === activeImageIndex ? 'ring-2 ring-blue-500' : 'opacity-80'}`} 
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400 italic mb-2 p-6 bg-gray-50 rounded-lg text-center">Görsel bulunamadı.</div>
          )}
          
          {/* YouTube Video */}
          {listing.youtube_video_url && (
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
              <iframe 
                className="w-full h-64 md:h-80" 
                src={`https://www.youtube.com/embed/${getYoutubeVideoId(listing.youtube_video_url)}`} 
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
        
        {/* Sağ taraf - Detaylar */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-green-700 font-bold text-3xl">{listing.price} TL</span>
              {listing.phone && (
                <span className="text-blue-700 font-semibold text-xl bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  <svg className="inline w-5 h-5 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  {listing.phone}
                </span>
              )}
              <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700">{listing.square_meter} m²</span>
            </div>
            
            <div className="text-gray-700 mb-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
                <span>{listing.city} / {listing.district}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                </svg>
                <span>{new Date(listing.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
            
            <div className="prose max-w-none mb-6">
              <h3 className="text-lg font-medium mb-2">İlan Açıklaması</h3>
              <p className="whitespace-pre-line">{listing.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                İletişim Bilgisi
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
                Paylaş
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Harita - İlan konumu (React Leaflet) */}
      {listing.latitude && listing.longitude && (
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Konum</h3>
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
            <MapContainer
              center={[listing.latitude, listing.longitude]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> katkıda bulunanlar'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[listing.latitude, listing.longitude]}>
                <Popup>
                  <div>
                    <strong>{listing.title}</strong><br />
                    {listing.city} / {listing.district}<br />
                    <span className="text-green-700 font-bold">{listing.price} TL</span>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    {/* İlanı Ekleyen Kullanıcı Bilgisi */}
    {listing.user && (
      <div className="mt-8 bg-white rounded-lg shadow p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">İlanı Ekleyen Kullanıcı</h3>
        <div className="flex flex-col md:flex-row md:items-center gap-2 text-gray-600">
          <span><strong>Ad Soyad:</strong> {listing.user.name}</span>
          <span className="hidden md:inline-block mx-2">|</span>
          <span><strong>E-posta:</strong> {listing.user.email}</span>
          {listing.user.role && (
            <span className="hidden md:inline-block mx-2">|</span>
          )}
          {listing.user.role && (
            <span><strong>Rol:</strong> {listing.user.role}</span>
          )}
        </div>
      </div>
    )}
  </div>
  );
}
