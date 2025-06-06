// Popüler ilanların ve şehirlerin gösterileceği ana sayfa bileşeni
import { usePopularListings } from '../hooks/usePopularListings';
import { usePopularCities } from '../hooks/usePopularCities';
import { Link } from 'react-router-dom';

export default function PopularStats() {
  const { popularListings, loading: loadingListings } = usePopularListings();
  const { popularCities, loading: loadingCities } = usePopularCities();

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-8">
      <h2 className="text-xl font-semibold mb-4">İstatistikler</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Popüler İlanlar */}
        <div>
          <h3 className="text-lg font-medium mb-2">Popüler İlanlar</h3>
          {loadingListings ? (
            <p>Yükleniyor...</p>
          ) : (
            <ul className="space-y-2">
              {popularListings.map(listing => (
                <li key={listing.id} className="border-b pb-2">
                  <Link to={`/ilan/${listing.id}`} className="flex items-center hover:bg-gray-100 p-2 rounded">
                    {listing.image && (
                      <img src={listing.image} alt={listing.title} className="w-12 h-12 object-cover rounded mr-3" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{listing.title}</div>
                      <div className="text-sm text-gray-600">{listing.city}</div>
                    </div>
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {listing.views_count} görüntülenme
                    </div>
                  </Link>
                </li>
              ))}
              {popularListings.length === 0 && <p className="text-gray-500">Henüz popüler ilan yok</p>}
            </ul>
          )}
        </div>

        {/* Popüler Şehirler */}
        <div>
          <h3 className="text-lg font-medium mb-2">Popüler Şehirler</h3>
          {loadingCities ? (
            <p>Yükleniyor...</p>
          ) : (
            <ul className="space-y-2">
              {popularCities.map((city, index) => (
                <li key={index} className="border-b pb-2">
                  <Link to={`/ilanlar?city=${encodeURIComponent(city.city)}`} className="flex items-center justify-between hover:bg-gray-100 p-2 rounded">
                    <div className="font-medium">{city.city}</div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {city.total_views} görüntülenme
                    </div>
                  </Link>
                </li>
              ))}
              {popularCities.length === 0 && <p className="text-gray-500">Henüz popüler şehir yok</p>}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
