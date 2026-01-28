import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = "/api/fruits/mango";

export function useItems() {
  return useQuery({
    queryKey: ["mango", "items"],
    queryFn: async () => {
      const res = await fetch(API_BASE);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
  });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["mango", "items"] }),
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["mango", "items"] }),
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["mango", "items"] }),
  });
}

export function useSeedItems() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE}/seed`, { method: "POST" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["mango", "items"] }),
  });
}
