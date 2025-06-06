// İlanları harita üzerinde marker ve cluster ile gösteren bileşen
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Leaflet default icon sorunu çözümü
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// MarkerClusterGroup için wrapper
import { createLayerComponent } from '@react-leaflet/core';

const MarkerClusterGroup = createLayerComponent(
  // Oluşturma işlevi
  function createMarkerClusterGroup({ children: _c, ...options }, ctx) {
    const clusterGroup = L.markerClusterGroup(options);
    return { instance: clusterGroup, context: { ...ctx, layerContainer: clusterGroup } };
  },
  // Güncelleme işlevi
  function updateMarkerClusterGroup(layer, props, prevProps) {
    // Özellikler değiştiyse güncelle
    if (props.attribution !== prevProps.attribution) {
      layer.setAttribution(props.attribution);
    }
  }
);

export default function ListingsMap() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch('/api/listings/map');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setListings(data);
      } catch (err) {
        console.error('Harita verisi alınamadı:', err);
        setError('Harita verisi alınamadı');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMapData();
  }, []);

  if (loading) return <div>Harita yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!listings.length) return <div>Haritada gösterilecek ilan yok.</div>;

  // Türkiye merkezli başlangıç koordinatı
  const center = [39.0, 35.0];

  return (
    <div className="w-full h-[500px] rounded shadow mb-6 overflow-hidden">
      <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> katkıda bulunanlar'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {listings.map(listing => (            <Marker
              key={listing.id}
              position={[listing.latitude, listing.longitude]}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{listing.title}</strong><br />
                  {listing.city} / {listing.district}<br />
                  <span className="text-green-700 font-bold">{listing.price} TL</span><br />
                  {listing.image && <img src={listing.image} alt="Görsel" className="w-32 h-20 object-cover rounded mt-1" />}
                  <br />
                  <a href={`/ilan/${listing.id}`} className="text-blue-600 underline">Detay</a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
