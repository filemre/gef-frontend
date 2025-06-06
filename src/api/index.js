// API istekleri için temel axios instance'ı
import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global hata yakalama (ör: 401, 403, 500)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        // Oturum süresi dolduysa giriş sayfasına yönlendir
        window.location.href = '/giris';
      } else if (error.response.status === 403) {
        alert('Bu işlemi yapmaya yetkiniz yok!');
      } else if (error.response.status >= 500) {
        alert('Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
