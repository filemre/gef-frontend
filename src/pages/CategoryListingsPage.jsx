import { useParams, Link } from 'react-router-dom';
import { useListings } from '../hooks/useListings';
import { useListingCategories } from '../hooks/useListingCategories';
import ListingCard from '../components/ListingCard';
import PageTitle from '../components/PageTitle';

export default function CategoryListingsPage() {
  const { slug } = useParams();
  const { categories } = useListingCategories();
  const category = categories.find(c => c.slug === slug);
  const { listings, loading, error } = useListings({ category_id: category?.id });

  if (!category) return <div className="container mx-auto p-4">Kategori bulunamadı.</div>;
  if (loading) return <div className="container mx-auto p-4">Yükleniyor...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">Hata: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <PageTitle>{category.name} İlanları</PageTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {listings.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500 py-8">Bu kategoriye ait ilan bulunamadı.</div>
        ) : (
          listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        )}
      </div>
      <div className="mt-6">
        <Link to="/" className="text-blue-600 hover:underline">Tüm ilanlara dön</Link>
      </div>
    </div>
  );
}
