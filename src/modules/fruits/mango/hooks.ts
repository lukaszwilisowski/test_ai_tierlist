// src/modules/fruits/mango/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Item, CreateItem, UpdateItem } from './schema';

const API_BASE = '/api/fruits/mango';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function useItems() {
  return useQuery({
    queryKey: ['mango', 'items'],
    queryFn: async (): Promise<Item[]> => {
      const res = await fetch(API_BASE);
      const json: ApiResponse<Item[]> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: ['mango', 'items', id],
    queryFn: async (): Promise<Item> => {
      const res = await fetch(`${API_BASE}/${id}`);
      const json: ApiResponse<Item> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },
    enabled: !!id,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateItem): Promise<Item> => {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json: ApiResponse<Item> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mango', 'items'] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateItem;
    }): Promise<Item> => {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json: ApiResponse<Item> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mango', 'items'] });
      queryClient.invalidateQueries({
        queryKey: ['mango', 'items', variables.id],
      });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      const json: ApiResponse<void> = await res.json();
      if (!json.success) throw new Error(json.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mango', 'items'] });
    },
  });
}

export function useSeedItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<Item[]> => {
      const res = await fetch(`${API_BASE}/seed`, {
        method: 'POST',
      });
      const json: ApiResponse<Item[]> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mango', 'items'] });
    },
  });
}
