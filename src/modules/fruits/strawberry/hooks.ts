import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateItem, Item, UpdateItem } from './schema';

const API_BASE = '/api/fruits/strawberry';
const ITEMS_QUERY_KEY = ['strawberry', 'items'] as const;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function useItems() {
  return useQuery<Item[]>({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch(API_BASE);
      const json = (await response.json()) as ApiResponse<Item[]>;
      if (!response.ok || !json.success) {
        throw new Error(json.error ?? 'Failed to load items');
      }
      return json.data ?? [];
    },
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateItem) => {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = (await response.json()) as ApiResponse<Item>;
      if (!response.ok || !json.success || !json.data) {
        throw new Error(json.error ?? 'Failed to create item');
      }
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateItem }) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = (await response.json()) as ApiResponse<Item>;
      if (!response.ok || !json.success || !json.data) {
        throw new Error(json.error ?? 'Failed to update item');
      }
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      const json = (await response.json()) as ApiResponse<{ message: string }>;
      if (!response.ok || !json.success) {
        throw new Error(json.error ?? 'Failed to delete item');
      }
      return json.data ?? { message: 'Deleted' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
    },
  });
}
