// Menü sıralamasını güncelle (id ve yeni order dizisi gönderilir)
export async function updateMenuOrder(orderList) {
  // orderList: [{id: 1, order: 1}, ...]
  const response = await axios.post('/api/menus/order', { order: orderList });
  return response.data;
}
import axios from 'axios';

export async function fetchMenus() {
  const response = await axios.get('/api/menus');
  return response.data;
}
