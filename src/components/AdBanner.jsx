// Reklam alanı bileşeni: Site ayarlarından gelen reklam kodunu güvenli şekilde gösterir
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useState, useEffect, useRef } from 'react';

export default function AdBanner() {
  const { settings } = useSiteSettings();
  const adContainerRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Eğer reklam kodu varsa ve DOM hazırsa
    if (settings?.ad_code && adContainerRef.current) {
      try {
        // Önce container'ı temizle
        adContainerRef.current.innerHTML = '';
        
        // Reklam kodunu ekle
        adContainerRef.current.innerHTML = settings.ad_code;
        
        // Script etiketlerini bul ve çalıştır
        const scripts = adContainerRef.current.querySelectorAll('script');
        scripts.forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
      } catch (error) {
        console.error('Reklam kodu yüklenirken hata oluştu:', error);
      }
    }
  }, [settings?.ad_code]);
  
  if (!settings?.ad_code) return null;
  
  return (
    <div className="w-full my-4 flex justify-center">
      {/* Reklam kodu için güvenli bir container */}
      <div className="max-w-full" ref={adContainerRef} />
    </div>
  );
}
