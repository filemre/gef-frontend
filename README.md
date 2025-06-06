# GEF Gayrimenkul Arazi Ofisi - Frontend

Bu proje, React + Vite + Tailwind CSS ile geliştirilmiş modern ve ücretsiz bir emlak yönetim platformunun frontend uygulamasıdır.

## Kurulum

1. Gerekli paketleri yükleyin:
   ```bash
   npm install
   ```
2. Ortam değişkenlerini ayarlayın:
   - `frontend/.env` dosyasına aşağıdaki satırı ekleyin:
     ```
     VITE_API_BASE_URL=https://wvlcfhl0-5000.euw.devtunnels.ms/api
     ```
   - (Geliştirme için backend devtunnel adresinizi kullanın.)
3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

## Özellikler
- Anasayfa: Son ilanlar ve haberler
- Arazi ilanları: Filtreleme, arama, detay
- Haberler: AI destekli içerik, detay
- İletişim: Mesaj gönderme
- Tamamen responsive ve SEO uyumlu

## Yayınlama
- Vercel ile ücretsiz deploy edilebilir.
- API adresini `.env` dosyasından güncelleyebilirsiniz.

## Gerekli API Anahtarları
- Proje sonunda OpenRouter API anahtarı ve diğer gerekli anahtarlar ayrıca bildirilecektir.

---
Tüm kodlar ve açıklamalar Türkçedir. Sorularınız için geliştiriciye ulaşabilirsiniz.
