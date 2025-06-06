import { useQuery } from '@tanstack/react-query';
import { fetchMenus } from '../api/menu';

export function useMenus() {
  return useQuery({
    queryKey: ['menus'],
    queryFn: fetchMenus,
    staleTime: 1000 * 60 * 5, // 5 dakika cache
    refetchOnWindowFocus: false,
  });
}
