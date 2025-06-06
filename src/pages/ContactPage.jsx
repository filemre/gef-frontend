// İletişim Sayfası: Ziyaretçi mesaj formu
import { useState } from 'react';
import api from '../api';
import PageTitle from '../components/PageTitle';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Bir hata oluştu, lütfen tekrar deneyin.');
    }
  };

  // Form alanları için basit doğrulama
  const isFormValid = form.name && form.email && form.message;

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <PageTitle>İletişim</PageTitle>
      {success && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">Mesajınız iletildi!</div>}
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Adınız" className="w-full border p-2 rounded" />
        <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="E-posta" className="w-full border p-2 rounded" />
        <textarea name="message" value={form.message} onChange={handleChange} required placeholder="Mesajınız" className="w-full border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={!isFormValid}>Gönder</button>
      </form>
    </div>
  );
}
