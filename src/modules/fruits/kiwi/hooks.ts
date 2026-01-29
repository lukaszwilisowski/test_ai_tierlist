import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = "/api/fruits/kiwi";

interface Item {
  _id: string;
  name: string;
  description?: string;
  price: number;
  inStock: boolean;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const response = await fetch(API_BASE);
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data as Item[];
    },
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Item>) => {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Item> }) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
