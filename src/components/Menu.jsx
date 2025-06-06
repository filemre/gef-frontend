

import React from 'react';
import { updateMenuOrder } from '../api/menu';
import { useMenus } from '../hooks/useMenus';
import { useLocation } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Örnek kullanıcı rolü (gerçek auth ile entegre edilecekse burası güncellenir)
const currentUserRole = 'admin'; // veya 'user', 'editor' vs.

function MenuItem({ item, items, currentPath, search }) {
  const [submenuOpen, setSubmenuOpen] = React.useState(false);
  const [showExternalWarn, setShowExternalWarn] = React.useState(false);
  // Yetki kontrolü: meta.roles varsa ve mevcut rol yoksa gösterme
  if (item.meta?.roles && Array.isArray(item.meta.roles)) {
    if (!item.meta.roles.includes(currentUserRole)) return null;
  }
  // Arama filtresi: başlık veya tooltip içinde arama
  if (search && !(item.title?.toLowerCase().includes(search) || item.meta?.tooltip?.toLowerCase().includes(search))) {
    return null;
  }
  const isActive = item.url && (currentPath === item.url || (item.url !== '/' && currentPath.startsWith(item.url)));
  const hasChildren = items.some(child => child.parent_id === item.id);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isExternal = item.url && /^(http|https):\/\//.test(item.url);
  return (
    <li className="group relative">
      <div className="flex items-center">
        <a
          href={item.url || '#'}
          target={isExternal ? '_blank' : (item.target || '_self')}
          rel={isExternal ? 'noopener noreferrer' : (item.target === '_blank' ? 'noopener noreferrer' : undefined)}
          className={
            'flex items-center gap-1 block px-3 py-2 rounded transition ' +
            (isActive ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-blue-50 text-gray-800')
          }
          title={item.meta?.tooltip || ''}
          onClick={e => {
            if (hasChildren && isMobile) {
              e.preventDefault(); setSubmenuOpen(v => !v); return;
            }
            if (isExternal) {
              e.preventDefault(); setShowExternalWarn(true);
            }
          }}
        >
          {/* İkon */}
          {item.icon && (
            <span className={item.icon + ' mr-1 text-lg'} aria-hidden="true" />
          )}
          {item.title}
          {/* Dış link simgesi */}
          {isExternal && (
            <svg className="ml-1 w-3 h-3 text-gray-400 inline" fill="none" stroke="currentColor" viewBox="0 0 20 20"><path d="M10 6h6m0 0v6m0-6L9 17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
          {/* Badge */}
          {item.meta?.badge && (
            <span
              className={
                'ml-2 px-2 py-0.5 rounded text-xs font-semibold ' +
                (item.meta.badge_color || 'bg-green-100 text-green-800')
              }
              style={item.meta.badge_color ? { background: item.meta.badge_color, color: '#fff' } : {}}
            >
              {item.meta.badge}
            </span>
          )}
          {/* Alt menü oku */}
          {hasChildren && (
            <svg className={
              'ml-1 w-3 h-3 transition-transform duration-200 ' +
              ((submenuOpen || (!isMobile && 'group-hover:rotate-90')) ? 'rotate-90' : '')
            } fill="none" stroke="currentColor" viewBox="0 0 20 20">
              <path d="M6 6l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {/* Gelişmiş tooltip (uzun açıklama, görsel, HTML desteği) */}
          {item.meta?.tooltip && (
            <span
              className="hidden group-hover:block absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs rounded px-2 py-1 z-50 whitespace-pre-line shadow-lg min-w-[180px] max-w-xs text-left"
              style={{ maxWidth: 320 }}
              dangerouslySetInnerHTML={{ __html: item.meta.tooltip }}
            />
          )}
          {/* Dış link uyarı modalı */}
          {isExternal && showExternalWarn && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded shadow-lg p-6 max-w-xs text-center">
                <div className="mb-2 text-lg font-semibold text-gray-800">Dış Linke Gidiliyor</div>
                <div className="mb-4 text-gray-600 text-sm">Bu bağlantı site dışına yönlendirecek:<br /><span className="break-all">{item.url}</span></div>
                <div className="flex justify-center gap-2">
                  <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300" onClick={e => { e.stopPropagation(); setShowExternalWarn(false); }}>Vazgeç</button>
                  <a className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700" href={item.url} target="_blank" rel="noopener noreferrer" onClick={() => setShowExternalWarn(false)}>Devam Et</a>
                </div>
              </div>
            </div>
          )}
        </a>
      </div>
      {/* Alt menü */}
      {hasChildren && (
        <ul
          className={
            'transition-all duration-300 overflow-hidden ' +
            (
              isMobile
                ? (submenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')
                : 'max-h-96 opacity-100 group-hover:max-h-96 group-hover:opacity-100'
            ) +
            ' ml-4 border-l border-gray-200 pl-2 bg-white rounded shadow-md'
          }
          style={{ minWidth: 160 }}
        >
          {items.filter(child => child.parent_id === item.id && child.active)
            .sort((a, b) => a.order - b.order)
            .map(child => (
              <MenuItem key={child.id} item={child} items={items} currentPath={currentPath} search={search} />
            ))}
        </ul>
      )}
    </li>
  );
}

function renderMenuItems(items, parent = null, currentPath = '', search = '') {
  return items
    .filter(item => item.parent_id === parent && item.active)
    .sort((a, b) => a.order - b.order)
    .map(item => (
      <MenuItem key={item.id} item={item} items={items} currentPath={currentPath} search={search} />
    ));
}

function SortableMenuItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

function Menu() {
  const { data: menus = [], isLoading, isError, refetch } = useMenus();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [menuOrder, setMenuOrder] = React.useState([]);
  const [savingOrder, setSavingOrder] = React.useState(false);
  const location = useLocation();

  // Menü sıralaması değiştiğinde backend'e kaydet
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = menus.findIndex(m => m.id === active.id);
    const newIndex = menus.findIndex(m => m.id === over.id);
    const newMenus = arrayMove(menus, oldIndex, newIndex);
    // Sadece üst menüler için sıralama kaydı (alt menüde farklı mantık gerekebilir)
    const orderList = newMenus.map((m, idx) => ({ id: m.id, order: idx + 1 }));
    setMenuOrder(orderList);
    setSavingOrder(true);
    try {
      await updateMenuOrder(orderList);
      refetch();
    } catch (e) {
      alert('Sıralama kaydedilemedi!');
    }
    setSavingOrder(false);
  };

  // Menü kapansın diye route değişiminde open=false
  React.useEffect(() => { setOpen(false); }, [location.pathname]);

  if (isLoading) return <div className="text-gray-500 py-2">Menüler yükleniyor...</div>;
  if (isError) return <div className="text-red-600 py-2">Menüler yüklenemedi</div>;

  return (
    <nav className="relative">
      {/* Hamburger buton (mobil) */}
      <button
        className="md:hidden flex items-center px-3 py-2 border rounded text-gray-700 border-gray-400 mb-2"
        onClick={() => setOpen(o => !o)}
        aria-label="Menüyü Aç/Kapat"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Menüde arama kutusu */}
      <div className="mb-2 flex items-center gap-2">
        <input
          type="text"
          className="border px-2 py-1 rounded w-full md:w-48 text-sm"
          placeholder="Menüde ara..."
          value={search}
          onChange={e => setSearch(e.target.value.toLowerCase())}
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-700 text-lg">&times;</button>
        )}
      </div>
      {/* Sürükle-bırak ile menü sıralama */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={menus.map(m => m.id)} strategy={verticalListSortingStrategy}>
          <ul
            className={
              'space-y-1 md:space-y-0 md:flex md:gap-2 md:static ' +
              (open ? 'block bg-white shadow-lg absolute left-0 top-10 z-50 w-56 p-4 rounded border md:relative md:bg-transparent md:shadow-none md:p-0 md:w-auto md:border-0' : 'hidden md:flex')
            }
          >
            {menus.map(menu => (
              <SortableMenuItem key={menu.id} id={menu.id}>
                <MenuItem item={menu} items={menus} currentPath={location.pathname} search={search} />
              </SortableMenuItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      {savingOrder && <div className="text-xs text-blue-600 mt-1">Sıralama kaydediliyor...</div>}
    </nav>
  );
}

export default Menu;
