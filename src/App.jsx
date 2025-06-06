import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Menu from './components/Menu';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { Helmet, HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';
import ListingDetailPage from './pages/ListingDetailPage';
import NewsDetailPage from './pages/NewsDetailPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CategoryListingsPage from './pages/CategoryListingsPage';
import { useSiteSettings } from './hooks/useSiteSettings';
import { useAnnouncements } from './hooks/useAnnouncements';
import AdBanner from './components/AdBanner';
import './App.css';

// Basit dark mode toggle
function useDarkMode() {
  const [dark, setDark] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);
  return [dark, setDark];
}

const queryClient = new QueryClient();

function App() {
  const { settings, loading } = useSiteSettings();
  const { announcements } = useAnnouncements();
  const [dark, setDark] = useDarkMode();


  if (loading) return <div>Yükleniyor...</div>;

  // Tema rengi, arka plan ve font body'ye uygulanıyor
  if (settings?.theme_color) {
    document.body.style.setProperty('--theme-color', settings.theme_color);
  }
  if (settings?.background_image) {
    document.body.style.backgroundImage = `url('${settings.background_image}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';
  } else {
    document.body.style.backgroundImage = '';
    document.body.style.backgroundSize = '';
    document.body.style.backgroundRepeat = '';
    document.body.style.backgroundPosition = '';
  }
  // Font ailesi (örnek: ayarlardan geliyorsa uygula, yoksa varsayılan)
  document.body.style.fontFamily = settings?.font_family || 'Inter, Arial, sans-serif';

  return (
    <QueryClientProvider client={queryClient}>
    <>
      {/* HelmetProvider ve Helmet kaldırıldı, başlık ve meta tagler için alternatif eklenebilir */}
      {/* <Helmet>
        <title>{settings?.title || 'GEF Gayrimenkul Arazi Ofisi'}</title>
        {settings?.favicon && <link rel="icon" href={settings.favicon} />}
        {settings?.description && <meta name="description" content={settings.description} />}
        <meta property="og:title" content={settings?.title || 'GEF Gayrimenkul Arazi Ofisi'} />
        <meta property="og:description" content={settings?.description || ''} />
        {settings?.logo && <meta property="og:image" content={settings.logo} />}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={settings?.title || 'GEF Gayrimenkul Arazi Ofisi'} />
        <meta name="twitter:description" content={settings?.description || ''} />
        {settings?.logo && <meta name="twitter:image" content={settings.logo} />}
      </Helmet> */}
      {/* Aktif duyurular için banner ve kayan bar */}
      {announcements && announcements.length > 0 && (
        <>
          {/* Kayan bar (type: banner) */}
          {announcements.filter(a => a.type === 'banner').length > 0 && (
            <div className="w-full bg-yellow-400 text-yellow-900 py-2 overflow-hidden relative" style={{zIndex:99}}>
              <div className="animate-marquee whitespace-nowrap" style={{animationDuration:'20s'}}>
                {announcements.filter(a => a.type === 'banner').map(a => (
                  <span key={a.id} className="mx-8 font-semibold">
                    <strong>{a.title}:</strong> {a.content}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Düz bar (type: info, warning, vs.) */}
          {announcements.filter(a => a.type !== 'banner').length > 0 && (
            <div className="bg-yellow-100 text-yellow-900 text-center py-2 px-4">
              {announcements.filter(a => a.type !== 'banner').map(a => (
                <div key={a.id} className="mb-1">
                  <strong>{a.title}:</strong> {a.content}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <div className="fixed top-2 right-2 z-50">
        <button
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 shadow"
          onClick={() => setDark(d => !d)}
        >
          {dark ? '☀️ Açık Mod' : '🌙 Karanlık Mod'}
        </button>
      </div>
      <BrowserRouter>
        {/* Logo ve tema rengi */}
        <header className="flex flex-col items-center py-4" style={{ background: settings?.theme_color || '#f3f4f6' }}>
          {settings?.logo && (
            <img src={settings.logo} alt="Site Logosu" className="h-16 mb-2" />
          )}
          <h1 className="text-2xl font-bold" style={{ color: settings?.theme_color ? '#fff' : '#111' }}>
            {settings?.title || 'GEF Gayrimenkul Arazi Ofisi'}
          </h1>
        </header>
        {/* Navigation Bar (Dinamik Menü) */}
        <div className="p-4 bg-gray-100 mb-6">
          <Menu />
        </div>
        {/* Reklam alanı: Site ayarlarından alınan kod burada gösterilir */}
        <AdBanner />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ilanlar" element={<ListingsPage />} />
          <Route path="/ilan/:id" element={<ListingDetailPage />} />
          <Route path="/kategori/:slug" element={<CategoryListingsPage />} />
          <Route path="/haberler" element={<NewsPage />} />
          <Route path="/haber/:id" element={<NewsDetailPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
        </Routes>
        {/* Google Analytics veya ücretsiz alternatif için script entegrasyonu */}
        {settings?.analytics_code && (
          <script async dangerouslySetInnerHTML={{ __html: settings.analytics_code }} />
        )}
        {/* Footer ve sosyal medya */}
        <footer className="mt-10 py-6 bg-gray-100 text-center">
          <div>{settings?.footer_text}</div>
          <div className="flex justify-center gap-4 mt-2">
            {settings?.social_facebook && (
              <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">Facebook</a>
            )}
            {settings?.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">Instagram</a>
            )}
            {settings?.social_twitter && (
              <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">Twitter</a>
            )}
          </div>
        </footer>
      </BrowserRouter>
    </>
    </QueryClientProvider>
    // HelmetProvider kaldırıldı
  );
}

export default App;
