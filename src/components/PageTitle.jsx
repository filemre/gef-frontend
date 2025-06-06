// Basit bir sayfa başlığı bileşeni
export default function PageTitle({ children }) {
  return (
    <h1 className="text-2xl font-bold mb-4">{children}</h1>
  );
}
