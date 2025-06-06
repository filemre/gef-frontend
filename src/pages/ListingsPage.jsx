// Arazi İlanları Sayfası: Filtreleme, arama ve sayfalama için temel yapı
import { useState } from 'react';
import { useListingCategories } from '../hooks/useListingCategories';
import { useListings } from '../hooks/useListings';
import ListingCard from '../components/ListingCard';
import FeaturedListings from '../components/FeaturedListings';
import PageTitle from '../components/PageTitle';
import ListingsMap from '../components/ListingsMap';

export default function ListingsPage() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minM2, setMinM2] = useState('');
  const [maxM2, setMaxM2] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 6;

  // API'den filtreli ilanları çek
  const { listings, loading, error } = useListings({
    search,
    city,
    category_id: category,
    min_price: minPrice,
    max_price: maxPrice,
    min_m2: minM2,
    max_m2: maxM2,
  });

  const { categories, loading: catLoading } = useListingCategories();

  const totalPages = Math.ceil(listings.length / perPage);
  const paginatedListings = listings.slice((page - 1) * perPage, page * perPage);

  React.useEffect(() => {
    setPage(1);
  }, [search, city, minPrice, maxPrice, minM2, maxM2]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <PageTitle>Arazi İlanları</PageTitle>
      <FeaturedListings />
      {/* Harita üzerinde toplu ilan gösterimi */}
      <ListingsMap />
      {/* Filtreleme ve arama formu */}
      <form className="flex flex-wrap gap-2 mb-4">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border p-2 rounded w-40"
        >
          <option value="">Kategori (Tümü)</option>
          {catLoading ? <option>Yükleniyor...</option> : categories?.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Başlık ile ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded w-48"
        />
        <input
          type="text"
          placeholder="Şehir"
          value={city}
          onChange={e => setCity(e.target.value)}
          className="border p-2 rounded w-32"
        />
        <input
          type="number"
          placeholder="Min Fiyat"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          className="border p-2 rounded w-28"
        />
        <input
          type="number"
          placeholder="Max Fiyat"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="border p-2 rounded w-28"
        />
        <input
          type="number"
          placeholder="Min m²"
          value={minM2}
          onChange={e => setMinM2(e.target.value)}
          className="border p-2 rounded w-28"
        />
        <input
          type="number"
          placeholder="Max m²"
          value={maxM2}
          onChange={e => setMaxM2(e.target.value)}
          className="border p-2 rounded w-28"
        />
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paginatedListings.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500 py-8">Kriterlere uygun ilan bulunamadı.</div>
        ) : (
          paginatedListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        )}
      </div>
      {/* Sayfalama butonları */}
      <div className="flex gap-2 mt-4 justify-center">
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >Önceki</button>
        <span className="px-2">{page} / {totalPages}</span>
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >Sonraki</button>
      </div>
    </div>
  );
}
