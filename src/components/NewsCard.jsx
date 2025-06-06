// Basit bir haber kartı bileşeni
export default function NewsCard({ news }) {
  // Gösterilecek resmi belirleyelim (kapak fotoğrafı varsa onu, yoksa ilk resmi)
  const displayImage =
    news.images && news.images.length > 0
      ? news.featured_image_index !== null && news.images[news.featured_image_index]
        ? news.images[news.featured_image_index]
        : news.images[0]
      : null;

  return (
    <div className="border rounded-lg p-4 shadow bg-white">
      {/* Resim */}
      {displayImage && (
        <div className="mb-3">
          <img
            src={displayImage}
            alt={news.title}
            className="w-full h-48 object-cover rounded-md mb-3"
          />
        </div>
      )}

      <h2 className="font-semibold text-lg mb-2">{news.title}</h2>
      <p className="text-gray-600 text-sm mb-2">{news.created_at}</p>
      <p className="line-clamp-3">{news.content}</p>

      {/* Detay linki */}
      <a
        href={`/haber/${news.id}`}
        className="text-blue-600 hover:underline text-sm block mt-3"
      >
        Devamını Oku →
      </a>
    </div>
  );
}
