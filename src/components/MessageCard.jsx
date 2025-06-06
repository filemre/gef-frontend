// Basit bir iletişim mesajı kartı (admin paneli için örnek)
export default function MessageCard({ message }) {
  return (
    <div className="border rounded-lg p-4 shadow bg-white mb-2">
      <div className="font-semibold">{message.name} ({message.email})</div>
      <div className="text-gray-700 mt-1">{message.content}</div>
      <div className="text-xs text-gray-400 mt-2">{message.created_at}</div>
    </div>
  );
}
