// Basit bir ilan kartı bileşeni
export default function ListingCard({ listing }) {
  // Gösterilecek resmi belirleyelim (kapak fotoğrafı varsa onu, yoksa ilk resmi)
  const displayImage = 
    listing.images && listing.images.length > 0
      ? (listing.featured_image_index !== null && listing.images[listing.featured_image_index])
        ? listing.images[listing.featured_image_index]
        : listing.images[0]
      : null;

  return (
    <div className="border rounded-lg p-4 shadow">
      {/* Resim */}
      {displayImage && (
        <div className="mb-3">
          <img
            src={displayImage}
            alt={listing.title}
            className="w-full h-48 object-cover rounded-md mb-3"
          />
        </div>
      )}
      
      <h2 className="font-semibold text-lg">{listing.title}</h2>
      <p>{listing.city} / {listing.district}</p>
      <p className="text-green-700 font-bold">{listing.price} TL</p>
      <p>{listing.square_meter} m²</p>
      <div className="flex gap-2 mt-2">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/ilan/' + listing.id)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >Facebook'ta Paylaş</a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + '/ilan/' + listing.id)}&text=${encodeURIComponent(listing.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline text-sm"
        >Twitter'da Paylaş</a>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(listing.title + ' ' + window.location.origin + '/ilan/' + listing.id)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:underline text-sm"
        >WhatsApp'ta Paylaş</a>
      </div>
    </div>
  );
}
